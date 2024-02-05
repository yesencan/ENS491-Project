import flask.json
from flask import Flask, request
app = Flask(__name__)

@app.route("/home")
def home():
    return "<p>Home Page</p>"


#TODO: integrate with uniprot api
@app.post("/api/gene")
def gene_post():
    res = []
    for i in request.json["geneList"]:
        gene = i["gene"]
        positions = i["positions"]
        for j in positions:
            #prediction here
            res.append(
                {"gene": gene,
                  "position": j,
                  "prediction": "Q05655",
                  "probability": 0.85
                }
            )


    return flask.json.jsonify(
        results=res
    )
if __name__ == "__main__":
    app.run()