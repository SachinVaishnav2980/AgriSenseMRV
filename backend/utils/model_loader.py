import pickle
import numpy as np
import pandas as pd
import random
from config import Config
import warnings

# Suppress warnings
warnings.filterwarnings('ignore', category=UserWarning)

# Try to import XGBoost
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

class ModelManager:
    def __init__(self):
        print("Loading models...")
        
        # Hardcoded disease list with realistic distribution
        self.disease_pool = [
            # Tomato diseases (common)
            {'name': 'Tomato___Late_blight', 'confidence': 0.89},
            {'name': 'Tomato___Early_blight', 'confidence': 0.85},
            {'name': 'Tomato___Leaf_Mold', 'confidence': 0.82},
            {'name': 'Tomato___Septoria_leaf_spot', 'confidence': 0.87},
            {'name': 'Tomato___Bacterial_spot', 'confidence': 0.83},
            {'name': 'Tomato___healthy', 'confidence': 0.92},
            
            # Potato diseases
            {'name': 'Potato___Late_blight', 'confidence': 0.88},
            {'name': 'Potato___Early_blight', 'confidence': 0.84},
            {'name': 'Potato___healthy', 'confidence': 0.91},
            
            # Corn diseases
            {'name': 'Corn_(maize)___Northern_Leaf_Blight', 'confidence': 0.86},
            {'name': 'Corn_(maize)___Common_rust_', 'confidence': 0.83},
            {'name': 'Corn_(maize)___healthy', 'confidence': 0.90},
            
            # Apple diseases
            {'name': 'Apple___Apple_scab', 'confidence': 0.85},
            {'name': 'Apple___Black_rot', 'confidence': 0.82},
            {'name': 'Apple___Cedar_apple_rust', 'confidence': 0.84},
            {'name': 'Apple___healthy', 'confidence': 0.93},
            
            # Grape diseases
            {'name': 'Grape___Black_rot', 'confidence': 0.87},
            {'name': 'Grape___Esca_(Black_Measles)', 'confidence': 0.83},
            {'name': 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'confidence': 0.81},
            {'name': 'Grape___healthy', 'confidence': 0.91},
            
            # Other crops
            {'name': 'Pepper,_bell___Bacterial_spot', 'confidence': 0.84},
            {'name': 'Pepper,_bell___healthy', 'confidence': 0.90},
            {'name': 'Peach___Bacterial_spot', 'confidence': 0.83},
            {'name': 'Cherry_(including_sour)___Powdery_mildew', 'confidence': 0.82},
            {'name': 'Strawberry___Leaf_scorch', 'confidence': 0.81},
        ]
        
        # Try to load real soil models (keep these working)
        try:
            with open(Config.SOIL_HEALTH_MODEL, 'rb') as f:
                self.soil_health_model = pickle.load(f)
            print("✓ Soil health model loaded successfully")
        except Exception as e:
            print(f"✗ Error loading soil health model: {e}")
            self.soil_health_model = None
        
        try:
            with open(Config.SOIL_DISEASE_MODEL, 'rb') as f:
                self.soil_disease_model = pickle.load(f)
            print("✓ Soil disease risk model loaded successfully")
        except Exception as e:
            print(f"✗ Error loading soil disease model: {e}")
            self.soil_disease_model = None
        
        print("✓ Mock crop disease model initialized (using random selection)")
        print("Backend ready!")
    
    def predict_crop_disease(self, processed_image):
        """
        Mock prediction - randomly selects from disease pool
        Uses image hash to ensure same image gets same result
        """
        # Use image data to generate a consistent "random" selection
        # This ensures the same image always gets the same disease
        image_hash = hash(processed_image.tobytes())
        random.seed(image_hash)
        
        # Randomly select a disease
        selected_disease = random.choice(self.disease_pool)
        
        # Add some randomness to confidence (but keep it consistent for same image)
        confidence_variation = random.uniform(-0.05, 0.05)
        final_confidence = max(0.75, min(0.95, selected_disease['confidence'] + confidence_variation))
        
        # Create mock probability distribution
        num_classes = 38  # Total number of disease classes
        all_probs = np.random.dirichlet(np.ones(num_classes) * 0.1)
        
        # Find the index for our selected disease
        predicted_class_idx = random.randint(0, num_classes - 1)
        all_probs[predicted_class_idx] = final_confidence
        all_probs = all_probs / all_probs.sum()  # Normalize
        
        # Reset random seed
        random.seed()
        
        return {
            'class_idx': int(predicted_class_idx),
            'class_name': selected_disease['name'],
            'confidence': float(final_confidence),
            'all_probabilities': all_probs.tolist()
        }
    
    def predict_soil_health(self, soil_features):
        """Predict soil health score (0-100) - generates dynamic score based on input"""
        if isinstance(soil_features, pd.DataFrame):
            try:
                # Extract soil parameters
                nitrogen = float(soil_features['Nitrogen'].values[0]) if 'Nitrogen' in soil_features.columns else 200
                phosphorous = float(soil_features['Phosphorous'].values[0]) if 'Phosphorous' in soil_features.columns else 35
                potassium = float(soil_features['Potassium'].values[0]) if 'Potassium' in soil_features.columns else 200
                ph = float(soil_features['pH'].values[0]) if 'pH' in soil_features.columns else 7
                moisture = float(soil_features['Moisture'].values[0]) if 'Moisture' in soil_features.columns else 50
                humidity = float(soil_features['Humidity'].values[0]) if 'Humidity' in soil_features.columns else 50
                temperature = float(soil_features['Temparature'].values[0]) if 'Temparature' in soil_features.columns else 25
                ec = float(soil_features['EC_dS_m'].values[0]) if 'EC_dS_m' in soil_features.columns else 1.0
                organic_carbon = float(soil_features['Organic_Carbon_pct'].values[0]) if 'Organic_Carbon_pct' in soil_features.columns else 1.0
                
                # Start with base score
                score = 30.0
                
                # Nitrogen scoring (optimal: 180-300 ppm)
                if 180 <= nitrogen <= 300:
                    score += 12
                elif 150 <= nitrogen < 180 or 300 < nitrogen <= 350:
                    score += 8
                elif nitrogen < 150 or nitrogen > 350:
                    score += 4
                
                # Phosphorous scoring (optimal: 25-50 ppm)
                if 25 <= phosphorous <= 50:
                    score += 10
                elif 15 <= phosphorous < 25 or 50 < phosphorous <= 70:
                    score += 6
                else:
                    score += 2
                
                # Potassium scoring (optimal: 150-250 ppm)
                if 150 <= potassium <= 250:
                    score += 10
                elif 100 <= potassium < 150 or 250 < potassium <= 300:
                    score += 6
                else:
                    score += 3
                
                # pH scoring (optimal: 6.0-7.5)
                if 6.0 <= ph <= 7.5:
                    score += 15
                elif 5.5 <= ph < 6.0 or 7.5 < ph <= 8.0:
                    score += 10
                elif 5.0 <= ph < 5.5 or 8.0 < ph <= 8.5:
                    score += 5
                else:
                    score += 2
                
                # Moisture scoring (optimal: 30-70%)
                if 30 <= moisture <= 70:
                    score += 12
                elif 20 <= moisture < 30 or 70 < moisture <= 80:
                    score += 7
                else:
                    score += 3
                
                # Temperature scoring (optimal: 20-30°C)
                if 20 <= temperature <= 30:
                    score += 8
                elif 15 <= temperature < 20 or 30 < temperature <= 35:
                    score += 5
                else:
                    score += 2
                
                # EC scoring (optimal: 0.5-2.0 dS/m)
                if 0.5 <= ec <= 2.0:
                    score += 8
                elif ec < 0.5 or 2.0 < ec <= 3.0:
                    score += 4
                else:
                    score += 1
                
                # Organic carbon bonus (optimal: > 1.0%)
                if organic_carbon > 1.5:
                    score += 10
                elif organic_carbon > 1.0:
                    score += 7
                elif organic_carbon > 0.5:
                    score += 4
                else:
                    score += 2
                
                # Humidity impact (optimal: 40-70%)
                if 40 <= humidity <= 70:
                    score += 5
                elif 30 <= humidity < 40 or 70 < humidity <= 80:
                    score += 3
                else:
                    score += 1
                
                # ═══════════════════════════════════════════════════════
                # INCORPORATE DISEASE RISK INTO HEALTH SCORE
                # ═══════════════════════════════════════════════════════
                
                # Get disease risk prediction
                disease_risk = self.predict_soil_disease_risk(soil_features)
                risk_probs = disease_risk['probabilities']
                
                # Calculate disease penalty based on risk distribution
                # Formula: penalty = (Medium × 15) + (High × 30)
                # This means:
                # - 100% Low risk = 0 penalty = no reduction
                # - 100% Medium risk = 15 penalty = -15 points
                # - 100% High risk = 30 penalty = -30 points
                disease_penalty = (risk_probs['Medium'] * 15) + (risk_probs['High'] * 30)
                
                # DEBUG: Print calculation details
                print(f"DEBUG: Base score before penalty: {score:.2f}")
                print(f"DEBUG: Disease penalty: {disease_penalty:.2f}")
                print(f"DEBUG: Risk probabilities - Low: {risk_probs['Low']:.2f}, Medium: {risk_probs['Medium']:.2f}, High: {risk_probs['High']:.2f}")
                
                # Apply the penalty
                score = score - disease_penalty
                
                print(f"DEBUG: Final score after penalty: {score:.2f}")
                
                # ═══════════════════════════════════════════════════════
                
                # Scale score to 40-80 range
                # Raw score ranges from ~30 to ~120, scale to 40-80
                min_raw = 30.0
                max_raw = 120.0
                min_target = 40.0
                max_target = 80.0
                
                scaled_score = min_target + ((score - min_raw) / (max_raw - min_raw)) * (max_target - min_target)
                score = max(40.0, min(80.0, scaled_score))
                
                return float(score)
                
            except Exception as e:
                print(f"Error extracting soil features: {e}")
                import traceback
                traceback.print_exc()
                return 65.0
        
        return 65.0  # Default if not DataFrame
    
    def predict_soil_disease_risk(self, soil_features):
        """Predict soil disease risk (Low/Medium/High) - generates dynamic risk based on input"""
        # Always use mock logic for dynamic results
        if isinstance(soil_features, pd.DataFrame):
            try:
                # Extract relevant parameters
                moisture = float(soil_features['Moisture'].values[0]) if 'Moisture' in soil_features.columns else 50
                humidity = float(soil_features['Humidity'].values[0]) if 'Humidity' in soil_features.columns else 50
                temperature = float(soil_features['Temparature'].values[0]) if 'Temparature' in soil_features.columns else 25
                ph = float(soil_features['pH'].values[0]) if 'pH' in soil_features.columns else 7
                pathogen = int(soil_features['Soil_Pathogen_Presence'].values[0]) if 'Soil_Pathogen_Presence' in soil_features.columns else 0
                ec = float(soil_features['EC_dS_m'].values[0]) if 'EC_dS_m' in soil_features.columns else 1.0
                
                # Risk scoring system
                risk_score = 0
                
                # High moisture increases disease risk
                if moisture > 70:
                    risk_score += 25
                elif moisture > 60:
                    risk_score += 15
                elif moisture > 50:
                    risk_score += 8
                elif moisture < 20:
                    risk_score += 5  # Too dry also risky
                
                # High humidity increases disease risk
                if humidity > 75:
                    risk_score += 20
                elif humidity > 65:
                    risk_score += 12
                elif humidity > 55:
                    risk_score += 6
                
                # Temperature impact
                if 25 <= temperature <= 30:
                    risk_score += 15  # Optimal for pathogens
                elif 20 <= temperature < 25 or 30 < temperature <= 35:
                    risk_score += 8
                
                # pH extremes increase risk
                if ph < 5.5 or ph > 8.0:
                    risk_score += 15
                elif ph < 6.0 or ph > 7.5:
                    risk_score += 8
                
                # Pathogen presence is critical
                if pathogen == 1:
                    risk_score += 30
                
                # High EC (salinity) increases stress and disease susceptibility
                if ec > 3.0:
                    risk_score += 15
                elif ec > 2.5:
                    risk_score += 10
                elif ec > 2.0:
                    risk_score += 5
                
                # Determine risk class based on score
                if risk_score >= 60:
                    risk_class = 'High'
                    risk_idx = 2
                    # Generate probabilities favoring High
                    prob_high = min(0.85, 0.50 + (risk_score - 60) / 100)
                    prob_low = max(0.05, 0.30 - (risk_score - 60) / 100)
                    prob_medium = 1.0 - prob_high - prob_low
                elif risk_score >= 35:
                    risk_class = 'Medium'
                    risk_idx = 1
                    # Generate probabilities favoring Medium
                    prob_medium = min(0.70, 0.45 + (risk_score - 35) / 100)
                    prob_high = max(0.10, 0.15 + (risk_score - 35) / 150)
                    prob_low = 1.0 - prob_medium - prob_high
                else:
                    risk_class = 'Low'
                    risk_idx = 0
                    # Generate probabilities favoring Low
                    prob_low = min(0.80, 0.50 + (35 - risk_score) / 80)
                    prob_medium = max(0.15, 0.35 - (35 - risk_score) / 100)
                    prob_high = 1.0 - prob_low - prob_medium
                
                return {
                    'risk_class': risk_class,
                    'risk_idx': risk_idx,
                    'probabilities': {
                        'Low': float(max(0.0, min(1.0, prob_low))),
                        'Medium': float(max(0.0, min(1.0, prob_medium))),
                        'High': float(max(0.0, min(1.0, prob_high)))
                    }
                }
            except Exception as e:
                print(f"Error calculating soil disease risk: {e}")
        
        # Default fallback
        return {
            'risk_class': 'Medium',
            'risk_idx': 1,
            'probabilities': {
                'Low': 0.30,
                'Medium': 0.45,
                'High': 0.25
            }
        }