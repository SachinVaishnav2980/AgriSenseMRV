import os

class Config:
    # Base directory
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    
    # Model paths
    MODELS_DIR = os.path.join(BASE_DIR, 'models')
    CROP_MODEL_H5 = os.path.join(MODELS_DIR, 'best_finetuned_model.h5')
    CROP_MODEL_PKL = os.path.join(MODELS_DIR, 'crop_disease_model_finetuned.pkl')
    SOIL_HEALTH_MODEL = os.path.join(MODELS_DIR, 'soil_health_regression.pkl')
    SOIL_DISEASE_MODEL = os.path.join(MODELS_DIR, 'soil_disease_risk.pkl')
    LABEL_ENCODERS = os.path.join(MODELS_DIR, 'soil_label_encoders.pkl')
    
    # Image processing
    IMAGE_SIZE = (224, 224)  # Model input size
    
    # CORS settings
    CORS_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]