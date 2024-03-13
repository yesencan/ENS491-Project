import pandas as pd
import torch
import copy
import statistics

def ensemble_results(results):
    aggregated_results = {'epoch_loss': [], 'epoch_acc': [], 'epoch_roc_auc': [], 'epoch_aupr': [], 'epoch_aupr_with_logits': []}
    for result in results:
        for key in aggregated_results:
            aggregated_results[key].append(result[key])
    mean_results = {key: sum(aggregated_results[key]) / len(aggregated_results[key]) for key in aggregated_results}
    std_dev_results = {key: statistics.stdev(aggregated_results[key]) for key in aggregated_results if len(aggregated_results[key]) > 1}
    return mean_results, std_dev_results

def ensemble_probabilities_aupr(results):
    # IMPORTANT NOTE! : This wouldn't work for the train results because the train dataset is shuffled!!!
    # So the model's predictions will not be for the same samples in the same prder, thus they cannot
    # be ensembled.
    all_probabilities = []
    all_logits = []
    for result in results:
        metric = result["metrics"]
        all_probabilities.append(metric.get_probabilities())
        all_logits.append(metric.get_unique_logits())
    # The selected metric is not important at this point since we only need the label_mapping etc, which is the same for all  
    ensemble_probabilities = get_ensemble_probabilities(all_probabilities)
    ensemble_logits = get_ensemble_probabilities(all_logits)
    dummy_metric = copy.deepcopy(results[0]["metrics"])
    dummy_metric.set_probabilities(ensemble_probabilities)
    dummy_metric.set_unique_logits(ensemble_logits)
    ensembled_macro_aupr = dummy_metric.calculate_aupr()
    ensembled_macro_aupr_with_logits = dummy_metric.calculate_aupr(use_logits=True)
    return ensembled_macro_aupr, ensembled_macro_aupr_with_logits

def get_ensemble_probabilities(probabilities):
    ensemble_probabilities = torch.stack(probabilities).mean(dim=0)
    return ensemble_probabilities

def average_df_by_id(dict_results):
    dataframes = [pd.DataFrame(list(dict_res.items()), columns=['Key', 'Value']) for dict_res in dict_results]
    if len(dataframes) < 2:
        return dataframes[0]
    col_names = list(dataframes[0].columns)
    combined_df = pd.concat(dataframes, ignore_index=True)
    result_df = combined_df.groupby(col_names[0])[col_names[1]].mean().reset_index()
    result_df = result_df.sort_values(by='Value', ascending=False)
    return result_df