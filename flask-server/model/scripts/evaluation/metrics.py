import torch
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from collections import defaultdict
from sklearn.metrics import auc, average_precision_score, precision_recall_curve, roc_auc_score, roc_curve

class EvaluationMetrics:
    def __init__(self, label_mapping, kinase_info_dict):
        self.labels = torch.tensor([], dtype=torch.int8)
        self.predictions = torch.tensor([], dtype=torch.int64)
        self.probabilities = torch.tensor([], dtype=torch.float32)
        self.unique_logits = torch.tensor([], dtype=torch.float32)
        self.label_mapping = label_mapping
        self.kinase_info_dict = kinase_info_dict

    def get_probabilities(self):
        return self.probabilities
    
    def set_probabilities(self, probabilities):
        self.probabilities = probabilities

    def get_unique_logits(self):
        return self.unique_logits
    
    def set_unique_logits(self, unique_logits):
        self.unique_logits = unique_logits

    def update_predictions(self, predictions):
        self.predictions = torch.cat([self.predictions, predictions], dim=0)

    def update_probabilities(self, probabilities):
        self.probabilities = torch.cat([self.probabilities, probabilities], dim=0)

    def update_unique_logits(self, unique_logits):
        self.unique_logits = torch.cat([self.unique_logits, unique_logits], dim=0)