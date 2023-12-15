### Set up virtual environment
python -m venv virtualenv
.\virtualenv\Scripts\activate
pip install -r requirements.txt

### Set up python interpreter as python.exe in virtualenv
Select the python interpreter as ./virtualenv/Scripts/python.exe

### Run server
python server.py

### Deactivate the virtual environment
deactivate
