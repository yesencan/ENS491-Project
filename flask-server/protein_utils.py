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

                if i < 7:
                    peptide = pad_peptide(peptide, 'start')
                elif i > len(sequence) - 8:
                    peptide = pad_peptide(peptide, 'end')

                result.append([i + 1, peptide])
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

                if position < 7:
                    peptide = pad_peptide(peptide, 'start')
                elif position > len(sequence) - 8:
                    peptide = pad_peptide(peptide, 'end')

                result.append([position + 1, peptide])
        return result

def pad_peptide(peptide, pad_direction):
    padding = '_' * (15 - len(peptide))
    peptide = peptide + padding if pad_direction == 'end' else padding + peptide
    return peptide
    
def get_uniprot_id(s):
    parts = s.split('|')
    if len(parts) >= 3:
        return parts[1]
    else:
        return s
