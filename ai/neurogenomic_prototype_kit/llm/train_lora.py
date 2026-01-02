# Minimal LoRA fine-tuning skeleton. Prepare your instruction dataset from your own docs.

from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model, TaskType
import yaml

def load_config(path="config/model.yaml"):
    return yaml.safe_load(open(path))

def make_dummy_ds():
    # Replace with your curated Q/A pairs built from your docs
    samples = [
        {"prompt": "Given CYP2D6 PM and codeine, what happens?", "response": "Therapeutic failure due to lack of activation."},
        {"prompt": "Which genes influence ketamine dissociation risk?", "response": "GRIN2A/2B, COMT, AKT1."},
    ]
    return Dataset.from_list([{ "text": f"<s>[INST] {s['prompt']} [/INST] {s['response']}</s>" } for s in samples])

def main():
    cfg = load_config()
    model = AutoModelForCausalLM.from_pretrained(cfg["base_model"], device_map="auto", load_in_4bit=cfg["load_4bit"]) 
    tok = AutoTokenizer.from_pretrained(cfg["base_model"]) 
    peft_cfg = LoraConfig(
        task_type=TaskType.CAUSAL_LM, r=cfg["lora"]["r"], lora_alpha=cfg["lora"]["alpha"], lora_dropout=cfg["lora"]["dropout"],
        target_modules=cfg["lora"]["target_modules"],
    )
    model = get_peft_model(model, peft_cfg)
    ds = make_dummy_ds()
    args = TrainingArguments(
        output_dir="llm/out", per_device_train_batch_size=1, num_train_epochs=1,
        fp16=True, save_steps=50, logging_steps=10,
    )
    trainer = Trainer(model=model, args=args, train_dataset=ds, tokenizer=tok)
    trainer.train()
    model.save_pretrained("llm/adapter")
    print("Saved LoRA adapter to llm/adapter") 

if __name__ == "__main__":
    main()