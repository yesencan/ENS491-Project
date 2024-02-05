import requests
from io import StringIO
from Bio import SeqIO

def fetch_gene_sequence(gene):
    res = requests.get(f'https://rest.uniprot.org/uniprotkb/{gene}.fasta')
    
    fasta_io = StringIO(res.text) 
    records = SeqIO.parse(fasta_io, "fasta") 
    
    sequence = ''
    for record in records:
        sequence = record.seq
        break

    fasta_io.close()
    return sequence