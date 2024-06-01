# DeepKinZero Backend

## Set up virtual environment
### Windows
```bash
python -m venv virtualenv  
.\virtualenv\Scripts\activate  
pip install -r requirements.txt  
```

### Linux / MacOS
```bash
python3 -m venv virtualenv  
source virtualenv/bin/activate  
pip install -r requirements.txt  
```

## Run server
```bash
flask --app server --debug run
```  

## Updating DistilProtBert checkpoints
- Place the new checkpoints into model/checkpoints/distilprotbert_models/distilprotbert
- Update the config file (model/configs/distilprotbert_model.yaml)
  ```yaml
  testing:
  ...
    checkpoint_file_name: '<name of the model file without .pt at the end>'
  ...
  ```


## Deactivate the virtual environment
```deactivate```  
