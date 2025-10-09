import React, { useState, useEffect } from 'react'; // <-- FIXED LINE 1
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CurrentConditions from './CurrentConditions';
import './App.css';
import DailyForecast from './DailyForecast.js';
import Spinner from './Spinner.js';
import Map from './Map.js';

// Mock data in case the API fails during the demo. You can comment this out.
const mockData = [
  { time: 'Oct 07, 08:00 PM', wave_height: 0.9, wind_speed: 12.1 },
  { time: 'Oct 07, 09:00 PM', wave_height: 0.88, wind_speed: 11.8 },
];

function App() {
  const [marineData, setMarineData] = useState(null); // <-- FIXED LINE 12 (Removed React.)
  const [dailyData, setDailyData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [view, setView] = React.useState('forecast');

  React.useEffect(() => {
  fetch('http://localhost:5000/api/marinedata')
    .then(response => {
      // This new check handles errors from the server (like 404 or 500)
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.forecast && data.forecast.forecastday) {
        // Process hourly data
        const hourlyData = [];
        data.forecast.forecastday.forEach(day => {
          day.hour.forEach(hour => {
            hourlyData.push({
              time: new Date(hour.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              wave_height: parseFloat(hour.sig_ht_mt) || 0,
              wind_speed: parseFloat(hour.wind_kph) || 0,
              condition_text: hour.condition.text,
              condition_icon: hour.condition.icon
            });
          });
        });
        setMarineData(hourlyData);

        // Process daily data
        setDailyData(data.forecast.forecastday);

      } else {
        // This handles cases where the API sends back unexpected data
        console.error("Received unexpected data format from API:", data);
        throw new Error("Data from the weather service was not in the expected format.");
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      setError(error.message); // This sets the error state to display it to the user
    });
}, []);

  if (error) {
  return <div className="error-message">Error: {error}</div>;
}
  if (!marineData) {
  return <Spinner />;
}

  return (
  <div className="App">
    <header className="App-header">
        <h1>Marine Dash 🌊</h1>
    </header>
    
    <CurrentConditions data={marineData ? marineData[0] : null} />

    <div className="daily-container">
        {dailyData && dailyData.map(day => (
            <DailyForecast key={day.date_epoch} day={day} />
        ))}
    </div>

    <div className="view-toggle">
        <button onClick={() => setView('forecast')} className={view === 'forecast' ? 'active' : ''}>Forecast</button>
        <button onClick={() => setView('map')} className={view === 'map' ? 'active' : ''}>Fishing Zones</button>
    </div>

    {/* This is the conditional block that shows either the chart or the map */}
    {view === 'forecast' ? (
        <div className="chart-container">
            <h2>Hourly Forecast</h2>
            {/* This is the chart code that was missing */}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={marineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                    <XAxis dataKey="time" stroke="#fff" />
                    <YAxis yAxisId="left" stroke="#61dafb" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip contentStyle={{ backgroundColor: '#282c34', border: '1px solid #555' }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="wave_height" name="Wave Height (m)" stroke="#61dafb" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="wind_speed" name="Wind Speed (km/h)" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    ) : (
        <div className="map-container">
            <h2>Optimal Fishing Zones (Proof of Concept)</h2>
            <Map />
        </div>
    )}
  </div>
);
}

export default App;