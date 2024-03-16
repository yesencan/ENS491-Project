import flask.json
from flask import Flask, request
import protein_utils
app = Flask(__name__)

@app.route("/home")
def home():
    return "<p>Home Page</p>"

@app.post("/api/predict/gene-id")
def predict_gene_id():
    res = []
    for i in request.json["geneList"]:
        gene = i['gene']
        gene_sequence = protein_utils.fetch_gene_sequence(gene)
        positions = i["positions"]
        peptides = protein_utils.separate_peptides(gene_sequence, positions)
        for peptide_record in peptides:
            #TODO: Run real prediction when model is ready
            res.append(
                { 
                    "geneId": gene,
                    "proteinSeq": peptide_record[0],
                    "position": peptide_record[1],
                    "probKinase": "Q05655",
                    "probability": 0.85,
                    "family": "PKA",
                    "group": "AGC"
                }
            )


    return flask.json.jsonify(
        results=res
    )


@app.post("/api/predict/sequence-file")
def predict_sequence_file():
    json_data = flask.json.loads(request.files['json'].read())
    aminoacids = set(json_data['aminoacids'])
    
    res = []

    fasta_records = protein_utils.parse_fasta(request.files['file'].read().decode('utf-8'))
    for record in fasta_records:
        peptides = protein_utils.separate_peptides(str(record.seq),aminoacids=aminoacids)
        for peptide_record in peptides:
            #TODO: Run real prediction when model is ready
            res.append(
                {
                    "geneId": protein_utils.get_uniprot_id(record.id),
                    "proteinSeq": peptide_record[0],
                    "position": peptide_record[1],
                    "probKinase": "Q05655",
                    "probability": 0.85,
                    "family": "PKA",
                    "group": "AGC"
                }
            )
    
    return flask.json.jsonify(
        results=res
    )

@app.post("/api/predict/sequence-string")
def predict_sequence_string():
    json_data = request.json
    fasta_sequence = json_data['fasta']
    aminoacids = set(json_data['aminoacids'])
    
    res = []

    fasta_records = protein_utils.parse_fasta(fasta_sequence)
    for record in fasta_records:
        peptides = protein_utils.separate_peptides(str(record.seq),aminoacids=aminoacids)
        for peptide_record in peptides:
            #TODO: Run real prediction when model is ready
            res.append(
                {
                    "geneId": protein_utils.get_uniprot_id(record.id),
                    "proteinSeq": peptide_record[0],
                    "position": peptide_record[1],
                    "probKinase": "Q05655",
                    "probability": 0.85,
                    "family": "PKA",
                    "group": "AGC"
                }
            )
    
    return flask.json.jsonify(
        results=res
    )
if __name__ == "__main__":
    app.run()