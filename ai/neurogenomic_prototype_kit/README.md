
# Neurogenomic Prototype Kit (Starter)

This kit gives you a **local, GPU-accelerated prototype** to ingest a DNA report, map genotypes to substance-response risk,
and generate **LLM-backed explanations** using RAG and optional LoRA fine-tuning.

> **Clinical note:** This is a research prototype and **not** a medical device. Do not use it to diagnose, treat, or cure.

## What it does (today)
1. Accepts a **genotype JSON** or parses a PDF (skeleton for MaxGen) into `{gene: genotype}`.
2. Scores predicted **substance effects/risks** using a configurable mapping (`data/gene_substance_matrix.csv`).
3. Builds a **RAG index** from your whitepapers and substance correlations (drop docs into `docs/`).
4. Serves an API and a minimal UI for analysis & explanation.

## Quickstart

### 0) System
- Python 3.10–3.11
- NVIDIA 4090 (16GB) supported
- CUDA drivers installed

### 1) Create environment & install
```bash
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 2) (Optional) Download a local base model
Pick a small instruct model for your 16GB VRAM, e.g. **Mistral-7B-Instruct** or **Llama-3.1-8B-Instruct** (quantized 4-bit).
You can set the model path in `config/model.yaml`.

### 3) Index your docs
Place your PDFs/DOCX into `docs/` and run:
```bash
python -m app.rag.build_index --docs_dir docs --persist_dir data/chroma_index
```

### 4) Run the API
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Open http://localhost:8000/docs for Swagger.

### 5) Run the UI
```bash
streamlit run ui/app.py
```

## Files to customize
- `data/gene_substance_matrix.csv` — the mapping of gene→variant→substance→anticipated effects (seeded with a few examples).
- `config/panel.yaml` — list of genes to parse and display.
- `config/model.yaml` — base model and LoRA adapter configs.
- `app/ingest/maxgen_pdf.py` — extend the parser for your PDF format.
- `llm/train_lora.py` — optional LoRA fine-tuning on your own Q&A made from your docs.

## Notes
- **PHI/HIPAA**: Keep all processing local unless you have BAAs and secure cloud posture. Use disk encryption.
- **Scope**: This is a scaffold; expand rules, parsing, evaluation, and safety rails for clinical-grade use.
