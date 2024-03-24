import os

from model.scripts.models.esm_models import ESM
from model.scripts.models.bilstm import *
from model.scripts.models.zero_dkz import Zero_DKZ

def generate_model(config, data_shapes):
    phosphosite_model = None
    kinase_model = None
    sequence_model = None

    # Create phosphosite model
    if not config['phosphosite']['dataset']['processor']['read_embeddings']:
        if config['phosphosite']['model']['model_type'] == 'esm':
            phosphosite_model = ESM(
                model_name = config['phosphosite']['model']['model_name'],
                embedding_mode = config['phosphosite']['model']['embedding_mode']
            )
            if config['phosphosite']['model']['freeze']:
                phosphosite_model._freeze_embedding_model()

    # Create kinase model
    if not config['kinase']['dataset']['processor']['read_embeddings']:
        if config['kinase']['model']['model_type'] == 'esm':
            kinase_model = ESM(
                model_name = config['kinase']['model']['model_name'],
                embedding_mode = config['kinase']['model']['embedding_mode']
            )
            if config['kinase']['model']['freeze']:
                kinase_model._freeze_embedding_model()

    # Create sequence model
    if config['phosphosite']['sequence_model']['use_sequence_model']:
        if config['phosphosite']['sequence_model']['model_type'] == 'bilstm':
            if config['phosphosite']['model']['model_type'] == 'esm':
                vocabnum = get_esm_embedding_dim(config['phosphosite']['model']['model_name'])
                seq_lens = data_shapes['phosphosite'][1]
            elif config['phosphosite']['model']['model_type'] == 'protvec':
                vocabnum = 100
                seq_lens = 13
            else:
                vocabnum = data_shapes['phosphosite'][2]
                seq_lens = data_shapes['phosphosite'][1]
            sequence_model = BiLstm(vocabnum, seq_lens) # vocabnum = phosphosite_seq_size[1], seq_lens = phosphosite_seq_size[0]

    # Make calculate w shape
    w_dim = get_w_dim(config, data_shapes)
    model = Zero_DKZ(
        w_dim=w_dim,
        phosphosite_model=phosphosite_model,
        kinase_model=kinase_model,
        sequence_model=sequence_model,
        config=config
    )
    return model


def get_w_dim(config, data_shapes):
    # Use a second model to process embeddings
    if config['phosphosite']['sequence_model']['use_sequence_model']:
        if config['phosphosite']['sequence_model']['model_type'] == 'bilstm':
            w_1 = config['phosphosite']['sequence_model']['hidden_size'] * 2
        else:
            w_1 = config['phosphosite']['sequence_model']['hidden_size']
    else:
        if not config['phosphosite']['dataset']['processor']['read_embeddings']:
            # Use embedding model to process phosphosite
            if config['phosphosite']['model']['model_type'] == 'esm':
                w_1 = get_esm_embedding_dim(config['phosphosite']['model']['model_name'])
            else:
                # Mesela protvec icin buraya gelen datanin concat yaptiktan sonra data_sayisix1300 olmasi lazim
                w_1 = data_shapes['phosphosite'][1]
        else:
            w_1 = data_shapes['phosphosite'][1]
        
    # Check Kinase Embedding Dimension (Sequence)
    if config['kinase']['model']['model_type'] == 'esm':
        kinase_sequence_embedding_size = get_esm_embedding_dim(config['phosphosite']['model']['model_name'])
    else:
        kinase_sequence_embedding_size = data_shapes['kinase']['sequence'][1] if len(data_shapes['kinase']['sequence']) > 1 else 0

    kinase_property_embedding_size = data_shapes['kinase']['properties'][1] if len(data_shapes['kinase']['properties']) > 1 else 0
    w_2 = kinase_sequence_embedding_size + kinase_property_embedding_size
    return (w_1 + 1, w_2 + 1)


def get_esm_embedding_dim(model_name):
    esm_info = {
        'esm2_t48_15B_UR50D':5120,
        'esm2_t36_3B_UR50D':2560,
        'esm2_t33_650M_UR50D':1280,
        'esm2_t30_150M_UR50D':640,
        'esm2_t12_35M_UR50D':480,
        'esm2_t6_8M_UR50D':320,
        'esm_if1_gvp4_t16_142M_UR50':512,
        'esm1v_t33_650M_UR90S_[1-5]':1280,
        'esm_msa1b_t12_100M_UR50S':768,
        'esm1b_t33_650M_UR50S':1280,
        'esm1_t34_670M_UR50S':1280,
        'esm1_t34_670M_UR50D':1280,
        'esm1_t34_670M_UR100':1280,
        'esm1_t12_85M_UR50S':768,
        'esm1_t6_43M_UR50S':768
    }
    if model_name.startswith('esm1v_t33_650M_UR90S_'):
        model_name = 'esm1v_t33_650M_UR90S_[1-5]'
    return esm_info[model_name]


def save_model(config, model_state_dict, optim_state_dict):
    save_filepath = os.path.join(
        config['training']['saved_model_path'],
        config['phosphosite']['model']['model_name'],
        f"{config['testing']['checkpoint_file_name']}_{config['run_model_id']}.pt"
    )
    state = {
        'state_dict': model_state_dict,
        'optimizer': optim_state_dict
    }
    try:
        directory = '/'.join(save_filepath.split('/')[:-1])
        os.makedirs(directory, exist_ok=True)
        torch.save(state, save_filepath)
        print(f"Model {config['run_model_id']} saved successfully!")
    except Exception as e:
        print(f"Failed to save model {config['run_model_id']}. Error: {e}")


def load_model(config, data_shapes):
    model = generate_model(config, data_shapes)
    # Load the saved state
    load_filepath = os.path.join(
        config['testing']['load_model_path'],
        config['phosphosite']['model']['model_name'],
        f"{config['testing']['checkpoint_file_name']}.pt"
    )
    device = None if torch.cuda.is_available() else torch.device('cpu')
    saved_state = torch.load(load_filepath, map_location=device)
    model.load_state_dict(saved_state['state_dict'])
    return model

def get_optimizer(config, model):
    optimizer = config['hyper_parameters']['optimizer']
    learning_rate = config['hyper_parameters']['learning_rate']
    weight_decay = config['hyper_parameters']['weight_decay']
    if optimizer == 'Adam':
        optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    elif optimizer == 'SGD':
        optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    elif optimizer == 'RMSprop':
        optimizer = torch.optim.RMSprop(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
    return optimizer

def get_scheduler(config, optimizer):
    scheduler = config['hyper_parameters']['scheduler_type']
    gamma = config['hyper_parameters']['gamma']
    if scheduler == 'ExponentialLR':
        scheduler = torch.optim.lr_scheduler.ExponentialLR(optimizer, gamma=gamma, last_epoch=-1)
    elif scheduler == 'StepLR':
        scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=1, gamma=gamma)
    elif scheduler == 'CosineAnnealingLR':
        scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100, eta_min=0)
    return scheduler