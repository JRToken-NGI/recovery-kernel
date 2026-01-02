import pandas as pd
from typing import Dict, List

MATRIX_PATH = "data/gene_substance_matrix.csv"

def _load_matrix():
    return pd.read_csv(MATRIX_PATH)

def score_genotype(genotypes: Dict[str, str]) -> List[dict]:
    matrix = _load_matrix()
    results = []
    for _, row in matrix.iterrows():
        gene = row['gene']
        user_call = genotypes.get(gene)
        if not user_call:
            continue

        # naive pattern match; expand to regex for production
        pattern = str(row['variant_pattern'])
        if pattern in user_call or (pattern == user_call):
            results.append({
                "gene": gene,
                "call": user_call,
                "substance": row['substance'],
                "anticipated_effect": row['anticipated_effect'],
                "rationale": row['rationale'],
                "evidence_level": row['evidence_level'],
            })
    return results