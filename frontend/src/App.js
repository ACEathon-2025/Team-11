import React, { useState, useEffect } from 'react'; // <-- FIXED LINE 1
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CurrentConditions from './CurrentConditions';
import './App.css';
import DailyForecast from './DailyForecast.js';

// Mock data in case the API fails during the demo. You can comment this out.
const mockData = [
  { time: 'Oct 07, 08:00 PM', wave_height: 0.9, wind_speed: 12.1 },
  { time: 'Oct 07, 09:00 PM', wave_height: 0.88, wind_speed: 11.8 },
];

function App() {
  const [marineData, setMarineData] = useState(null); // <-- FIXED LINE 12 (Removed React.)
  const [dailyData, setDailyData] = React.useState(null);

  useEffect(() => { // <-- FIXED LINE 14 (Removed React.)
    fetch('http://localhost:5000/api/marinedata')
      .then(response => response.json())
      .then(data => {
        console.log("RAW API DATA RECEIVED:", data);
        if (data && data.forecast && data.forecast.forecastday) {
          const formattedData = [];
          data.forecast.forecastday.forEach(day => {
            day.hour.forEach(hour => {
              formattedData.push({
                time: new Date(hour.time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                wave_height: parseFloat(hour.sig_ht_mt) || 0,      // Corrected from wave_m
                wind_speed: hour.wind_kph || 0,       // Corrected from wind_kph
          });
      });
});
setMarineData(formattedData);
setDailyData(data.forecast.forecastday);
        } else {
          console.error("Received unexpected data format from API:", data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Fallback to mock data if there's an error
        setMarineData(mockData);
      });
  }, []);

  if (!marineData) {
    return <div>Loading data...</div>;
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

        <div className="chart-container">
            <h2>Forecast</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={marineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="time" stroke="#fff" />

                {/* Y-Axis for Wave Height (Left) */}
                <YAxis yAxisId="left" stroke="#61dafb" />

                {/* Y-Axis for Wind Speed (Right) */}
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />

                <Tooltip contentStyle={{ backgroundColor: '#282c34', border: '1px solid #555' }} />
                <Legend />

                {/* Wave Height Line (uses the left axis) */}
                <Line yAxisId="left" type="monotone" dataKey="wave_height" name="Wave Height (m)" stroke="#61dafb" activeDot={{ r: 8 }} />

                {/* Wind Speed Line (uses the right axis) */}
                <Line yAxisId="right" type="monotone" dataKey="wind_speed" name="Wind Speed (km/h)" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}

export default App;