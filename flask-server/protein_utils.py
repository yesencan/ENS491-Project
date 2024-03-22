import requests
from io import StringIO
from Bio import SeqIO

def parse_fasta(fasta_str):
    fasta_io = StringIO(fasta_str) 
    records = list(SeqIO.parse(fasta_io, "fasta") )
    fasta_io.close()
    return records

def fetch_gene_sequence(gene):
    res = requests.get(f'https://rest.uniprot.org/uniprotkb/{gene}.fasta')
    
    records = parse_fasta(res.text) 
    
    sequence = ''
    for record in records:
        sequence = record.seq
        break
    
    return str(sequence)

def separate_peptides(sequence, positions=[], aminoacids=set(['S', 'T', 'Y', 'H'])):
    if positions == []:
        result = []
        for i, residue in enumerate(sequence):
            if residue in aminoacids:
                start = max(0, i - 7)
                end = i + 7
                peptide = sequence[start:end + 1]

                result.append([pad_peptide(peptide, residue), i + 1])
        return result
    
    else:
        result = []
        positions = [p - 1 for p in positions if 0 < p <= len(sequence)]
        for position in positions:
            residue = sequence[position]
            if residue in aminoacids:
                start = max(0, position - 7)
                end = position + 7
                peptide = sequence[start:end + 1]

                result.append([pad_peptide(peptide, residue), position + 1])
        return result

def pad_peptide(peptide, residue):
    if len(peptide) == 15:
        return peptide
    else:
        if peptide.find(residue) < 7:
            left_padding = '_' * (7 - peptide.find(residue))
            peptide = left_padding + peptide
        
        right_padding = '_' * (15 - len(peptide))
        peptide = peptide + right_padding
        return peptide
    
def get_uniprot_id(s):
    parts = s.split('|')
    if len(parts) >= 3:
        return parts[1]
    else:
        return s