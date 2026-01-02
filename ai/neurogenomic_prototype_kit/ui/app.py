import json, requests, streamlit as st

st.title("Neurogenomic Prototype UI (Starter)")
st.caption("Research only — not medical advice.")

genotype_text = st.text_area("Paste genotype JSON", value='{"CYP2D6":"PM","COMT":"Met/Met"}', height=120)
question = st.text_input("Ask a question (RAG)", value="Which genes matter for opioids?")

col1, col2 = st.columns(2)
if col1.button("Analyze Genotype"):
    payload = {"genotypes": json.loads(genotype_text)}
    r = requests.post("http://localhost:8000/analyze", json=payload, timeout=60)
    st.subheader("Analysis") 
    st.json(r.json())

if col2.button("Explain (RAG)"):
    payload = {"question": question, "genotypes": json.loads(genotype_text)}
    r = requests.post("http://localhost:8000/explain", json=payload, timeout=60)
    st.subheader("Answer")
    st.write(r.json().get("answer"))
    st.subheader("References")
    st.write(r.json().get("references"))