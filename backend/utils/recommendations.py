def get_treatment_recommendations(disease_name):
    """
    Get treatment recommendations for detected crop disease
    """
    # Disease treatment database
    treatments = {
        'Tomato___Late_blight': [
            'Remove and destroy infected leaves immediately',
            'Apply copper-based fungicides (Bordeaux mixture)',
            'Improve air circulation between plants',
            'Avoid overhead watering - use drip irrigation',
            'Apply preventive fungicides before rainy season'
        ],
        'Tomato___Early_blight': [
            'Remove infected lower leaves',
            'Apply fungicides containing chlorothalonil',
            'Maintain proper spacing between plants',
            'Use mulch to prevent soil splash',
            'Rotate crops annually'
        ],
        'Potato___Late_blight': [
            'Apply protective fungicides immediately',
            'Remove infected plants to prevent spread',
            'Ensure good drainage',
            'Avoid irrigation during humid conditions'
        ],
        'Apple___Apple_scab': [
            'Apply fungicides during growing season',
            'Remove fallen leaves in autumn',
            'Prune trees for better air circulation',
            'Choose resistant varieties for new plantings'
        ],
        'Grape___Black_rot': [
            'Remove mummified berries and infected leaves',
            'Apply fungicides from bud break to harvest',
            'Prune vines for air circulation',
            'Maintain vineyard sanitation'
        ]
    }
    
    # Check if disease has specific treatment
    if disease_name in treatments:
        return treatments[disease_name]
    
    # Check if it's a healthy plant
    if 'healthy' in disease_name.lower():
        return [
            'Plant appears healthy',
            'Continue regular monitoring',
            'Maintain proper watering and nutrition',
            'Keep watching for early symptoms'
        ]
    
    # Generic recommendations for unknown diseases
    return [
        'Consult with local agricultural extension officer',
        'Take sample to plant pathology lab for accurate diagnosis',
        'Isolate affected plants if possible',
        'Document symptoms with photographs',
        'Consider soil testing for underlying issues'
    ]


def get_soil_recommendations(health_score, disease_risk_data, soil_params=None):
    """
    Get recommendations based on soil health score and disease risk
    """
    recommendations = []
    
    # Health score based recommendations
    if health_score < 40:
        recommendations.append('⚠️ CRITICAL: Soil health is very poor - immediate intervention required')
        recommendations.append('Consider comprehensive soil testing')
        recommendations.append('Apply organic matter (compost, manure) to improve soil structure')
        recommendations.append('May need to rest the field or rotate with cover crops')
    elif health_score < 70:
        recommendations.append('⚡ Soil health is moderate - improvements recommended')
        recommendations.append('Add organic amendments to boost soil fertility')
        recommendations.append('Consider cover cropping between seasons')
    else:
        recommendations.append('✓ Soil health is good - maintain current practices')
        recommendations.append('Continue regular monitoring')
    
    # Disease risk based recommendations
    risk_class = disease_risk_data.get('risk_class', 'Unknown')
    if risk_class == 'High':
        recommendations.append('🚨 HIGH disease risk detected')
        recommendations.append('Implement preventive fungicide applications')
        recommendations.append('Improve drainage if soil moisture is high')
        recommendations.append('Consider disease-resistant crop varieties')
        recommendations.append('Monitor crops weekly for disease symptoms')
    elif risk_class == 'Medium':
        recommendations.append('⚠️ MODERATE disease risk - take preventive measures')
        recommendations.append('Scout fields regularly')
        recommendations.append('Prepare emergency treatment plan')
    else:
        recommendations.append('✓ Low disease risk - maintain vigilance')
    
    # Add parameter-specific recommendations if provided
    if soil_params:
        if float(soil_params.get('ph', 7)) < 6.0:
            recommendations.append('Soil is acidic - consider lime application')
        elif float(soil_params.get('ph', 7)) > 8.0:
            recommendations.append('Soil is alkaline - consider sulfur application')
        
        if float(soil_params.get('nitrogen', 0)) < 200:
            recommendations.append('Nitrogen levels low - apply nitrogen fertilizer')
        
        if float(soil_params.get('phosphorous', 0)) < 30:
            recommendations.append('Phosphorous levels low - apply phosphate fertilizer')
        
        if float(soil_params.get('potassium', 0)) < 150:
            recommendations.append('Potassium levels low - apply potash fertilizer')
    
    return recommendations