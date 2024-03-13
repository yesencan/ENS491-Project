import torch
from torch.utils.data import DataLoader

import pandas as pd
import lightning as L

from scripts.utils.training_utils import load_model
from scripts.evaluation.losses import cross_entropy, cross_entropy_with_normlization
from scripts.evaluation.metrics import EvaluationMetrics
from scripts.data.model_dataset import create_zero_shot_dataset


def test_model(
    model,
    dataloader,
    loss_fn,
    fabric,
    config
):
    model.eval()
    metric_results = {
        'epoch_loss' : 0,
        'epoch_acc' : 0,
        'epoch_roc_auc' : 0,
        'epoch_aupr' : 0
    }
    metrics = EvaluationMetrics(
        label_mapping = dataloader.dataset.label_mapping,
        kinase_info_dict = dataloader.dataset.kinase_info_dict
    )

    # Unseen kinase set (Buraya en son bakacagim)
    
    for batch_idx, data in enumerate(dataloader):
        ### For'un disina alinca forward icinde degistiginde burada da degisiyor. Daha sonra belki baska yol bulunabilir
        unseen_kinases = {
            'sequences' : dataloader.dataset.unseen_data['sequences'].to(fabric.device),
            'properties' : dataloader.dataset.unseen_data['properties'].to(fabric.device)
        }

        # Forward pass
        with torch.no_grad():
            outputs = model(
                data['phosphosites'],
                data['kinases'],
                unseen_kinases
            )

            # Compute loss
            loss = loss_fn(outputs['kinase_logit'], outputs['unique_logits'])

        metric_results['epoch_loss']  += loss.item()
        predictions = torch.argmax(outputs['unique_logits'].detach(), dim=1).cpu()
        probabilities = torch.nn.functional.softmax(outputs['unique_logits'].detach(), dim=1).cpu()
        unique_logits = outputs['unique_logits'].detach().cpu()
        metrics.update_predictions(predictions)
        metrics.update_probabilities(probabilities)
        metrics.update_unique_logits(unique_logits)
        metrics.update_labels(data['labels'].detach().cpu())
        
    metric_results['epoch_acc'] = metrics.calculate_accuracy()
    metric_results['epoch_roc_auc'] = metrics.calculate_roc_auc()
    metric_results['epoch_aupr_with_logits'] = metrics.calculate_aupr(use_logits=True)
    metric_results['epoch_aupr'] = metrics.calculate_aupr()
    metric_results['metrics'] = metrics
    metric_results['epoch_loss'] /= len(dataloader)
    return metric_results, metrics


def test(config):
    # Device
    device = 'cuda' if torch.cuda.is_available() else 'cpu'

    fabric = L.Fabric(
        accelerator = device,
        devices = 1,
        precision = '32-true' #precision_type
    )

    test_dataset = create_zero_shot_dataset(
        config=config,
        data_type='test'
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
   
    # Loss Function
    loss_fn = cross_entropy

    # Mixed Precision Training using Lighning Fabric
    test_dataloader = fabric.setup_dataloaders(test_dataloader)
    model = fabric.setup(model)

    model_results, metrics = test_model(
        model,
        test_dataloader,
        loss_fn,
        fabric,
        config
    )

    # Logging
    print("Test Loss: {:.4f}, Test Aupr: {:.4f}, Test Aupr with logits : {:.4f}, Test Roc Auc: {:.4f}, Test Acc: {:.4f}".format(
        model_results['epoch_loss'],
        model_results['epoch_aupr'],
        model_results['epoch_aupr_with_logits'],
        model_results['epoch_roc_auc'],
        model_results['epoch_acc']
    ))

    return model_results, metrics