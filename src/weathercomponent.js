import React from "react";
import { GoogleMap, useLoadScript, Marker, OverlayView } from '@react-google-maps/api';
import { useState } from "react";
import './App.css'


const WeatherComponent = (props) => {
    const { city, country, temperature, conditions, windspeed, winddeg, pressure, humidity, feelslike, timezone, sunrise, sunset, airPollution, weathericon, lon, lat, forecastDataList, onDelete, visibility } = props;

    // const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const iconBaseUrl = "https://openweathermap.org/img/wn/";


    const handleDelete = () => {
        onDelete();
    }
    const libraries = ['places'];


    const center = {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
        libraries,
    });

    const getDate = (index) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDate = new Date();
        let dayIndex = currentDate.getDay() + index;
        if (dayIndex > 6) {
            dayIndex -= 7;
        }
        const currentDayOfWeek = daysOfWeek[dayIndex];
        return currentDayOfWeek;
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

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps</div>;
    }



    return (

        <div className={`weatherDiv ${isExpanded ? 'expandedDiv' : ''}`}>
            <p className={`city ${isExpanded ? 'expandedCity' : ''}`}>{city}, {country}</p>
            <p className={`temperature ${isExpanded ? 'expandedTemp' : ''}`}>{temperature + '\u00B0'}</p>
            <div className={`weatherSec ${isExpanded ? 'expandedWeatherSec' : ''}`}>
                <p className={`conditions ${isExpanded ? 'expandedConditions' : ''}`}>
                    <span>{conditions}</span>
                    <img className="weatherIcon" src={`${iconBaseUrl}${weathericon}@2x.png`} alt="Weather Icon" />
                </p>
                {isExpanded && (


                    <div className="gridWrapper">
                        <div className="forecast">
                            {forecastDataList.list && forecastDataList.list.slice(0, 7).map((item, index) => (
                                <div key={index} className="forecastDiv">
                                    <p className="forecastDate">{getDate(index)}</p>
                                    <p className="forecastTemp">{Math.round(item.main.temp) + '\u00B0'}</p>
                                    <p>{item.weather.icon}</p>
                                    <img className="forecastIcon" src={`${iconBaseUrl}${item.weather[0].icon}@2x.png`} alt="Weather Icon"></img>

                                </div>
                            ))}

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

                        <div className="feelsLike">
                            <p className="feelsLikeTitle"> Feels Like</p>
                            <p className="numval">{Math.round(feelslike) + '\u00B0'}</p>

                        </div>

                        <div className="wind">
                            <p className="windTitle">Wind</p>
                            <div className="windGrid">
                                <div className="windSpeed">
                                    <p>{windspeed} <span className="windMPH">MPH</span></p>
                                </div>
                                <div className="windDir">
                                    <div>
                                        <p style={{ display: 'inline-block', transform: `rotate(${(winddeg + 135)}deg) skew(-15deg, -15deg)` }}>
                                            <span className="arrow"></span>
                                        </p>
                                        <p style={{ display: 'inline-block' }}>
                                            <span className="windMPH">{windDirection(winddeg)}</span>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="humidity">
                            <p className="humidityTitle">Humidity</p>
                            <p className="numval">{humidity}</p>
                        </div>



                        <div className="sunrise">
                            <p className="sunriseTitle">Sunrise</p>
                            {/* <p>{sunriseHours}:{sunriseMinutes} AM UTC</p> */}
                            <p>{formattedSunrise} GMT</p>
                            <img className="sunIcon" src="/img/sunrise.png" alt="Sunrise Image"></img>

                        </div>

                        <div className="sunset">
                            <p className="sunsetTitle">Sunset</p>
                            {/* <p>{sunsetHours}:{sunsetMinutes} PM UTC</p> */}
                            <p>{formattedSunset} GMT</p>
                            <img className="sunIcon" src="/img/sunset.png" alt="Sunset Image"></img>
                            


                        </div>


                        

                        <div className="pressure">
                            <p className="pressureTitle">Pressure</p>
                            <p className="numval">{pressure}</p>

                        </div>

                        <div className="visibility">
                            <p className="visibilityTitle">Visibility</p>
                            <p className="numval">{Math.round((visibility / 1000) / 1.609)} Mi</p>

                        </div>

                        <div className="airQuality">
                            <p className="airQualityTitle">Air Quality</p>
                            {/* <p>{airPollution}</p> */}
                            <p className="numval">{airQuality(airPollution)}</p>
                            <input type="range" min="0" max="5" value={airPollution} disabled={true} className="airQualSlider"></input>
                        </div>





                    </div>



                )}

            </div>




            <button className="expandButton" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Minimize' : 'Expand'}
            </button>
            <button className="delete" onClick={onDelete}>X</button>
        </div>
    );
};


export default WeatherComponent;
