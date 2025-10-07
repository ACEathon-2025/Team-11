import React from 'react';
import './CurrentConditions.css';

function CurrentConditions({ data }) {
  if (!data) {
    return <div className="current-conditions"><h3>Loading Current Conditions...</h3></div>;
  }

  return (
    <div className="current-conditions">
      <h3>Current Conditions</h3>
      <div className="condition-item">
        <strong>Time:</strong>
        <span>{data.time}</span>
      </div>
      <div className="condition-item">
        <strong>Wave Height:</strong>
        <span>{data.wave_height} m</span>
      </div>
      <div className="condition-item">
        <strong>Wind Speed:</strong>
        <span>{data.wind_speed} km/h</span>
      </div>
    </div>
  );
}

export default CurrentConditions;