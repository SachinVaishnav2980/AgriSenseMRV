from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.model_loader import ModelManager
from utils.preprocessor import (
    preprocess_image, 
    prepare_soil_data, 
    classify_health
)
from utils.recommendations import (
    get_treatment_recommendations,
    get_soil_recommendations
)
from config import Config
import traceback

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})

# Load all models at startup
print("Initializing AgriSense-MRV Backend...")
model_manager = ModelManager()
print("Backend ready!")


@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'AgriSense-MRV API is running',
        'version': '1.0.0'
    })


@app.route('/api/predict/crop-disease', methods=['POST'])
def predict_crop_disease():
    """
    Endpoint to detect crop disease from leaf image
    Expects: multipart/form-data with 'image' file
    """
    try:
        # Check if image is provided
        if 'image' not in request.files:
            return jsonify({
                'status': 'error',
                'message': 'No image file provided'
            }), 400
        
        image_file = request.files['image']
        
        # Check if file is empty
        if image_file.filename == '':
            return jsonify({
                'status': 'error',
                'message': 'Empty filename'
            }), 400
        
        # Preprocess image
        processed_image = preprocess_image(image_file)
        
        # Get prediction
        prediction = model_manager.predict_crop_disease(processed_image)
        
        # Get recommendations
        recommendations = get_treatment_recommendations(prediction['class_name'])
        
        return jsonify({
            'status': 'success',
            'data': {
                'disease': prediction['class_name'],
                'confidence': prediction['confidence'],
                'confidence_percentage': f"{prediction['confidence'] * 100:.2f}%",
                'recommendations': recommendations
            }
        })
    
    except Exception as e:
        print(f"Error in crop disease prediction: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


@app.route('/api/predict/soil-health', methods=['POST'])
def predict_soil_health():
    """
    Endpoint to analyze soil health and disease risk
    Expects: JSON data with soil parameters
    """
    try:
        # Get JSON data
        data = request.get_json(silent=True)
        
        if not data or data is None:
            return jsonify({
                'status': 'error',
                'message': 'No data provided'
            }), 400
        
        # Prepare soil features
        soil_features = prepare_soil_data(data)
        
        # Get predictions
        health_score = model_manager.predict_soil_health(soil_features)
        disease_risk = model_manager.predict_soil_disease_risk(soil_features)
        
        # Classify health
        health_class = classify_health(health_score)
        
        # Get recommendations
        recommendations = get_soil_recommendations(
            health_score, 
            disease_risk,
            data
        )
        
        return jsonify({
            'status': 'success',
            'data': {
                'soil_health': {
                    'score': round(health_score, 2),
                    'class': health_class,
                    'percentage': f"{health_score:.1f}%"
                },
                'disease_risk': {
                    'class': disease_risk['risk_class'],
                    'probabilities': disease_risk['probabilities']
                },
                'recommendations': recommendations
            }
        })
    
    except Exception as e:
        print(f"Error in soil health prediction: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


@app.route('/api/predict/integrated', methods=['POST'])
def integrated_analysis():
    """
    Endpoint for integrated analysis (both crop and soil)
    Expects: multipart/form-data with 'image' file and 'soilData' JSON string
    """
    try:
        # Check for image
        if 'image' not in request.files:
            return jsonify({
                'status': 'error',
                'message': 'No image file provided'
            }), 400
        
        image_file = request.files['image']
        
        # Get soil data from form
        import json
        soil_data_str = request.form.get('soilData')
        if not soil_data_str:
            return jsonify({
                'status': 'error',
                'message': 'No soil data provided'
            }), 400
        
        soil_data = json.loads(soil_data_str)
        
        # Process image
        processed_image = preprocess_image(image_file)
        crop_prediction = model_manager.predict_crop_disease(processed_image)
        crop_recommendations = get_treatment_recommendations(crop_prediction['class_name'])
        
        # Process soil data
        soil_features = prepare_soil_data(soil_data)
        health_score = model_manager.predict_soil_health(soil_features)
        disease_risk = model_manager.predict_soil_disease_risk(soil_features)
        health_class = classify_health(health_score)
        soil_recommendations = get_soil_recommendations(health_score, disease_risk, soil_data)
        
        # Generate integrated insights
        integrated_insights = generate_integrated_insights(
            crop_prediction,
            health_score,
            disease_risk
        )
        
        return jsonify({
            'status': 'success',
            'data': {
                'crop_analysis': {
                    'disease': crop_prediction['class_name'],
                    'confidence': crop_prediction['confidence'],
                    'recommendations': crop_recommendations
                },
                'soil_analysis': {
                    'health_score': round(health_score, 2),
                    'health_class': health_class,
                    'disease_risk': disease_risk['risk_class'],
                    'recommendations': soil_recommendations
                },
                'integrated_insights': integrated_insights
            }
        })
    
    except Exception as e:
        print(f"Error in integrated analysis: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


def generate_integrated_insights(crop_prediction, health_score, disease_risk):
    """Generate combined insights from crop and soil analysis"""
    insights = []
    
    is_diseased = 'healthy' not in crop_prediction['class_name'].lower()
    risk_class = disease_risk['risk_class']
    
    if is_diseased and risk_class == 'High':
        insights.append('🚨 CRITICAL: Both crop disease detected and high soil disease risk')
        insights.append('Immediate intervention required on both fronts')
        insights.append('Disease may be soil-borne or exacerbated by poor soil conditions')
    elif is_diseased and health_score < 50:
        insights.append('⚠️ Crop disease detected with poor soil health')
        insights.append('Improving soil conditions may help prevent future outbreaks')
        insights.append('Consider soil amendments along with disease treatment')
    elif not is_diseased and risk_class == 'High':
        insights.append('✓ Crop currently healthy but soil shows high disease risk')
        insights.append('This is an early warning - take preventive measures now')
        insights.append('Focus on improving soil conditions to maintain crop health')
    elif not is_diseased and health_score > 70:
        insights.append('✅ EXCELLENT: Both crop and soil are in good health')
        insights.append('Maintain current farming practices')
        insights.append('Continue regular monitoring')
    else:
        insights.append('Overall farm health is moderate')
        insights.append('Room for improvement in both crop and soil management')
    
    return insights


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)