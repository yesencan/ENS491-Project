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
    error = 0 if len(records) > 0 else 1

    sequence = ''
    for record in records:
        sequence = record.seq
        break
    
    return str(sequence), error

def separate_peptides(sequence, positions=[], aminoacids=set(['S', 'T', 'Y', 'H'])):  
    if positions == []:
        result = []
        for i, residue in enumerate(sequence):
            if residue in aminoacids:
                start = max(0, i - 7)
                end = i + 7
                peptide = sequence[start:end + 1]

                if len(peptide) < 10:
                    continue

                peptide = pad_peptide(peptide, i - start)

                result.append([i + 1, peptide])
        return result, []
    
    else:
        result = []

        invalid_positions = [p for p in positions if p > len(sequence) or p < 0]
        positions = [p - 1 for p in positions if 0 < p <= len(sequence)]

        for position in positions:
            residue = sequence[position]
            if residue in aminoacids:
                start = max(0, position - 7)
                end = position + 7
                peptide = sequence[start:end + 1]
                
                if len(peptide) < 10:
                    continue

                peptide = pad_peptide(peptide, position - start)

                result.append([position + 1, peptide])
            else:
                invalid_positions.append(position)
        return result, invalid_positions

def pad_peptide(peptide, pad_position):
    peptide = '_' * (7 - pad_position) + peptide
    peptide = peptide + '_' * (15 - len(peptide))
    return peptide
    
def get_uniprot_id(s):
    parts = s.split('|')
    if len(parts) >= 3:
        return parts[1]
    else:
        return s
