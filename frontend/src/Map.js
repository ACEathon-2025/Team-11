import React from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Sample data for fishing hotspots
const hotspots = [
    { lat: 12.95, lon: 74.80, level: 'High', color: 'red' },
    { lat: 12.88, lon: 74.78, level: 'Medium', color: 'orange' },
    { lat: 13.00, lon: 74.82, level: 'Low', color: 'yellow' },
];

function Map() {
  const position = [12.9141, 74.8560]; // Mangaluru coordinates

  return (
    <MapContainer center={position} zoom={10} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {hotspots.map(spot => (
        <Circle 
            key={`${spot.lat}-${spot.lon}`}
            center={[spot.lat, spot.lon]} 
            pathOptions={{ color: spot.color, fillColor: spot.color }}
            radius={2000}
        >
            <Popup>
                Fish Activity: <strong>{spot.level}</strong>
            </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}

export default Map;