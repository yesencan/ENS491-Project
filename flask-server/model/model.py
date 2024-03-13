import heapq
import pandas as pd
from scripts.run.predict import predict
from scripts.utils.arguments import load_config

def run():
    config = load_config('configs/proteinbert_model.yaml')

    test_data_path = 'test_data.csv'
    test_data_csv = pd.read_csv(test_data_path)
    test_ids = test_data_csv['SUB_ACC_ID']
    test_positions = test_data_csv['SUB_MOD_RSD']
    test_sites = test_data_csv['SITE_+/-7_AA']
    
    results = predict(config)
    result_data = []
    for idx, prediction in enumerate(results.probabilities):
        max_5_prob = heapq.nlargest(5, prediction)

        prob_list = prediction.tolist()
        max_5_idx = [prob_list.index(i) for i in max_5_prob]
        max_5_kinase = [results.label_mapping[i] for i in max_5_idx]

        kinase_info_dict = results.kinase_info_dict
        
        for i in range(5):
            result_data.append({
                'substrate': test_ids[idx],
                'position': test_positions[idx],
                'site': test_sites[idx],
                'prediction': max_5_kinase[i],
                'probability': max_5_prob[i].item(),
                'family': kinase_info_dict[max_5_kinase[i]]['family'],
                'group': kinase_info_dict[max_5_kinase[i]]['group']
                }
            )

    return result_data
        