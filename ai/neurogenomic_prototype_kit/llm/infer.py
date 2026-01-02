from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import yaml, torch

def load_config(path="config/model.yaml"):
    return yaml.safe_load(open(path))

def generate(prompt: str) -> str:
    cfg = load_config()
    tok = AutoTokenizer.from_pretrained(cfg["base_model"]) 
    model = AutoModelForCausalLM.from_pretrained(cfg["base_model"], device_map="auto", load_in_4bit=cfg["load_4bit"]) 
    try:
        model = PeftModel.from_pretrained(model, "llm/adapter")
    except Exception:
        pass
    inputs = tok(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        out = model.generate(**inputs, max_new_tokens=512)
    return tok.decode(out[0], skip_special_tokens=True)

if __name__ == "__main__":
    print(generate("Explain CYP2D6 and codeine."))