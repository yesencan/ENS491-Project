import re
import torch
from transformers import BertModel, BertTokenizer # !pip install transformers

def create_distilprotbert_embeddings(modelname, sequences, savepath):
    try:
        embs_matrix = torch.load(savepath)
    except:
        embs_matrix = {}

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tokenizer = BertTokenizer.from_pretrained(modelname, do_lower_case=False)
    model = BertModel.from_pretrained(modelname).to(device)

    for seq in sequences: 
        if seq in embs_matrix:
            continue
        prep_seq = " ".join(list(seq.upper()))
        prep_seq = re.sub(r"[UZOB]", "X", prep_seq).replace("_","-")

        encoded_input = tokenizer.encode_plus(prep_seq, return_tensors='pt')
        with torch.no_grad():
            outputs = model(encoded_input["input_ids"])

        if seq not in embs_matrix:
            embs_matrix[seq] = outputs.last_hidden_state[0][0,:]

    torch.save(embs_matrix, savepath)



def create_embeddings(sequences):
    modelname = 'yarongef/DistilProtBert'
    savepath = "model/checkpoints/distilprotbert_embeddings/distilprotbert_phosphosite.pt"
    create_distilprotbert_embeddings(modelname, sequences, savepath)
