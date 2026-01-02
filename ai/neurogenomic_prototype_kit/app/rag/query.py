import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

def rag_answer(question: str, genotypes: dict):
    client = chromadb.PersistentClient(path="data/chroma_index", settings=Settings())
    coll = client.get_or_create_collection("neurogenomic_docs")
    embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    q_emb = embedder.encode([question]).tolist()[0]
    res = coll.query(query_embeddings=[q_emb], n_results=4)
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    # Simple templated answer—replace with local LLM generate() using your base model
    refs = [m.get("source") for m in metas]
    answer = (
        "Based on retrieved sources, here is an initial synthesis. "
        "This is not medical advice.\n\n"
        + "\n---\n".join(docs)
    )
    return answer, refs