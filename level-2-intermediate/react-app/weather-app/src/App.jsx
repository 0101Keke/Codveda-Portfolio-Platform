import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import { ClipLoader } from "react-spinners";
import "./index.css";

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [recent, setRecent] = useState(() =>
    JSON.parse(localStorage.getItem("recent")) || []
  );

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch current weather
  useEffect(() => {
    async function fetchWeatherByCity(city) {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        setWeather(data);

        setSelectedCity(data.name); // Update selected city to the one returned by API

        // Save recent searches
        const updatedRecent = [data.name, ...recent.filter(c => c !== data.name)].slice(0, 5);
        setRecent(updatedRecent);
        localStorage.setItem("recent", JSON.stringify(updatedRecent));

        // Fetch 5-day forecast
        fetchForecast(city);
      } catch (err) {
        setError(err.message);
        setWeather(null);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    }

    if (selectedCity) fetchWeatherByCity(selectedCity);
  }, [selectedCity]);

  // Fetch 5-day forecast
  const fetchForecast = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) throw new Error("Forecast not found");
      const data = await response.json();

      // Pick one forecast per day (every 8 items)
      setForecast(data.list.filter((_, i) => i % 8 === 0));
    } catch (err) {
      console.error(err);
      setForecast([]);
    }
  };

  // Auto-detect user location on initial load
  useEffect(() => {
    if (!selectedCity && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            setLoading(true);
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
            );
            const data = await response.json();

            setWeather(data);
            setSelectedCity(data.name);

            const updatedRecent = [data.name, ...recent.filter(c => c !== data.name)].slice(0, 5);
            setRecent(updatedRecent);
            localStorage.setItem("recent", JSON.stringify(updatedRecent));

            fetchForecast(data.name);
          } catch (err) {
            setError("Could not fetch location weather");
          } finally {
            setLoading(false);
          }
        },
        (err) => console.error(err)
      );
    }
  }, []);

  // Dynamic background based on temperature
  const getBackground = (temp) => {
    if (temp <= 0) return "linear-gradient(135deg, #74ebd5, #ACB6E5)";
    if (temp <= 15) return "linear-gradient(135deg, #89f7fe, #66a6ff)";
    if (temp <= 25) return "linear-gradient(135deg, #fddb92, #d1fdff)";
    return "linear-gradient(135deg, #ff9966, #ff5e62)";
  };

  const backgroundStyle = weather
    ? { background: getBackground(weather.main.temp), transition: "background 0.5s ease" }
    : {};
     
  return (
    <div
      className={`app ${darkMode ? "" : "light"}`}
      style={backgroundStyle}
    >
      <h1>Weather Dashboard</h1>

      {/* Dark/Light Mode Toggle */}
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* SearchBar */}
      <SearchBar onSearch={setSelectedCity} />

      {/* Recent Searches */}
      <div className="recent-searches">
        {recent.map((city) => (
          <button key={city} onClick={() => setSelectedCity(city)}>
            {city}
          </button>
        ))}
      </div>

      {/* Loading / Error */}
      {loading && <ClipLoader color="#ffffff" size={50} />}
      {error && <p className="error">{error}</p>}

      {/* Weather & Forecast */}
      {weather && <WeatherCard weather={weather} darkMode={darkMode} />}
      {forecast.length > 0 && <ForecastCard forecast={forecast} darkMode={darkMode} />}
    </div>
  );
}

export default App;
