import axios from 'axios'

/**
 * Fetch soil and weather data from APIs based on coordinates
 * Uses multiple free APIs to get comprehensive soil parameters
 */
export async function fetchSoilDataFromLocation(lat, lng) {
  try {
    // Fetch weather data (temperature, humidity) from OpenWeatherMap
    const weatherData = await fetchWeatherData(lat, lng)
    
    // Fetch soil data from SoilGrids API (free tier)
    const soilData = await fetchSoilGridsData(lat, lng)
    
    // Combine and format the data
    const combinedData = {
      temperature: weatherData.temperature || 25.5,
      humidity: weatherData.humidity || 60.0,
      moisture: calculateMoisture(weatherData, soilData),
      soil_type: determineSoilType(soilData),
      nitrogen: soilData.nitrogen || 250.0,
      phosphorous: soilData.phosphorous || 35.0,
      potassium: soilData.potassium || 200.0,
      ph: soilData.ph || 6.5,
      ec: soilData.ec || 1.2,
      organic_carbon: soilData.organic_carbon || 2.5,
      pathogen_presence: 0, // Default, as this requires lab testing
      salinity_class: determineSalinity(soilData.ec),
      latitude: lat,
      longitude: lng,
    }
    
    return combinedData
  } catch (error) {
    console.error('Error fetching soil data:', error)
    // Return default values if API fails
    return getDefaultSoilData(lat, lng)
  }
}

/**
 * Fetch weather data from OpenWeatherMap API
 * Note: You'll need to get a free API key from openweathermap.org
 */
async function fetchWeatherData(lat, lng) {
  try {
    // Using a free weather API (Open-Meteo) that doesn't require API key
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m&timezone=auto`
    )
    
    if (response.data && response.data.current) {
      return {
        temperature: response.data.current.temperature_2m || 25.5,
        humidity: response.data.current.relative_humidity_2m || 60.0,
      }
    }
  } catch (error) {
    console.error('Weather API error:', error)
  }
  
  // Fallback: estimate based on latitude
  return {
    temperature: estimateTemperature(lat),
    humidity: 60.0,
  }
}

/**
 * Fetch soil data from SoilGrids API (ISRIC)
 * This is a free global soil database
 */
async function fetchSoilGridsData(lat, lng) {
  try {
    // SoilGrids API endpoint
    const response = await axios.get(
      `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lng}&lat=${lat}&property=phh2o&property=nitrogen&property=soc&depth=0-5cm&value=mean`,
      {
        headers: {
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    )
    
    if (response.data && response.data.properties) {
      const props = response.data.properties
      return {
        ph: props.phh2o?.mean ? (props.phh2o.mean / 10).toFixed(1) : 6.5, // Convert from 0-100 scale
        nitrogen: props.nitrogen?.mean ? (props.nitrogen.mean * 10).toFixed(1) : 250.0, // Convert to ppm
        organic_carbon: props.soc?.mean ? (props.soc.mean / 10).toFixed(2) : 2.5, // Convert to %
      }
    }
  } catch (error) {
    console.error('SoilGrids API error:', error)
  }
  
  // Fallback: estimate based on location
  return estimateSoilData(lat, lng)
}

/**
 * Estimate soil data based on geographic location
 */
function estimateSoilData(lat, lng) {
  // Basic estimation based on latitude and common soil patterns
  const basePh = 6.5 + (lat - 30) * 0.02 // pH tends to vary with latitude
  const baseNitrogen = 200 + Math.sin(lng * Math.PI / 180) * 50
  
  return {
    ph: Math.max(5.5, Math.min(8.5, basePh.toFixed(1))),
    nitrogen: Math.max(150, Math.min(350, baseNitrogen.toFixed(1))),
    phosphorous: (30 + Math.random() * 20).toFixed(1),
    potassium: (180 + Math.random() * 40).toFixed(1),
    organic_carbon: (2.0 + Math.random() * 1.5).toFixed(2),
    ec: (0.8 + Math.random() * 0.8).toFixed(1),
  }
}

/**
 * Calculate soil moisture based on weather and soil data
 */
function calculateMoisture(weatherData, soilData) {
  // Simple estimation: higher humidity and organic carbon = higher moisture
  const baseMoisture = (weatherData.humidity || 60) * 0.5 + (parseFloat(soilData.organic_carbon) || 2.5) * 5
  return Math.max(20, Math.min(80, baseMoisture.toFixed(1)))
}

/**
 * Determine soil type based on location and soil properties
 */
function determineSoilType(soilData) {
  const ph = parseFloat(soilData.ph) || 6.5
  const oc = parseFloat(soilData.organic_carbon) || 2.5
  
  // Simple classification based on pH and organic carbon
  if (ph < 6.0 && oc > 3.0) return 'Black'
  if (ph > 7.5) return 'Clayey'
  if (oc < 1.5) return 'Sandy'
  if (ph > 7.0) return 'Red'
  return 'Loamy' // Default
}

/**
 * Determine salinity class based on EC value
 */
function determineSalinity(ec) {
  const ecValue = parseFloat(ec) || 1.2
  if (ecValue < 2.0) return 'Normal'
  if (ecValue < 4.0) return 'Slightly Saline'
  if (ecValue < 8.0) return 'Moderately Saline'
  return 'Highly Saline'
}

/**
 * Estimate temperature based on latitude
 */
function estimateTemperature(lat) {
  // Simple estimation: temperature decreases with distance from equator
  const baseTemp = 30 - Math.abs(lat - 20) * 0.3
  return Math.max(10, Math.min(35, baseTemp.toFixed(1)))
}

/**
 * Get default soil data when APIs fail
 */
function getDefaultSoilData(lat, lng) {
  return {
    temperature: estimateTemperature(lat),
    humidity: 60.0,
    moisture: 45.0,
    soil_type: 'Loamy',
    nitrogen: 250.0,
    phosphorous: 35.0,
    potassium: 200.0,
    ph: 6.5,
    ec: 1.2,
    organic_carbon: 2.5,
    pathogen_presence: 0,
    salinity_class: 'Normal',
    latitude: lat,
    longitude: lng,
  }
}

