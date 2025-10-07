import React from 'react';
import './DailyForecast.css';

function DailyForecast({ day }) {
  return (
    <div className="daily-card">
      <h4>{new Date(day.date).toLocaleDateString([], { weekday: 'short', day: 'numeric' })}</h4>
      <img src={day.day.condition.icon} alt={day.day.condition.text} />
      <div className="temp">
        <strong>{day.day.maxtemp_c}°</strong> / {day.day.mintemp_c}°
      </div>
    </div>
  );
}

export default DailyForecast;