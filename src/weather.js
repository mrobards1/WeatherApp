import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faMinimize} from '@fortawesome/free-solid-svg-icons';
import WeatherComponent from './weathercomponent';
import './App.css';

function Weather() {
  const weatherApi = {
    key: process.env.REACT_APP_OPEN_WEATHER_KEY,
    base: 'https://api.openweathermap.org/data/2.5',
  };


  const [, setWeatherData] = useState({});
  const [city, setCity] = useState("");
  const [, setForecastData] = useState({});
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isCityError, setIsCityError] = useState(false);
  const [, setAirPollution] = useState({});
  const [componentInstances, setComponentInstances] = useState([]);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  useEffect(() => {
    if (isDuplicate) {
      setTimeout(() => {
        setIsDuplicate(false);
      }, 3000); // Clear the duplicate message after 3 seconds
    }

    if (isCityError) {
      setTimeout(() => {
        setIsCityError(false);
      }, 3000); // Clear the error message after 3 seconds
    }
  }, [isDuplicate, isCityError]);


  const getWeather = (event) => {
    if (event.key === "Enter") {
      setIsDuplicate(false);
      setIsCityError(false);

      const trimmedCity = city.trim().toLowerCase(); // Trim spaces and convert to lowercase

      if (componentInstances.some((instance) => instance.props.city.toLowerCase() === trimmedCity)) {
        setIsDuplicate(true);
        console.log(`City "${city}" is already added.`);
        return;
      } else {
        setIsDuplicate(false);
      }

      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApi.key}&units=imperial`)
        .then((response) => {
          if (!response.ok) {
            // Check for errors and throw an error if the response is not successful
            throw new Error(`City not found: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setWeatherData(data);
          setCity("");

          fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={part}&appid=${weatherApi.key}&units=imperial`)
            .then((response) => response.json())
            .then((forecastData) => {
              setForecastData(forecastData);
              fetch(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${weatherApi.key}&units=imperial`
              )
                .then((response) => response.json())
                .then((airPollution) => {
                  setAirPollution(airPollution);

                  const newWeatherComponent = (
                    <WeatherComponent
                      key={componentInstances.length}
                      city={data.name}
                      country={data.sys.country}
                      temperature={Math.round(data.main.temp)}
                      conditions={data.weather[0].description}
                      windspeed={Math.round(data.wind.speed)}
                      winddeg={data.wind.deg}
                      pressure={data.main.pressure}
                      humidity={data.main.humidity}
                      feelslike={data.main.feels_like}
                      sunrise={data.sys.sunrise}
                      sunset={data.sys.sunset}
                      timezone={forecastData.timezone}
                      airPollution={airPollution.list[0].main.aqi}
                      onDelete={() => handleDelete(componentInstances.length)}
                      lon={data.coord.lon}
                      lat={data.coord.lat}
                      forecastDataList={forecastData}
                      visibility={data.visibility}
                    />
                  );

                  setComponentInstances((prevInstances) => [...prevInstances, newWeatherComponent]);
                });
            });
        })
        .catch((error) => {
          console.error(`Error fetching weather data: ${error.message}`);
          setIsCityError(true);
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

        <div>
          {isInfoExpanded ? (
            <div className="infoDivExpanded">
              <p>For greater precision in selecting a city, enter the city's name followed by a comma and a two-letter country code. <br /> <br />Example: San Francisco, US <br />
              <br /> Each weather request has an option to expand for more additional details or delete, which are located in the upper right corner of each weather section. <br />
                <br />Please be aware that certain information displayed is limited due to the API service. For example, the visibility reading is capped at six miles due to the constraints of the service utilized.</p>
              <button onClick={() => setIsInfoExpanded(!isInfoExpanded)} className="collapseButton"><FontAwesomeIcon icon={faMinimize}></FontAwesomeIcon></button>
            </div>
          ) : (
            <button className="infoButton" onClick={() => setIsInfoExpanded(true)}>
            <FontAwesomeIcon icon={faCircleInfo}></FontAwesomeIcon>
            </button>
          )}
        </div>

        {isDuplicate && (
          <div>
            <p className="duplicateCity">Duplicate City</p>
          </div>
        )}

        {isCityError && (
          <div>
            <p className="errorCity">Error Loading City. Please Enter Another City.</p>
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
