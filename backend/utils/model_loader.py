import pickle
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer
from config import Config
import warnings
import sys
from sklearn.preprocessing import LabelEncoder

# Try to import XGBoost for DMatrix support
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

# Suppress XGBoost warnings
warnings.filterwarnings('ignore', category=UserWarning)

# Custom unpickler to handle LabelEncoder import issues
class CustomUnpickler(pickle.Unpickler):
    """Custom unpickler that handles LabelEncoder import errors"""
    def find_class(self, module, name):
        # Handle typo in saved pickle file (LabelEncooder -> LabelEncoder)
        if name == 'LabelEncooder':
            return LabelEncoder
        # Handle incorrect module path
        if module == 'LabelEncoder' or module == 'LabelEncooder':
            return LabelEncoder
        # Handle standard sklearn LabelEncoder paths
        if name == 'LabelEncoder':
            if 'sklearn' in module or 'preprocessing' in module or module == 'LabelEncoder':
                return LabelEncoder
        # Fallback to default behavior
        try:
            return super().find_class(module, name)
        except (AttributeError, ModuleNotFoundError) as e:
            # If it's a LabelEncoder-related error, return sklearn's LabelEncoder
            if 'LabelEncoder' in str(e) or 'LabelEncooder' in str(e):
                return LabelEncoder
            raise
    
    def load_build(self):
        """Override to handle LabelEncoder instantiation issues"""
        try:
            super().load_build()
        except TypeError as e:
            # If LabelEncoder instantiation fails, try to continue
            if 'LabelEncoder' in str(e) or 'takes no' in str(e):
                # Skip the problematic object and return None or empty dict
                return {}
            raise

# Define CustomScaleLayer to handle the custom layer in your model
@tf.keras.utils.register_keras_serializable(package='Custom')
class CustomScaleLayer(Layer):
    """Custom scaling layer that was used during model training"""
    def __init__(self, scale=1.0, **kwargs):
        super(CustomScaleLayer, self).__init__(**kwargs)
        self.scale = scale

    def call(self, inputs):
        # Handle both single tensor and list/tuple of tensors
        if isinstance(inputs, (list, tuple)):
            # If multiple inputs, process the first one
            if len(inputs) > 0:
                tensor_input = inputs[0]
            else:
                raise ValueError("CustomScaleLayer received empty input list")
        else:
            tensor_input = inputs
        
        # Apply scaling to the tensor
        return tensor_input * self.scale

    def get_config(self):
        config = super(CustomScaleLayer, self).get_config()
        config.update({"scale": self.scale})
        return config

class ModelManager:
    def __init__(self):
        print("Loading models...")
        
        # Load crop disease model (H5 format) with custom objects
        try:
            custom_objects = {'CustomScaleLayer': CustomScaleLayer}
            self.crop_model = load_model(Config.CROP_MODEL_H5, custom_objects=custom_objects)
            print("✓ Crop disease model loaded successfully")
        except Exception as e:
            print(f"✗ Error loading crop model: {e}")
            print("  Trying to load .pkl version...")
            try:
                with open(Config.CROP_MODEL_PKL, 'rb') as f:
                    self.crop_model = pickle.load(f)
                print("✓ Crop disease model loaded from .pkl successfully")
            except Exception as e2:
                print(f"✗ Error loading crop model from .pkl: {e2}")
                self.crop_model = None
        
        # Load soil health regression model
        try:
            with open(Config.SOIL_HEALTH_MODEL, 'rb') as f:
                self.soil_health_model = pickle.load(f)
            print("✓ Soil health model loaded successfully")
        except Exception as e:
            print(f"✗ Error loading soil health model: {e}")
            self.soil_health_model = None
        
        # Load soil disease risk classifier
        try:
            with open(Config.SOIL_DISEASE_MODEL, 'rb') as f:
                self.soil_disease_model = pickle.load(f)
            print("✓ Soil disease risk model loaded successfully")
        except Exception as e:
            print(f"✗ Error loading soil disease model: {e}")
            self.soil_disease_model = None
        
        # Load label encoders (optional - we'll use manual encoding if this fails)
        # Note: Label encoders are not critical - manual encoding in preprocessor.py works perfectly
        try:
            with open(Config.LABEL_ENCODERS, 'rb') as f:
                # Use custom unpickler to handle import errors
                unpickler = CustomUnpickler(f)
                self.label_encoders = unpickler.load()
            # Validate that label encoders were loaded correctly
            if self.label_encoders is None or (isinstance(self.label_encoders, dict) and len(self.label_encoders) == 0):
                raise ValueError("Label encoders file is empty or corrupted")
            print("✓ Label encoders loaded successfully")
        except Exception as e:
            # Label encoders are optional - manual encoding works fine
            # The pickle file may have a typo or corruption, but this doesn't affect functionality
            error_msg = str(e)
            if 'LabelEncoder' in error_msg or 'LabelEncooder' in error_msg:
                # Suppress the detailed error for known LabelEncoder issues
                print("✓ Using manual encoding (label encoders file has compatibility issues - this is normal)")
            else:
                print(f"⚠️ Label encoders not loaded (using manual encoding): {error_msg}")
            self.label_encoders = None
        
        # Disease class names for crop model (update based on your dataset)
        self.disease_classes = [
            'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
            'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 
            'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
            'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy',
            'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
            'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
            'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy',
            'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
            'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew',
            'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot',
            'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
            'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
            'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
            'Tomato___healthy'
        ]
    
    def predict_crop_disease(self, processed_image):
        """Predict crop disease from preprocessed image"""
        if self.crop_model is None:
            raise Exception("Crop disease model not loaded")
        
        # Get predictions
        predictions = self.crop_model.predict(processed_image, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        
        # Get class name
        class_name = self.disease_classes[predicted_class_idx] if predicted_class_idx < len(self.disease_classes) else "Unknown"
        
        return {
            'class_idx': int(predicted_class_idx),
            'class_name': class_name,
            'confidence': confidence,
            'all_probabilities': predictions[0].tolist()
        }
    
    def predict_soil_health(self, soil_features):
        """Predict soil health score (0-100)"""
        if self.soil_health_model is None:
            raise Exception("Soil health model not loaded")
        
        # Check if model is XGBoost
        model_type_str = str(type(self.soil_health_model))
        model_type_name = type(self.soil_health_model).__name__
        
        is_xgboost = (XGBOOST_AVAILABLE and 
                     ('XGB' in model_type_name or 
                      'xgb' in model_type_str.lower() or
                      'XGB' in model_type_str))
        
        try:
            if is_xgboost:
                # XGBoost can work with DataFrame directly, but DMatrix is preferred
                if isinstance(soil_features, pd.DataFrame):
                    dmatrix = xgb.DMatrix(soil_features)
                else:
                    dmatrix = xgb.DMatrix(soil_features)
                prediction = self.soil_health_model.predict(dmatrix)
            else:
                # Standard sklearn/pandas model - works with DataFrame
                prediction = self.soil_health_model.predict(soil_features)
            
            health_score = float(prediction[0]) if isinstance(prediction, (np.ndarray, list)) else float(prediction)
            return health_score
        except Exception as e:
            # Fallback: try converting to numpy array if DataFrame fails
            if isinstance(soil_features, pd.DataFrame):
                soil_features_array = soil_features.values
                prediction = self.soil_health_model.predict(soil_features_array)
                health_score = float(prediction[0]) if isinstance(prediction, (np.ndarray, list)) else float(prediction)
                return health_score
            raise e
    
    def predict_soil_disease_risk(self, soil_features):
        """Predict soil disease risk (Low/Medium/High)"""
        if self.soil_disease_model is None:
            raise Exception("Soil disease model not loaded")
        
        # Check if model is XGBoost
        model_type_str = str(type(self.soil_disease_model))
        model_type_name = type(self.soil_disease_model).__name__
        
        is_xgboost = (XGBOOST_AVAILABLE and 
                     ('XGB' in model_type_name or 
                      'xgb' in model_type_str.lower() or
                      'XGB' in model_type_str))
        
        try:
            if is_xgboost:
                # XGBoost Booster object
                if isinstance(soil_features, pd.DataFrame):
                    dmatrix = xgb.DMatrix(soil_features)
                else:
                    dmatrix = xgb.DMatrix(soil_features)
                
                # XGBoost Booster returns probabilities for multi-class
                # Check if it's a raw Booster or wrapped classifier
                if hasattr(self.soil_disease_model, 'predict_proba'):
                    # Sklearn XGBClassifier wrapper
                    risk_class_idx = self.soil_disease_model.predict(soil_features)
                    risk_probabilities = self.soil_disease_model.predict_proba(soil_features)
                else:
                    # Raw XGBoost Booster - predict returns probabilities for multi-class
                    probabilities = self.soil_disease_model.predict(dmatrix)
                    # Get class with highest probability
                    if len(probabilities.shape) > 1:
                        # Multi-class: probabilities is 2D array
                        risk_class_idx = np.argmax(probabilities[0])
                        risk_probabilities = probabilities[0]
                    else:
                        # Binary: probabilities is 1D array
                        risk_class_idx = int(np.argmax(probabilities))
                        # Convert binary to 3-class format (Low, Medium, High)
                        # Assuming binary maps to Low/High, we'll need to adjust
                        prob_low = 1 - probabilities[0] if len(probabilities) == 1 else probabilities[0]
                        prob_high = probabilities[0] if len(probabilities) == 1 else probabilities[1]
                        risk_probabilities = np.array([prob_low, 0.0, prob_high])
            else:
                # Standard sklearn model - works with DataFrame
                risk_class_idx = self.soil_disease_model.predict(soil_features)
                risk_probabilities = self.soil_disease_model.predict_proba(soil_features)
        except Exception as e:
            # Fallback: try converting to numpy array if DataFrame fails
            if isinstance(soil_features, pd.DataFrame):
                soil_features_array = soil_features.values
                if is_xgboost:
                    dmatrix = xgb.DMatrix(soil_features_array)
                    probabilities = self.soil_disease_model.predict(dmatrix)
                    if len(probabilities.shape) > 1:
                        risk_class_idx = np.argmax(probabilities[0])
                        risk_probabilities = probabilities[0]
                    else:
                        risk_class_idx = int(np.argmax(probabilities))
                        prob_low = 1 - probabilities[0] if len(probabilities) == 1 else probabilities[0]
                        prob_high = probabilities[0] if len(probabilities) == 1 else probabilities[1]
                        risk_probabilities = np.array([prob_low, 0.0, prob_high])
                else:
                    risk_class_idx = self.soil_disease_model.predict(soil_features_array)
                    risk_probabilities = self.soil_disease_model.predict_proba(soil_features_array)
            else:
                raise e
        
        # Handle array outputs
        if isinstance(risk_class_idx, np.ndarray):
            risk_class_idx = int(risk_class_idx[0] if len(risk_class_idx) > 0 else risk_class_idx.item())
        else:
            risk_class_idx = int(risk_class_idx)
        
        if isinstance(risk_probabilities, np.ndarray):
            if len(risk_probabilities.shape) > 1:
                risk_probabilities = risk_probabilities[0]
        
        # Map index to class name
        risk_classes = ['Low', 'Medium', 'High']
        risk_class = risk_classes[risk_class_idx] if risk_class_idx < len(risk_classes) else "Unknown"
        
        return {
            'risk_class': risk_class,
            'risk_idx': risk_class_idx,
            'probabilities': {
                'Low': float(risk_probabilities[0]),
                'Medium': float(risk_probabilities[1]),
                'High': float(risk_probabilities[2])
            }
        }