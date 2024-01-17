import React from "react";
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faMinimize, faSquareMinus } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { DateTime } from 'luxon';
import './App.css'


const libraries = ['places'];

const WeatherComponent = (props) => {
    const { city, country, temperature, conditions, windspeed, winddeg, pressure, humidity, feelslike, sunrise, sunset, timezone, airPollution, weathericon, lon, lat, forecastDataList, onDelete, visibility } = props;

    // const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const iconBaseUrl = "https://openweathermap.org/img/wn/";




    const center = {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
        libraries,
    });

    const getDate = (index) => {

        if (index === 0) {
            return 'Today';
        }

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const currentDate = new Date();
        let dayIndex = currentDate.getDay() + index;
        if (dayIndex > 6) {
            dayIndex -= 7;
        }
        const currentDayOfWeek = daysOfWeek[dayIndex];
        return currentDayOfWeek;
    }



    function getTime(dt, timezone, index) {
        let formattedTime = '';

        if (index === 0) {
            formattedTime = 'Now';
        } else {
            const localDateTime = DateTime.fromSeconds(dt, { zone: timezone });
            formattedTime = localDateTime.toLocaleString({ hour: 'numeric', hour12: true });
        }

        return formattedTime;
    }

    function sunTime(dt, timezone) {
    

        const localDateTime = DateTime.fromSeconds(dt, { zone: timezone });
        let formattedTime = localDateTime.toLocaleString({ hour: 'numeric', minute: 'numeric', hour12: true });


        return formattedTime;
    }




    const sunriseMill = sunrise * 1000;
    const sunrisedate = new Date(sunriseMill);

    const sunsetMill = sunset * 1000;
    const sunsetdate = new Date(sunsetMill);

    const options = {
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'UTC'
    };

    const formattedSunrise = sunrisedate.toLocaleTimeString('en-US', options);
    const formattedSunset = sunsetdate.toLocaleTimeString('en-US', options);




    const airQuality = (airPollution) => {
        let airQual = '';
        switch (airPollution) {
            case 1:
                airQual = 'Good';
                break;
            case 2:
                airQual = 'Fair';
                break;
            case 3:
                airQual = 'Moderate';
                break;
            case 4:
                airQual = "Poor";
                break;
            case 5:
                airQual = "Very Poor";
                break;
            default:
                airQual = 'Unknown';
        }

        return airQual;

    }

    const windDirection = (winddeg) => {
        let windDir = '';

        if ((winddeg >= 350 && winddeg <= 360) || (winddeg >= 0 && winddeg <= 10)) {
            windDir = 'N';
        } else if (winddeg >= 20 && winddeg <= 30) {
            windDir = 'N/NE';
        } else if (winddeg >= 40 && winddeg <= 50) {
            windDir = 'NE';
        } else if (winddeg >= 60 && winddeg <= 70) {
            windDir = 'E/NE';
        } else if (winddeg >= 80 && winddeg <= 100) {
            windDir = 'E';
        } else if (winddeg >= 110 && winddeg <= 120) {
            windDir = 'E/SE';
        } else if (winddeg >= 130 && winddeg <= 140) {
            windDir = 'SE';
        } else if (winddeg >= 150 && winddeg <= 160) {
            windDir = 'S/SE';
        } else if (winddeg >= 170 && winddeg <= 190) {
            windDir = 'S';
        } else if (winddeg >= 200 && winddeg <= 210) {
            windDir = 'S/SW';
        } else if (winddeg >= 220 && winddeg <= 230) {
            windDir = 'SW';
        } else if (winddeg >= 240 && winddeg <= 250) {
            windDir = 'W/SW';
        } else if (winddeg >= 260 && winddeg <= 280) {
            windDir = 'W';
        } else if (winddeg >= 290 && winddeg <= 300) {
            windDir = 'W/NW';
        } else if (winddeg >= 310 && winddeg <= 320) {
            windDir = 'NW';
        } else if (winddeg >= 330 && winddeg <= 340) {
            windDir = 'N/NW';
        }

        return windDir;
    };





    return (

        <div className={`weatherDiv ${isExpanded ? 'expandedDiv' : ''}`}>
            <p className={`city ${isExpanded ? 'expandedCity' : ''}`}>{city}, {country}</p>
            <p className={`temperature ${isExpanded ? 'expandedTemp' : ''}`}>{temperature + '\u00B0'}</p>
            <div className={`weatherSec ${isExpanded ? 'expandedWeatherSec' : ''}`}>
                <p className={`conditions ${isExpanded ? 'expandedConditions' : ''}`}>
                    <span className="conditionMain">{conditions}</span>
                    <img className="weatherIcon" src={`${iconBaseUrl}${weathericon}@2x.png`} alt="Weather Icon" />
                </p>
                {isExpanded && (


                    <div className="gridWrapper">

                        <div className="forecast">

                            {forecastDataList && forecastDataList.hourly && forecastDataList.hourly.map((item, index) => (
                                <div key={index} className="forecastDiv">
                                    <p className="forecastDate">{getTime(item.dt, forecastDataList.timezone, index)}</p>
                                    <img className="forecastIcon" src={`${iconBaseUrl}${item.weather[0].icon}@2x.png`} alt="Weather Icon"></img>
                                    <p className="forecastTemp">{Math.round(item.temp) + '\u00B0'}</p>

                                </div>
                            ))}

                        </div>

                        <div className="dailyForecast">

                            {forecastDataList && forecastDataList.daily && forecastDataList.daily.map((item, index) => (
                                <div key={index} className={`dailyForecastDiv ${index === forecastDataList.daily.length - 1 ? 'lastItem' : ''}`}>

                                    <div>
                                        <p className="dailyDate">{getDate(index)}</p>
                                    </div>
                                    <div>
                                        <img className="dailyIcon" src={`${iconBaseUrl}${item.weather[0].icon}@2x.png`} alt="Weather Icon"></img>
                                    </div>
                                    <div className="dailyTemps">
                                        <p className="min">{Math.round(item.temp.min) + '\u00B0'}</p>
                                        <p className="max">{Math.round(item.temp.max) + '\u00B0'}</p>
                                    </div>

                                    <div className="bar"></div>


                                </div>
                            ))}

                        </div>

                        <div className="feelsLike">
                            <p className="feelsLikeTitle"> Feels Like</p>
                            <p className="numval">{Math.round(feelslike) + '\u00B0'}</p>

                        </div>

                        <div className="humidity">
                            <p className="humidityTitle">Humidity</p>
                            <p className="numval">{humidity} <span className="smallNum">%</span></p>
                            <input type="range" min="0" max="100" value={humidity} disabled={true} className="airQualSlider"></input>
                        </div>



                        <div className="map-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <GoogleMap
                                mapContainerStyle={{ width: '93%', height: '93%', borderRadius: '5px' }}
                                zoom={9}
                                center={center}
                                options={{
                                    disableDefaultUI: true,
                                    zoomControl: true,
                                    controlSize: 20,
                                }}
                            />
                        </div>



                        <div className="wind">
                            <p className="windTitle">Wind</p>
                            <div className="windGrid">
                                <div className="windSpeed">
                                    <p className="windSpeedText">{windspeed} <span className="smallNum">MPH</span></p>
                                </div>
                                <div className="windDir">
                                    <div>
                                        <p style={{ display: 'inline-block', transform: `rotate(${(winddeg + 135)}deg) skew(-15deg, -15deg)` }}>
                                            <span className="arrow"></span>
                                        </p>
                                        <p className="dir" style={{ display: 'inline-block' }}>
                                            <span className="smallNum">{windDirection(winddeg)}</span>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>





                        <div className="sunrise">
                            <p className="sunriseTitle">Sunrise</p>
                            {/* <p>{sunriseHours}:{sunriseMinutes} AM UTC</p> */}
                            <p className="sunTime"><span className="sunTimeVal">{sunTime(sunrise, timezone)}</span></p>
                            
                            <img className="sunIcon" src="/img/sunrise.png" alt="Sunrise Image"></img>

                        </div>

                        <div className="sunset">
                            <p className="sunsetTitle">Sunset</p>
                            {/* <p>{sunsetHours}:{sunsetMinutes} PM UTC</p> */}
                            <p className="sunTime"><span className="sunTimeVal">{sunTime(sunset, timezone)}</span></p>
                            <img className="sunIcon" src="/img/sunset.png" alt="Sunset Image"></img>



                        </div>




                        <div className="pressure">
                            <p className="pressureTitle">Pressure</p>
                            <p className="numval">{(pressure * 0.02953).toFixed(1)} <span className="smallNum">inHg</span></p>

                        </div>

                        <div className="visibility">
                            <p className="visibilityTitle">Visibility</p>
                            <p className="numval">{Math.round((visibility / 1000) / 1.609)} <span className="smallNum">mi</span></p>

                        </div>

                        <div className="airQuality">
                            <p className="airQualityTitle">Air Quality</p>
                            {/* <p>{airPollution}</p> */}
                            <p className="airQualVal numval">{airQuality(airPollution)}</p>
                            <input type="range" min="0" max="5" value={airPollution} disabled={true} className="airQualSlider"></input>
                        </div>





                    </div>



                )}

            </div>




            <button className="expandButton" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <FontAwesomeIcon icon={faMinimize} /> : <FontAwesomeIcon icon={faExpand} />}
            </button>
            <button className="delete" onClick={onDelete}><FontAwesomeIcon icon={faSquareMinus} /></button>
        </div>
    );
};


export default WeatherComponent;
