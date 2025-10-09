require('dotenv').config(); // Reads your .env file
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/marinedata', async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    const lat = 12.91;
    const lon = 74.85;
    const weatherApiUrl = `https://api.weatherapi.com/v1/marine.json?key=${apiKey}&q=${lat},${lon}&days=2`;

    const response = await axios.get(weatherApiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from WeatherAPI:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});