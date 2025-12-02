import numpy as np
import pandas as pd
from PIL import Image
import io
from config import Config

def preprocess_image(image_file):
    """
    Preprocess uploaded image for InceptionResNetV2
    Expected input: FileStorage object from Flask
    Returns: numpy array ready for model prediction
    """
    try:
        # Read image from file
        image_bytes = image_file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size
        image = image.resize(Config.IMAGE_SIZE)
        
        # Convert to array and normalize (0-1)
        img_array = np.array(image, dtype=np.float32) / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")


def prepare_soil_data(raw_data):
    """
    Prepare soil data for model prediction
    Expected format matches your training data columns
    """
    try:
        # Extract and convert values
        temperature = float(raw_data.get('temperature', 0))
        humidity = float(raw_data.get('humidity', 0))
        moisture = float(raw_data.get('moisture', 0))
        soil_type = raw_data.get('soil_type', 'Loamy')
        nitrogen = float(raw_data.get('nitrogen', 0))
        phosphorous = float(raw_data.get('phosphorous', 0))
        potassium = float(raw_data.get('potassium', 0))
        ph = float(raw_data.get('ph', 7.0))
        ec = float(raw_data.get('ec', 0))
        organic_carbon = float(raw_data.get('organic_carbon', 0))
        pathogen_presence = int(raw_data.get('pathogen_presence', 0))
        salinity_class = raw_data.get('salinity_class', 'Normal')
        latitude = float(raw_data.get('latitude', 0))
        longitude = float(raw_data.get('longitude', 0))
        
        # Encode categorical variables
        soil_type_encoded = encode_soil_type(soil_type)
        salinity_encoded = encode_salinity(salinity_class)
        
        # Create DataFrame with expected column names (matching training data)
        # Note: Column names match what the model expects
        features_df = pd.DataFrame([{
            'Temparature': temperature,  # Note: typo in original training data
            'Humidity': humidity,
            'Moisture': moisture,
            'Soil Type_enc': soil_type_encoded,
            'Nitrogen': nitrogen,
            'Potassium': potassium,
            'Phosphorous': phosphorous,
            'pH': ph,
            'EC_dS_m': ec,
            'Organic_Carbon_pct': organic_carbon,
            'Salinity_Class_enc': salinity_encoded,
            'Soil_Pathogen_Presence': pathogen_presence,
            'Latitude': latitude,
            'Longitude': longitude
        }])
        
        return features_df
    
    except Exception as e:
        raise Exception(f"Error preparing soil data: {str(e)}")


def encode_soil_type(soil_type):
    """Encode soil type to numeric value"""
    mapping = {
        'Sandy': 0,
        'Loamy': 1,
        'Black': 2,
        'Red': 3,
        'Clayey': 4
    }
    return mapping.get(soil_type, 1)  # Default to Loamy


def encode_salinity(salinity_class):
    """Encode salinity class to numeric value"""
    mapping = {
        'Normal': 0,
        'Slightly Saline': 1,
        'Moderately Saline': 2,
        'Highly Saline': 3
    }
    return mapping.get(salinity_class, 0)  # Default to Normal


def classify_health(health_score):
    """Classify soil health score into categories"""
    if health_score >= 70:
        return "High"
    elif health_score >= 40:
        return "Medium"
    else:
        return "Low"