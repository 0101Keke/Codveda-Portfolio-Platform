import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedCity) return;

    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);
        
        console.log(import.meta.env.VITE_WEATHER_API_KEY);
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error("City not found");
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [selectedCity]);

  return (
    <div>
      <h1>Weather Dashboard</h1>

      <SearchBar onSearch={setSelectedCity} />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
