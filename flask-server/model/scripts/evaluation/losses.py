import torch

def cross_entropy(kinase_logit, unique_logits):
    #maxlogits = torch.max(unique_logits, dim=1, keepdim=True)[0]
    #numerator = kinase_logit - maxlogits.squeeze()
    denominator = torch.sum(torch.exp(unique_logits), dim=1)
    softmax_out = torch.exp(kinase_logit) / (denominator + 1e-15)
    P = torch.clamp(softmax_out, min=1e-15, max=1.1)
    loss = torch.mean(-torch.log(P))
    return loss

def cross_entropy_with_normlization(kinase_logit, unique_logits):
    maxlogits = torch.max(unique_logits, dim=1, keepdim=True)[0]  # Calculate maxlogits
    numerator = kinase_logit - maxlogits.squeeze()
    denominator = torch.sum(torch.exp(unique_logits - maxlogits), dim=1)
    softmax_out = torch.exp(numerator) / (denominator + 1e-15)
    P = torch.clamp(softmax_out, min=1e-15, max=1.1)
    loss = torch.mean(-torch.log(P))
    return loss