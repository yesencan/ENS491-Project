import torch
import random
import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

from model.scripts.utils.data_utils import get_processor, read_torch_embedding


class KinaseEmbeddingGenerator:
    def __init__(self, kinase_properties_dict, kinase_processor_config, encoders=None):
        self.kinase_properties_dict = kinase_properties_dict
        self.kinase_processor_config = kinase_processor_config
        self.processor = get_processor(kinase_processor_config)

        # Encode families and groups
        self.unique_families = sorted(list(set(item['family'] for item in kinase_properties_dict.values())))
        self.unique_groups = sorted(list(set(item['group'] for item in kinase_properties_dict.values())))
        self.encoded_family_dict, self.family_encoder = self._get_onehot_encoding_dict(self.unique_families, encoders['family'] if encoders is not None else None)
        self.encoded_group_dict, self.group_encoder = self._get_onehot_encoding_dict(self.unique_groups, encoders['group'] if encoders is not None else None)
        print()


    def create_kinase_embeddings_2(self, unique_kinase_ids, embedding_mode):
        kinase_sequences = []
        kinase_embeddings_dict = {kin_id : {'sequences' : [], 'properties' : []} for kin_id in unique_kinase_ids}

        for kinase_id in unique_kinase_ids:
            kinase_properties = self.kinase_properties_dict.get(kinase_id, None)

            if kinase_properties:
                embeddings = []

                if self.kinase_processor_config['use_family']:
                    family_embedding = self.process_family(kinase_properties['family'])
                    embeddings.append(family_embedding)

                if self.kinase_processor_config['use_group']:
                    group_embedding = self.process_group(kinase_properties['group'])
                    embeddings.append(group_embedding)

                if self.kinase_processor_config['use_enzymes']:
                    enzyme_embedding = self.process_enzymes(kinase_properties['enzymes_vec'])
                    embeddings.append(enzyme_embedding)
                
                if self.kinase_processor_config['use_kin2vec']:
                    kin2vec_embedding = self.process_kin2vec(kinase_properties['kin2vec'])
                    embeddings.append(kin2vec_embedding)
                
                if self.kinase_processor_config['use_pathway']:
                    pathway_embedding = self.process_pathway(kinase_properties['pathway'])
                    embeddings.append(pathway_embedding)
                
                if self.kinase_processor_config['use_active_site']:
                    active_site_embedding = self.process_active_site(kinase_properties['active_site_kin2vec'])
                    embeddings.append(active_site_embedding)
                
                # Concatenate the embeddings into a single tensor
                if len(embeddings) > 0:
                    kinase_embeddings_dict[kinase_id]['properties'] = torch.cat(embeddings, dim=-1).to(torch.float32)
                else:
                    kinase_embeddings_dict[kinase_id]['properties'] = torch.tensor([])

            if self.kinase_processor_config['use_domain']:
                # For efficient using, instead of one by one, tokenization of sequence used with all sequence
                kinase_sequences.append(kinase_properties['domain'])
        
        if self.kinase_processor_config['use_domain']:
            if self.kinase_processor_config['read_embeddings']:
                kinase_sequence_embeddings = read_torch_embedding(
                    self.kinase_processor_config['kinase_embedding_path'],
                    kinase_sequences,
                    embedding_mode
                )
            else:
                kinase_sequence_embeddings = self.processor.process_kinase_sequence(kinase_sequences)

            for kin_idx, kinase_id in enumerate(unique_kinase_ids):
                kinase_embeddings_dict[kinase_id]['sequences'] = kinase_sequence_embeddings[kin_idx]

        else:
            for kin_idx, kinase_id in enumerate(unique_kinase_ids):
                kinase_sequence_embeddings = torch.tensor([])
                kinase_embeddings_dict[kinase_id]['sequences'] = kinase_sequence_embeddings

        return kinase_embeddings_dict
    

    def process_family(self, feature):
        return self.encoded_family_dict[feature]
    
    def process_group(self, feature):
        return self.encoded_group_dict[feature]

    def process_enzymes(self, feature):
        return feature

    def process_kin2vec(self, feature):
        return feature

    def process_pathway(self, feature):
        return feature

    def process_domain(self, feature):
        return feature

    def process_active_site(self, feature):
        return feature

    
    def _get_onehot_encoding_dict(self, class_list, encoders=None):
        onehot_encoded, encoders = self._onehot_encode(class_list, encoders)
        class_onehot_dict = {encoded_class: torch.from_numpy(onehot_encoded[i]) for i, encoded_class in enumerate(encoders['label'].classes_)}
        return class_onehot_dict, encoders


    def _onehot_encode(self, class_list, encoders=None):
        if not class_list:
            raise ValueError("Input 'classes' array is empty or None.")

        class_list = np.array(class_list)

        if encoders is None:
            # Convert the labels to integers
            label_encoder = LabelEncoder()
            integer_encoded = label_encoder.fit_transform(class_list)
            # Binary encode
            onehot_encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
            integer_encoded = integer_encoded.reshape(len(integer_encoded), 1)
            onehot_encoded = onehot_encoder.fit_transform(integer_encoded)
            encoders = {'onehot': onehot_encoder, 'label': label_encoder}
        else:
            integer_encoded = encoders['label'].transform(class_list)
            integer_encoded = integer_encoded.reshape(len(integer_encoded), 1)
            onehot_encoded = encoders['onehot'].transform(integer_encoded)
        return onehot_encoded, encoders
