import pandas as pd
import pathlib
import os
from uuid import uuid4

def write_test_data(test_data):
    test_data_df = pd.DataFrame(test_data, columns=['SUB_ACC_ID','SUB_MOD_RSD','SITE_+/-7_AA'])
    
    filename = os.path.join(pathlib.Path(__file__).parent.resolve(), 'model', str(uuid4()) + '.csv')
    test_data_df.to_csv(filename, index=False)

    return filename

    