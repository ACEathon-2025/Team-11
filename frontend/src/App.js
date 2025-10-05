import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [marineData, setMarineData] = useState(null);

  useEffect(() => {
    // Fetch data from your backend API
    fetch('http://localhost:5000/api/marinedata')
      .then(response => response.json())
      .then(data => setMarineData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // The empty array means this effect runs once when the component mounts

  if (!marineData) {
    return <div>Loading data...</div>;
  }

  return (
  <div className="App">
    <header className="App-header">
      <h1>Marine Dash 🌊</h1>
      <h2>Hourly Wave Height Forecast (meters)</h2>
    </header>
    <div className="data-container">
      {marineData.hourly.time.map((time, index) => (
        <div key={time} className="data-item">
          <span className="time">{new Date(time).toLocaleString()}</span>
          <span className="value">{marineData.hourly.wave_height[index]} m</span>
        </div>
      ))}
    </div>
  </div>
);
}

export default App;