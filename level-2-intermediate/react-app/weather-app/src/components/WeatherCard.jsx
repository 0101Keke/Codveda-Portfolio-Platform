import React from "react";

function WeatherCard({ weather, darkMode }) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className={`weather-card ${darkMode ? "" : "light"}`}>
      <h2>{weather.name}</h2>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p className="temp">{weather.main.temp}°C</p>
      <p>{weather.weather[0].description}</p>
      <p>Humidity: {weather.main.humidity}%</p>
    </div>
  );
}

export default WeatherCard;
