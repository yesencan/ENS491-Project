import flask.json
from flask import Flask, request
import protein_utils
app = Flask(__name__)

@app.route("/home")
def home():
    return "<p>Home Page</p>"

@app.post("/api/gene")
def gene_post():
    res = []
    for i in request.json["geneList"]:
        gene = i['gene']
        gene_sequence = protein_utils.fetch_gene_sequence(gene)
        positions = i["positions"]
        peptides = protein_utils.separate_peptides(gene_sequence, positions)
        for peptide_record in peptides:
            #TODO: Run real prediction when model is ready
            res.append(
                {"gene": gene,
                 "peptide": peptide_record[0],
                  "position": peptide_record[1],
                  "prediction": "Q05655",
                  "probability": 0.85
                }
            )


    return flask.json.jsonify(
        results=res
    )


@app.post("/api/predict/sequence-file")
def sequence_post():
    json_data = flask.json.loads(request.files['json'].read())

    res = []

    fasta_records = protein_utils.parse_fasta(request.files['file'].read().decode('utf-8'))
    for record in fasta_records:
        peptides = protein_utils.separate_peptides(str(record.seq))
        for peptide_record in peptides:
            #TODO: Run real prediction when model is ready
            res.append(
                {"gene": protein_utils.get_uniprot_id(record.id),
                 "peptide": peptide_record[0],
                  "position": peptide_record[1],
                  "prediction": "Q05655",
                  "probability": 0.85
                }
            )
    
    return flask.json.jsonify(
        results=res
    )


if __name__ == "__main__":
    app.run()