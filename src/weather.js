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
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [hourlyForecast, setHourlyForecast] = useState({});
  const [airPollution, setAirPollution] = useState({});
  const [componentInstances, setComponentInstances] = useState([]);
  const [weatherIcon, setWeatherIcon] = useState("");

  useEffect(() => {
    if (isDuplicate) {
      setTimeout(() => {
        setIsDuplicate(false);
      }, 3000); // Clear the duplicate message after 3 seconds
    }
  }, [isDuplicate]);


  const getWeather = (event) => {

    if (event.key === "Enter") {

      setIsDuplicate(false);

      if (componentInstances.some(instance => instance.props.city.toLowerCase() === city.toLowerCase())) { /*checks if city has already been added */
        setIsDuplicate(true);
        console.log(`City "${city}" is already added.`);
        return;
      } else {
        setIsDuplicate(false);
      }


      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApi.key}&units=imperial`)
        .then(response => response.json())
        .then(data => {
          setWeatherData(data);
          setCity("");

          fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${weatherApi.key}&units=imperial`)
            .then(response => response.json())
            .then(forecastData => {
              setForecastData(forecastData);

              fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${weatherApi.key}&units=imperial`)
                .then(response => response.json())
                .then(airPollution => {
                  setAirPollution(airPollution);



                  // Create a new Weather component and add it to the instances
                  const newWeatherComponent = (
                    <WeatherComponent
                      key={componentInstances.length} // Make sure to provide a unique key
                      city={data.name}
                      country={data.sys.country}
                      temperature={Math.round(data.main.temp)}
                      conditions={data.weather[0].description}
                      windspeed={Math.round(data.wind.speed)}
                      winddeg={data.wind.deg}
                      pressure={data.main.pressure}
                      humidity={data.main.humidity}
                      feelslike={data.main.feels_like}
                      timezone={data.timezone}
                      sunrise={data.sys.sunrise}
                      sunset={data.sys.sunset}
                      airPollution={airPollution.list[0].main.aqi}
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
        });
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

        {isDuplicate && (
          <div>
            <p className="duplicateCity">Duplicate City</p>
          </div>
        )}

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
