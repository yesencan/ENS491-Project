import flask.json
from flask import Flask, request
import protein_utils
import data_utils
from model import model
from flask_cors import CORS
import re


def create_app():
    app = Flask(__name__)
    CORS(app)
    
    @app.route("/home")
    def home():
        return "<p>Home Page</p>"

    @app.post("/api/predict/gene-id")
    def predict_gene_id():
        omit_errors = request.json["omitErrors"]
        test_data = []
        invalid_ids = []
        invalid_positions = []
        gene_list = request.json["geneList"]

        if len(gene_list) == 0:
            return flask.json.jsonify(error= 'empty-test-data'), 400

        for i in request.json["geneList"]:
            gene = i['gene']

            gene_sequence, is_invalid = protein_utils.fetch_gene_sequence(gene)
            if is_invalid:
                invalid_ids.append(gene)
                continue

            positions = i["positions"]
            peptides, invalid = protein_utils.separate_peptides(gene_sequence, positions)
            if len(invalid) > 0:
                invalid_positions.append(
                    {'id': gene, 'invalid_positions': invalid}
                )
                continue    
            test_data.extend([[gene] + i for i in peptides])
        
        if not omit_errors and (len(invalid_ids) > 0 or len(invalid_positions) > 0):
            return flask.json.jsonify(
                invalid_ids= invalid_ids,
                invalid_positions= invalid_positions,
                error= 'invalid_id_pos'), 400
        
        if len(test_data) == 0:
            return flask.json.jsonify(error= 'empty-test-data'), 400

        test_data_filename = data_utils.write_test_data(test_data)
        results = model.run(test_data_filename)
        data_utils.remove_test_data(test_data_filename)


        return flask.json.jsonify(
            results=results
        )


    @app.post("/api/predict/sequence-file")
    def predict_sequence_file():
        aminoacid_set = set(['X', 'A', 'R', 'N', 'D', 'C', 'Q', 'E', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V'])
        
        is_invalid = False
        invalid_ids = []
        short_seq_ids = []

        json_data = flask.json.loads(request.files['json'].read())
        aminoacids = set(json_data['aminoacids'])

        omit_errors = json_data["omitErrors"]

        test_data = []
        fasta_records = protein_utils.parse_fasta(request.files['file'].read().decode('utf-8'))
        for record in fasta_records: 
            gene = protein_utils.get_uniprot_id(record.id)

            sequence = str(record.seq)
            if not set(sequence.upper()).issubset(aminoacid_set):
                is_invalid = True
                invalid_ids.append(gene)
                continue
            if len(sequence) < 10:
                short_seq_ids.append(gene)
                continue
            
            peptides, _ = protein_utils.separate_peptides(sequence,aminoacids=aminoacids)
            test_data.extend([[gene] + i for i in peptides])
        

        if len(aminoacids) == 0:
            return flask.json.jsonify(
                error= 'no_target_selected'), 400
        
        if not omit_errors and len(short_seq_ids) > 0:
            return flask.json.jsonify(
                invalid_ids= short_seq_ids,
                error= 'short-seq'), 400

        if len(fasta_records) == 0:
            return flask.json.jsonify(
                error= 'incorrect_format'), 400
        
        if not omit_errors and is_invalid:
            return flask.json.jsonify(
                invalid_ids= invalid_ids,
                error= 'invalid_aa_seq'), 400
        
        if len(test_data) == 0:
            return flask.json.jsonify(error= 'no-site'), 400
        

        test_data_filename = data_utils.write_test_data(test_data)
        try:
            results = model.run(test_data_filename)
            data_utils.remove_test_data(test_data_filename)
        except:
            data_utils.remove_test_data(test_data_filename)
            return flask.json.jsonify(
                error= 'incorrect_format'), 400

        return flask.json.jsonify(
            results=results
        )

    @app.post("/api/predict/sequence-string")
    def predict_sequence_string():
        aminoacid_set = set(['X', 'A', 'R', 'N', 'D', 'C', 'Q', 'E', 'G', 'H', 'I', 'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V'])
        omit_errors = request.json["omitErrors"]
        
        is_invalid = False
        invalid_ids = []
        short_seq_ids = []

        json_data = request.json
        fasta_sequence = json_data['fasta']
        aminoacids = set(json_data['aminoacids'])
    
        test_data = []
        fasta_records = protein_utils.parse_fasta(fasta_sequence) 
        for record in fasta_records:
            gene = protein_utils.get_uniprot_id(record.id)

            sequence = str(record.seq)
            if not set(sequence.upper()).issubset(aminoacid_set):
                is_invalid = True
                invalid_ids.append(gene)
                continue
            if len(sequence) < 10:
                short_seq_ids.append(gene)
                continue

            peptides, _ = protein_utils.separate_peptides(sequence,aminoacids=aminoacids)
            test_data.extend([[gene] + i for i in peptides])
        

        if len(aminoacids) == 0:
            return flask.json.jsonify(
                error= 'no_target_selected'), 400
        
        if not omit_errors and len(short_seq_ids) > 0:
            return flask.json.jsonify(
                invalid_ids= short_seq_ids,
                error= 'short-seq'), 400

        if len(fasta_records) == 0:
            return flask.json.jsonify(
                error= 'incorrect_format'), 400
        
        if not omit_errors and is_invalid:
            return flask.json.jsonify(
                invalid_ids= invalid_ids,
                error= 'invalid_aa_seq'), 400
        
        if len(test_data) == 0:
            return flask.json.jsonify(error= 'no-site'), 400
        

        test_data_filename = data_utils.write_test_data(test_data)
        try:
            results = model.run(test_data_filename)
            data_utils.remove_test_data(test_data_filename)
        except:
            data_utils.remove_test_data(test_data_filename)
            return flask.json.jsonify(
                error= 'incorrect_format'), 400

        return flask.json.jsonify(
            results=results
        )
    
    return app



if __name__ == "__main__":
    app = create_app()
    app.run()