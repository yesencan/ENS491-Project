import flask.json
from flask import Flask, request
import protein_utils
import data_utils
from model import model
app = Flask(__name__)

@app.route("/home")
def home():
    return "<p>Home Page</p>"

@app.post("/api/predict/gene-id")
def predict_gene_id():
    test_data = []
    for i in request.json["geneList"]:
        gene = i['gene']
        gene_sequence = protein_utils.fetch_gene_sequence(gene)
        positions = i["positions"]
        peptides = protein_utils.separate_peptides(gene_sequence, positions)
        test_data.extend([[gene] + i for i in peptides])
       
    test_data_filename = data_utils.write_test_data(test_data)
    results = model.run(test_data_filename)
    data_utils.remove_test_data(test_data_filename)

    return flask.json.jsonify(
        results=results
    )


@app.post("/api/predict/sequence-file")
def predict_sequence_file():
    json_data = flask.json.loads(request.files['json'].read())
    aminoacids = set(json_data['aminoacids'])
    
    test_data = []
    fasta_records = protein_utils.parse_fasta(request.files['file'].read().decode('utf-8'))
    for record in fasta_records:
        gene = protein_utils.get_uniprot_id(record.id)
        peptides = protein_utils.separate_peptides(str(record.seq),aminoacids=aminoacids)
        test_data.extend([[gene] + i for i in peptides])
    
    test_data_filename = data_utils.write_test_data(test_data)
    results = model.run(test_data_filename)
    data_utils.remove_test_data(test_data_filename)

    return flask.json.jsonify(
        results=results
    )

@app.post("/api/predict/sequence-string")
def predict_sequence_string():
    json_data = request.json
    fasta_sequence = json_data['fasta']
    aminoacids = set(json_data['aminoacids'])
    
    test_data = []
    fasta_records = protein_utils.parse_fasta(fasta_sequence)
    for record in fasta_records:
        gene = protein_utils.get_uniprot_id(record.id)
        peptides = protein_utils.separate_peptides(str(record.seq),aminoacids=aminoacids)
        test_data.extend([[gene] + i for i in peptides])
    
    test_data_filename = data_utils.write_test_data(test_data)
    results = model.run(test_data_filename)
    data_utils.remove_test_data(test_data_filename)
    
    return flask.json.jsonify(
        results=results
    )

if __name__ == "__main__":
    app.run()