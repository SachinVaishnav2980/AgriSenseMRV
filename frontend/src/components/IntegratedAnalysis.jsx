import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Send, CheckCircle, AlertTriangle, Activity, MapPin } from 'lucide-react'
import axios from 'axios'
import MapComponent from './MapComponent'
import { fetchSoilDataFromLocation } from '../utils/soilDataAPI'

export default function IntegratedAnalysis() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [soilData, setSoilData] = useState(null)
  const [loadingSoilData, setLoadingSoilData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please upload a crop image')
      return
    }
    if (!soilData) {
      setError('Please select a location on the map')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('image', file)
    formData.append('soilData', JSON.stringify(soilData))

    try {
      const response = await axios.post('http://localhost:5000/api/predict/integrated', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Integrated Analysis</h2>
        <p className="text-gray-600">Combine crop disease detection with soil health analysis</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Crop Image</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-48 mx-auto rounded-lg shadow-md"
              />
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-gray-600">Click to upload crop image</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-green-500" />
              <span>Select Location on Map</span>
            </h3>
            <p className="text-sm text-gray-600">
              Click on the map to automatically fetch soil parameters for that location
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
            className="card bg-gradient-to-br from-blue-50 to-white"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Extracted Soil Parameters</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            </div>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading || !file || !soilData}
          className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Activity className="w-5 h-5" />
          <span>{loading ? 'Analyzing...' : 'Run Integrated Analysis'}</span>
        </button>
      </form>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-red-50 border-red-200"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Integrated Insights */}
          {result.integrated_insights && result.integrated_insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Activity className="w-6 h-6" />
                <span>Integrated Insights</span>
              </h3>
              <ul className="space-y-2">
                {result.integrated_insights.map((insight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-2"
                  >
                    <span>•</span>
                    <span>{insight}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Crop Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Crop Analysis</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Disease</p>
                  <p className="text-lg font-semibold">{result.crop_analysis.disease}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-lg font-semibold">{result.crop_analysis.confidence_percentage || `${(result.crop_analysis.confidence * 100).toFixed(2)}%`}</p>
                </div>
                {result.crop_analysis.recommendations && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Recommendations</p>
                    <ul className="space-y-1 text-sm">
                      {result.crop_analysis.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-green-500">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Soil Analysis */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Soil Analysis</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-green-600">{result.soil_analysis.health_score}%</p>
                  <p className="text-sm text-gray-600">Class: {result.soil_analysis.health_class}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disease Risk</p>
                  <p className="text-lg font-semibold">{result.soil_analysis.disease_risk}</p>
                </div>
                {result.soil_analysis.recommendations && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Recommendations</p>
                    <ul className="space-y-1 text-sm">
                      {result.soil_analysis.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-blue-500">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}

