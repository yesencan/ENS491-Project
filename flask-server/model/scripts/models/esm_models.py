import torch
import torch.nn as nn

class ESM(nn.Module):
    def __init__(self, model_name, embedding_mode='avg'):
        super(ESM, self).__init__()
        
        self.embedding_mode = embedding_mode
        self.embedding_model, self.esm_alphabet = self._load_esm_model(model_name)
        self.last_hidden_state_index = len(self.embedding_model.layers) - 1

    def forward(self,X):
        X = self.embedding_model(X, repr_layers=[self.last_hidden_state_index])
        X = X["representations"][self.last_hidden_state_index]

        if self.embedding_mode == 'sequence':
            return X

        if self.embedding_mode == 'cls':
            embedding = X[:, 0]
        elif self.embedding_mode == 'avg':
            #padding_mask = (X.detach() != self.esm_alphabet.padding_idx).float()
            #embedding = compute_sequence_embeddings(X, padding_mask)
            raise NotImplementedError
        elif self.embedding_mode == 'middle':
            middle_index = X.size(1)//2
            embedding = X[:, middle_index, :]
        return embedding
    
    def _freeze_embedding_model(self):
        for param in self.embedding_model.parameters():
            param.requires_grad = False
    
    def _load_esm_model(self, model_name):
        model, alphabet = torch.hub.load("facebookresearch/esm:main", model_name)
        return model, alphabet