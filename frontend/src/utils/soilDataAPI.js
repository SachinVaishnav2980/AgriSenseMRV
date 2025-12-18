import axios from 'axios'

/**
 * Fetch soil and weather data based on coordinates
 * Generates realistic, location-specific parameters
 */
export async function fetchSoilDataFromLocation(lat, lng) {
  try {
    console.log(`Fetching soil data for: ${lat}, ${lng}`)
    
    // Fetch real weather data
    const weatherData = await fetchWeatherData(lat, lng)
    
    // Generate location-based soil parameters
    const soilData = generateLocationBasedSoilData(lat, lng, weatherData)
    
    console.log('Generated soil data:', soilData)
    return soilData
    
  } catch (error) {
    console.error('Error fetching soil data:', error)
    return generateLocationBasedSoilData(lat, lng, null)
  }
}

/**
 * Fetch real weather data from Open-Meteo (free, no API key needed)
 */
async function fetchWeatherData(lat, lng) {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,soil_temperature_0cm,soil_moisture_0_to_1cm&timezone=auto`,
      { timeout: 8000 }
    )
    
    if (response.data && response.data.current) {
      const current = response.data.current
      return {
        temperature: current.temperature_2m || estimateTemperature(lat),
        humidity: current.relative_humidity_2m || estimateHumidity(lat),
        soilTemp: current.soil_temperature_0cm,
        soilMoisture: current.soil_moisture_0_to_1cm
      }
    }
  } catch (error) {
    console.log('Weather API fallback to estimation')
  }
  
  return {
    temperature: estimateTemperature(lat),
    humidity: estimateHumidity(lat)
  }
}

/**
 * Generate realistic soil parameters based on geographic location
 * Different regions have different soil characteristics
 */
function generateLocationBasedSoilData(lat, lng, weatherData) {
  // Get climate zone
  const climateZone = getClimateZone(lat)
  
  // Base values from weather or estimation
  const temperature = weatherData?.temperature || estimateTemperature(lat)
  const humidity = weatherData?.humidity || estimateHumidity(lat)
  
  // Generate location-specific hash for consistency
  const locationHash = hashCoordinates(lat, lng)
  const seedRandom = createSeededRandom(locationHash)
  
  // Determine soil type based on region
  const soilType = determineSoilTypeByLocation(lat, lng, climateZone, seedRandom)
  
  // Generate nutrients based on climate and soil type
  const nutrients = generateNutrientsByZone(climateZone, soilType, seedRandom)
  
  // Calculate moisture based on weather and soil type
  const moisture = calculateRealisticMoisture(humidity, soilType, weatherData?.soilMoisture, seedRandom)
  
  // Generate pH based on soil type and location
  const ph = generatePhByLocation(lat, soilType, seedRandom)
  
  // Calculate EC (salinity) based on location
  const ec = generateECByLocation(lat, lng, climateZone, seedRandom)
  
  // Organic carbon varies by climate
  const organicCarbon = generateOrganicCarbonByZone(climateZone, soilType, seedRandom)
  
  return {
    temperature: parseFloat(temperature.toFixed(1)),
    humidity: parseFloat(humidity.toFixed(1)),
    moisture: parseFloat(moisture.toFixed(1)),
    soil_type: soilType,
    nitrogen: parseFloat(nutrients.nitrogen.toFixed(1)),
    phosphorous: parseFloat(nutrients.phosphorous.toFixed(1)),
    potassium: parseFloat(nutrients.potassium.toFixed(1)),
    ph: parseFloat(ph.toFixed(1)),
    ec: parseFloat(ec.toFixed(2)),
    organic_carbon: parseFloat(organicCarbon.toFixed(2)),
    pathogen_presence: determinePathogenPresence(moisture, temperature, seedRandom),
    salinity_class: determineSalinityClass(ec),
    latitude: parseFloat(lat.toFixed(4)),
    longitude: parseFloat(lng.toFixed(4))
  }
}

/**
 * Determine climate zone based on latitude
 */
function getClimateZone(lat) {
  const absLat = Math.abs(lat)
  if (absLat < 15) return 'tropical'
  if (absLat < 35) return 'subtropical'
  if (absLat < 50) return 'temperate'
  if (absLat < 66.5) return 'cold'
  return 'polar'
}

/**
 * Estimate temperature based on latitude and season
 */
function estimateTemperature(lat) {
  const absLat = Math.abs(lat)
  const month = new Date().getMonth() + 1
  
  // Base temperature decreases with latitude
  let baseTemp = 30 - (absLat * 0.4)
  
  // Seasonal variation (northern hemisphere)
  if (lat > 0) {
    if (month >= 4 && month <= 9) baseTemp += 5  // Summer
    else baseTemp -= 5  // Winter
  } else {
    if (month >= 10 || month <= 3) baseTemp += 5  // Summer
    else baseTemp -= 5  // Winter
  }
  
  // Add some variation based on longitude (continental vs coastal)
  baseTemp += Math.sin(Math.abs(lat) * 0.1) * 3
  
  return Math.max(5, Math.min(40, baseTemp))
}

/**
 * Estimate humidity based on latitude and proximity to water
 */
function estimateHumidity(lat) {
  const absLat = Math.abs(lat)
  
  // Tropical regions have higher humidity
  let baseHumidity = 70 - (absLat * 0.3)
  
  // Coastal areas typically have higher humidity
  baseHumidity += Math.sin(absLat * 0.2) * 15
  
  return Math.max(25, Math.min(90, baseHumidity))
}

/**
 * Determine soil type based on location
 */
function determineSoilTypeByLocation(lat, lng, climateZone, random) {
  const absLat = Math.abs(lat)
  const absLng = Math.abs(lng)
  
  // Location-based probabilities
  const locationFactor = (Math.sin(lat * 0.1) + Math.cos(lng * 0.1)) / 2
  
  if (climateZone === 'tropical') {
    // Tropical: more clayey and red soils
    if (locationFactor > 0.3) return 'Red'
    if (locationFactor > -0.2) return 'Clayey'
    return 'Loamy'
  } else if (climateZone === 'subtropical') {
    // Subtropical: varied, including black soils
    if (locationFactor > 0.4) return 'Black'
    if (locationFactor > 0) return 'Loamy'
    if (locationFactor > -0.3) return 'Red'
    return 'Clayey'
  } else if (climateZone === 'temperate') {
    // Temperate: mostly loamy and sandy
    if (locationFactor > 0.2) return 'Loamy'
    if (locationFactor > -0.2) return 'Sandy'
    return 'Clayey'
  } else {
    // Cold/Polar: sandy and low organic matter
    if (locationFactor > 0) return 'Sandy'
    return 'Loamy'
  }
}

/**
 * Generate nutrients based on climate zone and soil type
 */
function generateNutrientsByZone(climateZone, soilType, random) {
  let nitrogenBase = 200
  let phosphorousBase = 30
  let potassiumBase = 180
  
  // Climate adjustments
  if (climateZone === 'tropical') {
    nitrogenBase += 50
    phosphorousBase += 10
  } else if (climateZone === 'temperate') {
    nitrogenBase += 30
    phosphorousBase += 5
  } else if (climateZone === 'cold') {
    nitrogenBase -= 30
    phosphorousBase -= 5
  }
  
  // Soil type adjustments
  if (soilType === 'Black') {
    nitrogenBase += 40
    phosphorousBase += 8
    potassiumBase += 30
  } else if (soilType === 'Red') {
    nitrogenBase -= 20
    phosphorousBase -= 5
    potassiumBase += 15
  } else if (soilType === 'Sandy') {
    nitrogenBase -= 40
    phosphorousBase -= 10
    potassiumBase -= 30
  } else if (soilType === 'Clayey') {
    potassiumBase += 20
  }
  
  // Add variation
  const variation = random() * 0.3 + 0.85  // 85-115% of base
  
  return {
    nitrogen: Math.max(100, Math.min(400, nitrogenBase * variation)),
    phosphorous: Math.max(15, Math.min(60, phosphorousBase * variation)),
    potassium: Math.max(100, Math.min(300, potassiumBase * variation))
  }
}

/**
 * Calculate realistic moisture
 */
function calculateRealisticMoisture(humidity, soilType, apiMoisture, random) {
  let moistureBase = humidity * 0.6
  
  // Soil type affects water retention
  if (soilType === 'Clayey') moistureBase += 10
  else if (soilType === 'Sandy') moistureBase -= 15
  else if (soilType === 'Black') moistureBase += 5
  else if (soilType === 'Loamy') moistureBase += 2
  
  // Use API data if available
  if (apiMoisture) {
    moistureBase = (moistureBase + apiMoisture * 100) / 2
  }
  
  // Add slight variation
  moistureBase += (random() - 0.5) * 10
  
  return Math.max(20, Math.min(80, moistureBase))
}

/**
 * Generate pH based on location and soil type
 */
function generatePhByLocation(lat, soilType, random) {
  let phBase = 6.5
  
  // Latitude effect (tropical = more acidic)
  const absLat = Math.abs(lat)
  if (absLat < 23.5) phBase -= 0.8  // Tropical
  else if (absLat > 50) phBase += 0.5  // Cold regions
  
  // Soil type adjustments
  if (soilType === 'Black') phBase += 0.5
  else if (soilType === 'Red') phBase -= 0.4
  else if (soilType === 'Sandy') phBase -= 0.3
  else if (soilType === 'Clayey') phBase += 0.3
  
  // Add variation
  phBase += (random() - 0.5) * 0.6
  
  return Math.max(5.0, Math.min(8.5, phBase))
}

/**
 * Generate EC (salinity) based on location
 */
function generateECByLocation(lat, lng, climateZone, random) {
  let ecBase = 1.0
  
  // Arid regions have higher salinity
  if (climateZone === 'subtropical') ecBase += 0.5
  else if (climateZone === 'tropical') ecBase -= 0.3
  
  // Coastal proximity (using longitude variation as proxy)
  const coastalEffect = Math.abs(Math.sin(lng * 0.05)) * 0.4
  ecBase += coastalEffect
  
  // Add variation
  ecBase += random() * 0.8
  
  return Math.max(0.5, Math.min(4.0, ecBase))
}

/**
 * Generate organic carbon based on climate zone
 */
function generateOrganicCarbonByZone(climateZone, soilType, random) {
  let ocBase = 2.0
  
  // Climate effects
  if (climateZone === 'tropical') ocBase += 1.0
  else if (climateZone === 'temperate') ocBase += 0.5
  else if (climateZone === 'cold') ocBase -= 0.5
  
  // Soil type effects
  if (soilType === 'Black') ocBase += 1.5
  else if (soilType === 'Sandy') ocBase -= 0.8
  else if (soilType === 'Clayey') ocBase += 0.3
  
  // Add variation
  ocBase += (random() - 0.5) * 1.0
  
  return Math.max(0.5, Math.min(5.0, ocBase))
}

/**
 * Determine pathogen presence based on conditions
 */
function determinePathogenPresence(moisture, temperature, random) {
  // High moisture + warm temperature = higher pathogen risk
  if (moisture > 65 && temperature > 25 && random() > 0.6) return 1
  if (moisture > 70 && random() > 0.7) return 1
  if (temperature > 30 && moisture > 60 && random() > 0.65) return 1
  return 0
}

/**
 * Determine salinity class
 */
function determineSalinityClass(ec) {
  if (ec < 2.0) return 'Normal'
  if (ec < 4.0) return 'Slightly Saline'
  if (ec < 8.0) return 'Moderately Saline'
  return 'Highly Saline'
}

/**
 * Create a seeded random function for consistency
 */
function createSeededRandom(seed) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}

/**
 * Hash coordinates to create a consistent seed
 */
function hashCoordinates(lat, lng) {
  const str = `${lat.toFixed(4)}_${lng.toFixed(4)}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}