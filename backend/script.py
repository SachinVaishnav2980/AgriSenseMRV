import pickle

# Load and inspect the pkl file
with open('models/crop_disease_model_finetuned.pkl', 'rb') as f:
    model = pickle.load(f)
    print(f"Model type: {type(model)}")
    print(f"Model: {model}")