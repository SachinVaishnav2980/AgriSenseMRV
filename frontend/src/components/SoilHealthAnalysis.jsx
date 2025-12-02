import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, TrendingUp, AlertTriangle, CheckCircle, MapPin } from 'lucide-react'
import axios from 'axios'
import MapComponent from './MapComponent'
import { fetchSoilDataFromLocation } from '../utils/soilDataAPI'

export default function SoilHealthAnalysis() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [soilData, setSoilData] = useState(null)
  const [loadingSoilData, setLoadingSoilData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location)
    setLoadingSoilData(true)
    setError(null)
    setResult(null)

    try {
      const data = await fetchSoilDataFromLocation(location.lat, location.lng)
      setSoilData(data)
    } catch (err) {
      setError('Failed to fetch soil data. Please try again.')
      console.error(err)
    } finally {
      setLoadingSoilData(false)
    }
  }

  const handleSubmit = async () => {
    if (!soilData) {
      setError('Please select a location on the map first')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post('http://localhost:5000/api/predict/soil-health', soilData)
      if (response.data.status === 'success') {
        setResult(response.data.data)
      } else {
        setError(response.data.message || 'Analysis failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const getHealthColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskColor = (risk) => {
    if (risk === 'Low') return 'text-green-600'
    if (risk === 'Medium') return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Soil Health Analysis</h2>
        <p className="text-gray-600">Enter soil parameters to get health score and disease risk assessment</p>
      </motion.div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-green-500" />
            <span>Select Location on Map</span>
          </h3>
          <p className="text-sm text-gray-600">
            Click anywhere on the map to automatically fetch soil parameters for that location
          </p>
        </div>
        <MapComponent
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          loading={loadingSoilData}
          soilData={soilData}
        />
      </motion.div>

      {/* Soil Data Display */}
      {soilData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-green-50 to-white"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Extracted Soil Parameters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Temperature</p>
              <p className="font-semibold">{soilData.temperature}°C</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Humidity</p>
              <p className="font-semibold">{soilData.humidity}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Moisture</p>
              <p className="font-semibold">{soilData.moisture}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Soil Type</p>
              <p className="font-semibold">{soilData.soil_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Nitrogen</p>
              <p className="font-semibold">{soilData.nitrogen} ppm</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phosphorous</p>
              <p className="font-semibold">{soilData.phosphorous} ppm</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Potassium</p>
              <p className="font-semibold">{soilData.potassium} ppm</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">pH</p>
              <p className="font-semibold">{soilData.ph}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">EC</p>
              <p className="font-semibold">{soilData.ec} dS/m</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Organic Carbon</p>
              <p className="font-semibold">{soilData.organic_carbon}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Salinity</p>
              <p className="font-semibold">{soilData.salinity_class}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Coordinates</p>
              <p className="font-semibold text-xs">{soilData.latitude.toFixed(4)}, {soilData.longitude.toFixed(4)}</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || loadingSoilData}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            <span>{loading ? 'Analyzing...' : 'Analyze Soil Health'}</span>
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Results */}
        {soilData && (
        <div className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card bg-red-50 border-red-200"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {result && (
            <>
              {/* Soil Health Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-gradient-to-br from-green-50 to-white"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Soil Health Score</h3>
                    <p className={`text-3xl font-bold ${getHealthColor(result.soil_health.score)}`}>
                      {result.soil_health.score}%
                    </p>
                    <p className="text-sm text-gray-600">Class: {result.soil_health.class}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.soil_health.score}%` }}
                    transition={{ duration: 1 }}
                    className={`h-4 rounded-full ${
                      result.soil_health.score >= 70
                        ? 'bg-green-500'
                        : result.soil_health.score >= 40
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </motion.div>

              {/* Disease Risk */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Disease Risk</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Risk Level</span>
                    <span className={`font-bold ${getRiskColor(result.disease_risk.class)}`}>
                      {result.disease_risk.class}
                    </span>
                  </div>
                  {result.disease_risk.probabilities && (
                    <div className="space-y-2">
                      {Object.entries(result.disease_risk.probabilities).map(([risk, prob]) => (
                        <div key={risk}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{risk}</span>
                            <span className="font-medium">{(prob * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${prob * 100}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className={`h-2 rounded-full ${
                                risk === 'Low'
                                  ? 'bg-green-500'
                                  : risk === 'Medium'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Recommendations</span>
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start space-x-2 text-gray-700"
                      >
                        <span className="text-green-500 mt-1">•</span>
                        <span>{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </>
          )}
        </div>
        )}
      </div>
    </div>
  )
}

