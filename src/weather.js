import React, { useState, useEffect, useRef } from "react";

import WeatherComponent from './weathercomponent';
import './App.css';

function Weather() {
  const weatherApi = {
    key: process.env.REACT_APP_OPEN_WEATHER_KEY,
    base: 'https://api.openweathermap.org/data/2.5',
  };


  const [weatherData, setWeatherData] = useState({});
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState({});
  const [hourlyForecast, setHourlyForecast] = useState({});
  const [airPollution, setAirPollution] = useState({});
  const [componentInstances, setComponentInstances] = useState([]);
  const [weatherIcon, setWeatherIcon] = useState("");




  const getWeather = (event) => {
    if (event.key === "Enter") {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApi.key}&units=imperial`)
        .then(response => response.json())
        .then(data => {
          setWeatherData(data);
          setCity("");
  
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${weatherApi.key}&units=imperial`)
          .then(response => response.json())
          .then(forecastData => {
            setForecastData(forecastData);

        // fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${weatherApi.key}`)
        //     .then(response => response.json())
        //     .then(airPollution => {
        //       setAirPollution(airPollution);
            
            
  
              // Create a new Weather component and add it to the instances
              const newWeatherComponent = (
                <WeatherComponent
                  key={componentInstances.length} // Make sure to provide a unique key
                  city={data.name}
                  country={data.sys.country}
                  temperature={Math.round(data.main.temp)}
                  conditions={data.weather[0].description}
                  wind={data.wind.speed}
                  winddeg={data.wind.deg}
                  pressure={data.main.pressure}
                  humidity={data.main.humidity}
                  sunrise={data.sys.sunrise}
                  sunset={data.sys.sunset}

                  weathericon={data.weather[0].icon}
                  onDelete={() => handleDelete(componentInstances.length)}
                  lon={data.coord.lon}
                  lat={data.coord.lat}
                  forecastDataList={forecastData}
                />
              );
  
              setComponentInstances(prevInstances => [...prevInstances, newWeatherComponent]);
            });
            });
        // });
    }
  };
  

  const handleDelete = (index) => {
    const updatedInstances = [...componentInstances];
    updatedInstances.splice(index, 1);
    setComponentInstances(updatedInstances);
  }

  return (
    <div className="container">
      <div className="App">
        <input
          className="input"
          placeholder="Enter Location"
          onChange={(e) => setCity(e.target.value)}
          value={city}
          onKeyDown={getWeather}
        />

        {typeof weatherData.main === 'undefined' && (
          <div>
            <p>Welcome to WeatherApp. Enter a city to get started</p>
          </div>
        )}

        {componentInstances.map((component, index) => (
          React.cloneElement(component, { onDelete: () => handleDelete(index) })
        ))}
      </div>
    </div>

  );
}

export default Weather;
