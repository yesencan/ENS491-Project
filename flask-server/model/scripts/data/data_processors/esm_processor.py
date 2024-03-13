import torch
from scripts.data.data_processors.base_processor import SequenceProcessor

class ESMProcessor(SequenceProcessor):
    def __init__(self, processor_config):
        super().__init__(config=processor_config)
        _, self.alphabet = torch.hub.load("facebookresearch/esm:main", self.config['model_name'])
        self.esm_batch_converter = self.alphabet.get_batch_converter()

    def process_phosphosite_sequence(self, sequences, to_sequence_model=False):
        esm_data_tuples = [('', seq.replace('_', '-').upper()) for seq in sequences]
        _, _, batch_tokens = self.esm_batch_converter(esm_data_tuples)
        return batch_tokens

    def process_kinase_sequence(self, sequences):
        esm_data_tuples = [('', seq.replace('_', '-').upper()) for seq in sequences]
        _, _, batch_tokens = self.esm_batch_converter(esm_data_tuples)
        return batch_tokens
