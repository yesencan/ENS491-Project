import torch
import torch.nn as nn

class Zero_DKZ(nn.Module):
    def __init__(self, w_dim, phosphosite_model, kinase_model, sequence_model, config):
        super(Zero_DKZ, self).__init__()
        
        self.W = torch.nn.Parameter(torch.rand(w_dim[0], w_dim[1]) * 0.05)
        self.phosphosite_model = phosphosite_model
        self.kinase_model = kinase_model
        self.sequence_model = sequence_model
        self.config = config

    def forward(self, phosphosites, unseen_kinases):
        if self.phosphosite_model is not None:
            if self.config['phosphosite']['model']['freeze']:
                with torch.no_grad():
                    phosphosites = self.phosphosite_model(phosphosites)
            else:
                phosphosites = self.phosphosite_model(phosphosites)
        
        if self.sequence_model is not None:
            phosphosites = self.sequence_model(phosphosites)
        
        if self.kinase_model is not None:
            if self.config['kinase']['model']['freeze']:
                with torch.no_grad():
                    unseen_kinases['sequences'] = self.kinase_model(unseen_kinases['sequences'])
            else:
                unseen_kinases['sequences'] = self.kinase_model(unseen_kinases['sequences'])
        
        # Concatenate kinase embeddings and properties
        if len(unseen_kinases['properties'].size()) > 0:
            unseen_kinases['sequences'] = torch.cat([unseen_kinases['sequences'], unseen_kinases['properties']], dim=1)
            unseen_kinases['properties'] = torch.tensor([])

        # Add 1 for W matrix
        phosphosites = torch.nn.functional.pad(phosphosites, (0, 1), value=1)
        unseen_kinases['sequences'] = torch.nn.functional.pad(unseen_kinases['sequences'], (0, 1), value=1)

        compatibility = torch.matmul(phosphosites, self.W)
        unique_logits = torch.matmul(compatibility, unseen_kinases['sequences'].permute(1,0))
        return {
            'unique_logits':unique_logits
        }
