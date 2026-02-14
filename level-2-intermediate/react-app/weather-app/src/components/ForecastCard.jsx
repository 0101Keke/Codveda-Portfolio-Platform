import React from "react";

function ForecastCard({ forecast, darkMode }) {
  return (
    <div className={`forecast-card ${darkMode ? "" : "light"}`}>
      {forecast.map((day, index) => (
        <div key={index} className={`forecast-day ${darkMode ? "" : "light"}`}>
          <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
          <img
            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
            alt={day.weather[0].description}
          />
          <p>{day.main.temp}°C</p>
        </div>
      ))}
    </div>
  );
}

export default ForecastCard;
