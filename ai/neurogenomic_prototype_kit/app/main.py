from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import Dict, List, Optional
from app.services.scoring import score_genotype
from app.rag.query import rag_answer

app = FastAPI(title="Neurogenomic Prototype API", version="0.1.0")

class GenotypeIn(BaseModel):
    genotypes: Dict[str, str]

@app.post("/analyze")
def analyze(payload: GenotypeIn):
    report = score_genotype(payload.genotypes)
    return {"analysis": report}

class RAGIn(BaseModel):
    question: str
    genotypes: Optional[Dict[str, str]] = None

@app.post("/explain")
def explain(payload: RAGIn):
    answer, refs = rag_answer(payload.question, payload.genotypes or {})
    return {"answer": answer, "references": refs}

@app.post("/ingest/maxgen")
async def ingest_maxgen(file: UploadFile = File(...)):
    # Skeleton: extend this to parse your MaxGen PDF to dict of genotypes
    content = await file.read()
    # TODO: implement parser; return stub
    return {"message": "Parser not yet implemented. Save file & parse with app/ingest/maxgen_pdf.py."}