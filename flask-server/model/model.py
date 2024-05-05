import heapq
import pandas as pd
from model.scripts.run.predict import predict
from model.scripts.utils.arguments import load_config

def run(test_data_path):
    config = load_config('model/configs/distilprotbert_model.yaml')

    test_data_csv = pd.read_csv(test_data_path)
    test_ids = test_data_csv['SUB_ACC_ID']
    test_positions = test_data_csv['SUB_MOD_RSD']
    test_sites = test_data_csv['SITE_+/-7_AA']
    
    results = predict(config, test_data_path)
    result_data = []
    for idx, prediction in enumerate(results.probabilities):
        max_5_prob = heapq.nlargest(5, prediction)

        prob_list = prediction.tolist()
        max_5_idx = [prob_list.index(i) for i in max_5_prob]
        max_5_kinase = [results.label_mapping[i] for i in max_5_idx]

        kinase_info_dict = results.kinase_info_dict
        
        
        result_data.append({
            'geneId': test_ids[idx],
            'position': int(test_positions[idx]),
            'proteinSeq': test_sites[idx],
            'probKinase': max_5_kinase,
            'probability': [max_5_prob[i].item() for i in range(5)],
            'kinaseFamily': [kinase_info_dict[max_5_kinase[i]]['family'] for i in range(5)],
            'kinaseGroup': [kinase_info_dict[max_5_kinase[i]]['group'] for i in range(5)]
            }
        )

    return result_data