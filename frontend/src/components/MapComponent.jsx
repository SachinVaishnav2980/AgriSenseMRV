import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Loader } from 'lucide-react'
import axios from 'axios'

// Fix for default marker icon
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function LocationMarker({ onLocationSelect, selectedLocation, loading }) {
  const [position, setPosition] = useState(null)

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setPosition([lat, lng])
      map.setView([lat, lng], 13)
      onLocationSelect({ lat, lng })
    },
  })

  useEffect(() => {
    // Get user's current location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setPosition([latitude, longitude])
          map.setView([latitude, longitude], 10)
        },
        () => {
          // Default to a central location if geolocation fails
          setPosition([28.7041, 77.1025]) // Default to Delhi, India
          map.setView([28.7041, 77.1025], 5)
        }
      )
    } else {
      setPosition([28.7041, 77.1025])
      map.setView([28.7041, 77.1025], 5)
    }
  }, [map])

  useEffect(() => {
    if (selectedLocation) {
      setPosition([selectedLocation.lat, selectedLocation.lng])
      map.setView([selectedLocation.lat, selectedLocation.lng], 13)
    }
  }, [selectedLocation, map])

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        {loading ? (
          <div className="flex items-center space-x-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Loading soil data...</span>
          </div>
        ) : (
          <div>
            <strong>Selected Location</strong>
            <br />
            Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
          </div>
        )}
      </Popup>
    </Marker>
  )
}

export default function MapComponent({ onLocationSelect, selectedLocation, loading: externalLoading, soilData }) {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg border-2 border-gray-200 relative">
      <MapContainer
        center={[28.7041, 77.1025]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          onLocationSelect={onLocationSelect} 
          selectedLocation={selectedLocation}
          loading={externalLoading}
        />
      </MapContainer>
      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000] flex items-center space-x-2">
        <MapPin className="w-5 h-5 text-green-500" />
        <div className="text-sm font-semibold text-gray-700">
          {externalLoading ? (
            <span>Loading soil data...</span>
          ) : selectedLocation ? (
            <div className="space-y-0.5 text-xs">
              <div>Lat: {selectedLocation.lat.toFixed(4)}</div>
              <div>Lng: {selectedLocation.lng.toFixed(4)}</div>
              {soilData && (
                <div className="mt-1 text-xs text-gray-600">
                  <div>Temp: {soilData.temperature}°C • Humidity: {soilData.humidity}%</div>
                  <div>Soil: {soilData.soil_type}</div>
                </div>
              )}
            </div>
          ) : (
            <span>Click on map to select location</span>
          )}
        </div>
      </div>
    </div>
  )
}

