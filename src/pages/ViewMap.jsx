import React, { useState, useEffect } from 'react';
import { MapIcon } from 'lucide-react';

const PotholeMap = () => {
  const [selectedPothole, setSelectedPothole] = useState(null);
  const [map, setMap] = useState(null);
  
  // Mumbai coordinates
  const MUMBAI_CENTER = [19.0760, 72.8777];
  
  // Sample data - replace with real data from your API
  const potholes = [
    { id: 1, lat: 19.0760, lng: 72.8777, severity: 4, status: 'pending' },
    { id: 2, lat: 19.0359, lng: 72.8734, severity: 3, status: 'verified' }
  ];

  useEffect(() => {
    // We need to dynamically import Leaflet since it requires window object
    const initializeMap = async () => {
      const L = await import('leaflet');
      
      if (!map) {
        // Create map instance
        const mapInstance = L.map('map').setView(MUMBAI_CENTER, 12);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);
        
        // Add markers for each pothole
        potholes.forEach(pothole => {
          const markerColor = pothole.severity > 3 ? 'red' : 
                            pothole.severity > 1 ? 'yellow' : 'green';
          
          const marker = L.circleMarker([pothole.lat, pothole.lng], {
            radius: 8,
            fillColor: markerColor,
            color: '#fff',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(mapInstance);
          
          marker.bindPopup(`
            <b>Pothole #${pothole.id}</b><br>
            Severity: ${pothole.severity}<br>
            Status: ${pothole.status}
          `);
        });
        
        setMap(mapInstance);
      }
    };

    initializeMap();
    
    // Cleanup
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const handleMyLocation = () => {
    if (map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        map.setView([position.coords.latitude, position.coords.longitude], 15);
      });
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
      <div className="p-4 flex flex-row items-center justify-between border-b">
        <h2 className="text-xl font-bold">Mumbai Pothole Tracker</h2>
        <div className="flex items-center space-x-2">
          <MapIcon className="w-6 h-6" />
          <span className="text-sm text-gray-500">
            {potholes.length} Reports
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-gray-100 rounded-lg p-4 h-96 relative">
          <div id="map" className="absolute inset-0 rounded-lg" />
          
          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-[400]">
            <button className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50">
              Report New
            </button>
            <button 
              className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50"
              onClick={handleMyLocation}
            >
              My Location
            </button>
          </div>
          
          {/* Legend */}
          <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg z-[400]">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span>High Severity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <span>Medium Severity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span>Low Severity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotholeMap;