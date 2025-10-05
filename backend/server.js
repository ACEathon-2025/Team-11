const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;
app.use(cors());
app.get('/api/marinedata', async (req, res) => {
  try {
    const marineApiUrl = 'https://marine-api.open-meteo.com/v1/marine?latitude=12.91&longitude=74.85&hourly=wave_height';
    const response = await axios.get(marineApiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from Open-Meteo:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});