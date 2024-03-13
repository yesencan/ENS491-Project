import time
import wandb
import torch
from torch.utils.data import DataLoader

import lightning as L

from scripts.evaluation.losses import cross_entropy, cross_entropy_with_normlization
from scripts.evaluation.metrics import EvaluationMetrics
from scripts.run.test import test_model
from scripts.utils.training_utils import save_model, generate_model, get_optimizer, get_scheduler
from scripts.data.model_dataset import create_zero_shot_dataset

### --- training ---
def train_one_epoch(model, dataloader, optimizer, loss_fn, fabric):
    model.train()

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

    for batch_idx, data in enumerate(dataloader):
        ### For'un disina alinca forward icinde degistiginde burada da degisiyor. Daha sonra belki baska yol bulunabilir
        unseen_kinases = {
            'sequences' : dataloader.dataset.unseen_data['sequences'].to(fabric.device),
            'properties' : dataloader.dataset.unseen_data['properties'].to(fabric.device)
        }
        
        outputs = model(
            data['phosphosites'],
            data['kinases'],
            unseen_kinases
        )
        
        # Compute loss
        loss = loss_fn(outputs['kinase_logit'], outputs['unique_logits'])
        
        # Backpropagation and optimization
        optimizer.zero_grad()
        #loss.backward()
        fabric.backward(loss)
        optimizer.step()

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
    return metric_results


def train_model(
    model,
    train_dataloader,
    val_dataloader,
    optimizer,
    scheduler,
    loss_fn,
    num_epochs,
    fabric,
    config
):
    # Training variables
    best_loss = float('inf')
    best_val_macro_aupr = 0
    best_model_results = {}
    training_start_time = time.time()
    
    # Training
    for epoch in range(num_epochs):
        train_results = train_one_epoch(model, train_dataloader, optimizer, loss_fn, fabric)
        val_results, _ = test_model(model, val_dataloader, loss_fn, fabric, config)

        # Logging
        print("Epoch [{}/{}], Train Loss: {:.4f}, Val Loss: {:.4f}, Train Aupr: {:.4f}, Val Aupr: {:.4f}, Train Aupr (logits): {:.4f}, Val Aupr (logits): {:.4f}, Train Roc Auc: {:.4f}, Val Roc Auc: {:.4f}, Train Acc: {:.4f}, Val Acc: {:.4f}".format(
            epoch + 1,
            num_epochs,
            train_results['epoch_loss'],
            val_results['epoch_loss'],
            train_results['epoch_aupr'],
            val_results['epoch_aupr'],
            train_results['epoch_aupr_with_logits'],
            val_results['epoch_aupr_with_logits'],
            train_results['epoch_roc_auc'],
            val_results['epoch_roc_auc'],
            train_results['epoch_acc'],
            val_results['epoch_acc']
        ))

        if config['logging']['use_wandb'] and config['run_model_id'] == 0:
            log_dict = {'epoch' : epoch}
            log_dict = {
                'epoch' : epoch,
                **{f'train/{metric}' : value for metric, value in train_results.items() if metric != "metrics"},
                **{f'validation/{metric}' : value for metric, value in val_results.items() if metric != "metrics"}
            }
            wandb.log({**log_dict})

        # Save Model
        if config['training']['save_model'] and val_results["epoch_aupr"] > best_val_macro_aupr:
            best_val_macro_aupr = val_results["epoch_aupr"]
            save_model(
                config = config,
                model_state_dict = model.state_dict(),
                optim_state_dict = optimizer.state_dict()
            )
            best_model_results['train'] = train_results
            best_model_results['val'] = val_results

        # Scheduler Update
        scheduler.step()
    # Training End Logs
    print(f'Training Finished. Average Epoch Time: {(time.time() - training_start_time) / num_epochs} seconds')
    return model, best_model_results


def train(config):
    # Device
    device = 'cuda' if torch.cuda.is_available() else 'cpu'

    fabric = L.Fabric(
        accelerator = device,
        devices = 1,
        precision = '32-true' #precision_type
    )

    # Dataset & Dataloaders
    train_dataset = create_zero_shot_dataset(
        config=config,
        data_type='train'
    )
    val_dataset = create_zero_shot_dataset(
        config=config,
        data_type='validation'
    )

    # Normalization
    if config['training']['normalize_data']:
        train_dataset._normalize_data(config, fit_to_data=True)
        val_dataset.embed_scaler = train_dataset.embed_scaler
        val_dataset._normalize_data(config, fit_to_data=False)

    train_dataloader = DataLoader(train_dataset, batch_size = config['training']['train']['batch_size'], shuffle = True)
    val_dataloader = DataLoader(val_dataset, batch_size = config['training']['validation']['batch_size'], shuffle = False)

    data_shapes = {
        'phosphosite' : train_dataset.phosphosite_data.size(),
        'kinase' : {'sequence' : train_dataset.unseen_data['sequences'].size(), 'properties' : train_dataset.unseen_data['properties'].size()}
    }

    # Model
    model = generate_model(config, data_shapes)

    # Optimizer & Scheduler
    optimizer = get_optimizer(config, model)
    scheduler = get_scheduler(config, optimizer)
    
    # Loss Function
    loss_fn = cross_entropy_with_normlization

    # Mixed Precision Training using Lighning Fabric
    train_dataloader = fabric.setup_dataloaders(train_dataloader)
    val_dataloader = fabric.setup_dataloaders(val_dataloader)
    model, optimizer = fabric.setup(model, optimizer)
    
    model, model_results = train_model(
        model = model,
        train_dataloader = train_dataloader,
        val_dataloader = val_dataloader,
        optimizer = optimizer,
        scheduler = scheduler,
        loss_fn = loss_fn,
        num_epochs = config['training']['num_epochs'],
        fabric = fabric,
        config = config
    )
    
    return model_results