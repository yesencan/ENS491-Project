import torch
from torch.utils.data import DataLoader

import pickle
import pandas as pd
import lightning as L
from scripts.data.data_processors.kinase_embedding_generator import KinaseEmbeddingGenerator
from scripts.utils.data_utils import get_processor, load_kinase_data, load_phosphosite_data, read_torch_embedding

from scripts.utils.training_utils import load_model
from scripts.evaluation.metrics import EvaluationMetrics
from scripts.data.model_dataset import ZeroShotDataset


def predict_model(
    model,
    dataloader,
    fabric,
    config
):
    model.eval()
    metrics = EvaluationMetrics(
        label_mapping = dataloader.dataset.label_mapping,
        kinase_info_dict = dataloader.dataset.kinase_info_dict
    )
    
    for batch_idx, data in enumerate(dataloader):
        unseen_kinases = {
            'sequences' : dataloader.dataset.unseen_data['sequences'].to(fabric.device),
            'properties' : dataloader.dataset.unseen_data['properties'].to(fabric.device)
        }

        # Forward pass
        with torch.no_grad():
            outputs = model(
                data['phosphosites'],
                unseen_kinases
            )

        predictions = torch.argmax(outputs['unique_logits'].detach(), dim=1).cpu()
        probabilities = torch.nn.functional.softmax(outputs['unique_logits'].detach(), dim=1).cpu()
        metrics.update_predictions(predictions)
        metrics.update_probabilities(probabilities)

    return metrics


def predict(config, test_data_path):
    # Device
    device = 'cuda' if torch.cuda.is_available() else 'cpu'

    fabric = L.Fabric(
        accelerator = device,
        devices = 1,
        precision = '32-true' #precision_type
    )

    with open(config['testing']['kinase_encoder_load_path'], 'rb') as file:
        encoders = pickle.load(file)

    phosphosite_data_dict = load_phosphosite_data(test_data_path)
    kinase_data_dict = load_kinase_data(config['kinase']['dataset']['test'])
    if config['phosphosite']['dataset']['processor']['read_embeddings']:
        phosphosite_data = read_torch_embedding(
            config['phosphosite']['dataset']['processor']['phosphosite_embedding_path'],
            phosphosite_data_dict['phosphosite_sequences'],
            config['phosphosite']['model']['embedding_mode']
        )
    else:
        phosphosite_processor = get_processor(config['phosphosite']['dataset']['processor'])
        phosphosite_data = phosphosite_processor.process_phosphosite_sequence(phosphosite_data_dict['phosphosite_sequences'], config['phosphosite']['sequence_model']['use_sequence_model'])
    
    phosphosite_data_dict['unique_kinases'] = sorted(list(kinase_data_dict.keys()))

    # Process kinase
    kinase_embedding_generator = KinaseEmbeddingGenerator(kinase_data_dict, config['kinase']['dataset']['processor'], encoders)

    # Unseen kinases
    kinase_data = kinase_embedding_generator.create_kinase_embeddings_2(
        unique_kinase_ids=phosphosite_data_dict['unique_kinases'],
        embedding_mode=config['kinase']['model']['embedding_mode']
    )
    test_dataset = ZeroShotDataset(
        phosphosite_data = phosphosite_data,
        kinase_data = kinase_data,
        kinase_info_dict = kinase_data_dict,
        phosphosite_data_dict = phosphosite_data_dict
    )

    if config['training']['normalize_data']:
        test_dataset._normalize_data(config, fit_to_data=False)

    test_dataloader = DataLoader(test_dataset, batch_size = config['training']['validation']['batch_size'], shuffle = False)

    data_shapes = {
        'phosphosite' : test_dataset.phosphosite_data.size(),
        'kinase' : {'sequence' : test_dataset.unseen_data['sequences'].size(), 'properties' : test_dataset.unseen_data['properties'].size()}
    }
    
    # Load Model
    model = load_model(config, data_shapes)

    # Mixed Precision Training using Lighning Fabric
    test_dataloader = fabric.setup_dataloaders(test_dataloader)
    model = fabric.setup(model)

    metrics = predict_model(
        model,
        test_dataloader,
        fabric,
        config
    )

    return metrics