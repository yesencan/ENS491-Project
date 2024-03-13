import os
import pickle
import random
from sklearn import preprocessing

import torch
import torch.nn.functional as F
from scripts.utils.data_utils import load_phosphosite_data, load_kinase_data, get_processor, read_torch_embedding
from scripts.data.data_processors.kinase_embedding_generator import KinaseEmbeddingGenerator

class ZeroShotDataset(torch.utils.data.Dataset):
    def __init__(self, phosphosite_data, kinase_data, kinase_info_dict, phosphosite_data_dict):
        
        # Data Properties
        self.phosphosite_data = phosphosite_data
        self.kinase_data = kinase_data
        self.unseen_data = {
            'sequences' : [],
            'properties' : []
        }

        for unique in phosphosite_data_dict['unique_kinases']:
            self.unseen_data['sequences'].append(kinase_data[unique]['sequences'])
            self.unseen_data['properties'].append(kinase_data[unique]['properties'])
        self.unseen_data['sequences'] = torch.stack(self.unseen_data['sequences'], dim=0)
        self.unseen_data['properties'] = torch.stack(self.unseen_data['properties'], dim=0)
        
        # Information Properties
        self.kinase_info_dict = kinase_info_dict
        self.phosphosite_data_dict = phosphosite_data_dict
        self.label_mapping = {i : kinase_id for i, kinase_id in enumerate(phosphosite_data_dict['unique_kinases'])}
        
    def __len__(self):
        return len(self.phosphosite_data)

    def __getitem__(self, idx):
        return {
            'phosphosites' : self.phosphosite_data[idx]
        }

    def save_embed_scaler(self, config, embed_scaler):
        base_dir = 'embed_scaler'
        model_path = config['training']['saved_model_path'].split('/')[-1]
        scaler_save_path = os.path.join(base_dir, model_path)

        # Create the directory if it doesn't exist
        if not os.path.exists(scaler_save_path):
            os.makedirs(scaler_save_path)

        # Save the scaler
        scaler_file_path = os.path.join(scaler_save_path, 'embed_scaler.pkl')
        with open(scaler_file_path, 'wb') as f:
            pickle.dump(embed_scaler, f)

        print(f"Scaler saved to {scaler_file_path}")

    def load_embed_scaler(self, config):
        base_dir = 'embed_scaler'
        model_path = config['testing']['load_model_path'].split('/')[-1]
        scaler_file_path = os.path.join(base_dir, model_path, 'embed_scaler.pkl')
        if not os.path.exists(scaler_file_path):
            print(f"Scaler file not found at {scaler_file_path}")
            return None
        with open(scaler_file_path, 'rb') as f:
            embed_scaler = pickle.load(f)
        return embed_scaler

    def _normalize_data(self, config, fit_to_data=False):
        data_shape = self.phosphosite_data.size()
        if len(data_shape) == 3:
            self.phosphosite_data = self.phosphosite_data.view((data_shape[0], data_shape[1] * data_shape[2]))
            if fit_to_data:
                self.embed_scaler = preprocessing.StandardScaler().fit(self.phosphosite_data)
                self.save_embed_scaler(config, self.embed_scaler)
            else:
                self.embed_scaler = self.load_embed_scaler(config)
            self.phosphosite_data = self.embed_scaler.transform(self.phosphosite_data)
            self.phosphosite_data = torch.from_numpy(self.phosphosite_data).to(torch.float32)
            self.phosphosite_data = self.phosphosite_data.view((data_shape[0], data_shape[1], data_shape[2]))
        elif len(data_shape) == 2:
            if fit_to_data:
                self.embed_scaler = preprocessing.StandardScaler().fit(self.phosphosite_data)
                self.save_embed_scaler(config, self.embed_scaler)
            else:
                self.embed_scaler = self.load_embed_scaler(config)
            self.phosphosite_data = self.embed_scaler.transform(self.phosphosite_data)
            self.phosphosite_data = torch.from_numpy(self.phosphosite_data).to(torch.float32)