import argparse, os, glob
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
from docx import Document

def read_text(path):
    if path.lower().endswith('.pdf'):
        reader = PdfReader(path)
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    if path.lower().endswith('.docx'):
        doc = Document(path)
        return "\n".join(p.text for p in doc.paragraphs)
    if path.lower().endswith('.txt'):
        return open(path, 'r', encoding='utf-8', errors='ignore').read()
    return ""

def chunk(text, chunk_size=1200, overlap=200):
    chunks = []
    i = 0
    while i < len(text):
        chunks.append(text[i:i+chunk_size])
        i += (chunk_size - overlap)
    return chunks

def main(docs_dir: str, persist_dir: str):
    os.makedirs(persist_dir, exist_ok=True)
    client = chromadb.PersistentClient(path=persist_dir, settings=Settings(allow_reset=True))
    coll = client.get_or_create_collection("neurogenomic_docs")
    embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    doc_paths = glob.glob(os.path.join(docs_dir, "*"))
    ids, texts, metas = [], [], []
    for p in doc_paths:
        txt = read_text(p)
        for j, c in enumerate(chunk(txt)):
            ids.append(f"{os.path.basename(p)}::{j}")
            texts.append(c)
            metas.append({"source": os.path.basename(p)})
    if texts:
        embs = embedder.encode(texts).tolist()
        coll.upsert(ids=ids, documents=texts, metadatas=metas, embeddings=embs)
        print(f"Indexed {len(texts)} chunks from {len(doc_paths)} files into {persist_dir}")
    else:
        print("No documents found.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--docs_dir", required=True)
    parser.add_argument("--persist_dir", required=True)
    args = parser.parse_args()
    main(args.docs_dir, args.persist_dir)