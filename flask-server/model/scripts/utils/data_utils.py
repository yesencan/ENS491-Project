import torch
import pickle
import pandas as pd

from model.scripts.data.data_processors.protvec_processor import ProtVecProcessor
from model.scripts.data.data_processors.esm_processor import ESMProcessor
from model.scripts.data.data_processors.msa_processor import MsaProcessor

def load_phosphosite_data(filename):
    df = pd.read_csv(filename)

    phosphosite_ids = df["SUB_ACC_ID"].tolist()
    phosphosite_sequences = df["SITE_+/-7_AA"].tolist()

    return {
        "phosphosite_ids" : phosphosite_ids,
        "phosphosite_sequences" : phosphosite_sequences,
    }


def load_kinase_data(filename):
    kinase_data = {}
    df = pd.read_csv(filename)
    for _, row in df.iterrows():
        uniprot_id = row['Kinase']
        data_dict = {
            "family": row['Family'],
            "group": row['Group'],
            "enzymes_vec": torch.tensor(list(map(float, list(row['EC']))), dtype=torch.float32),
            "domain" : row['Kinase_Domain'],
            "kin2vec": torch.stack([torch.tensor(float(value), dtype=torch.float32) for value in row['Kin2Vec'].strip("[]").split()]),
            "pathway": torch.tensor([int(bit) for bit in row['Kegg_Pathways']], dtype=torch.float32)
        }
        if 'Kinase_Active_Site_Kin2vec_with_context' in df.columns:
            active_site = row['Kinase_Active_Site_Kin2vec_with_context']
            active_site_vector = torch.stack([torch.tensor(float(value), dtype=torch.float32) for value in active_site.strip("[]").split()])
            data_dict["active_site_kin2vec"] = active_site_vector
        kinase_data[uniprot_id] = data_dict
    return kinase_data


def get_processor(processor_config):
    processor_type = processor_config['processor_type']
    if processor_type == 'protvec':
        return ProtVecProcessor(processor_config)
    elif processor_type == 'esm':
        return ESMProcessor(processor_config)
    elif processor_type == 'msa':
        return MsaProcessor(processor_config)
    else:
        return None


def read_torch_embedding(embedding_path, sequences, embedding_mode):
    try:
        loaded_embeddings_dict = torch.load(embedding_path)
        result_list = []
        for sequence in sequences:
            embedding_tensor = loaded_embeddings_dict.get(sequence, None)
            if embedding_tensor is not None:
                embedding_tensor = select_embedding_slice(
                    embedding_tensor,
                    embedding_mode,
                    len(sequence)
                )
                result_list.append(embedding_tensor)
            else:
                print(f"Embedding for sequence '{sequence}' not found.")
        
        result_tensor = torch.stack(result_list)
        return result_tensor
    except Exception as e:
        print(f"Error reading torch embedding: {e}")
        return None
    

def select_embedding_slice(embedding_tensor, embedding_mode, sequence_length):
    data_shape = embedding_tensor.size()
    if embedding_mode != 'sequence':
        if embedding_mode == 'cls':
            if len(data_shape) == 2:
                return embedding_tensor[0, :]
            elif len(data_shape) == 3:
                return embedding_tensor[:, 0, :]
            else:
                raise NotImplementedError
        elif embedding_mode == 'avg':
            if sequence_length + 2 <= embedding_tensor.size()[0]:
                return torch.mean(embedding_tensor[:sequence_length+2], dim=0)
            elif sequence_length <= embedding_tensor.size()[0]:
                return torch.mean(embedding_tensor[:sequence_length], dim=0)
            else:
                raise NotImplementedError
        elif embedding_mode == 'middle':
            if len(data_shape) == 2:
                middle_index = data_shape[0]//2
                return embedding_tensor[middle_index, :]
            elif len(data_shape) == 3:
                middle_index = data_shape[1]//2
                return embedding_tensor[:, middle_index, :]
            else:
                raise NotImplementedError
        else:
            raise NotImplementedError
    return embedding_tensor
    