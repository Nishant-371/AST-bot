const axios = require("axios");

async function fetchWeatherData(city) {
  const apiKey = "766b57f7b12447ddbb4163016240501";
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return null;
  }
}

module.exports = fetchWeatherData;
