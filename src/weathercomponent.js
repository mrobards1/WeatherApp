import React from "react";
// import { useNavigate} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useState } from "react";
import './App.css'


const WeatherComponent = (props) => {
    const { city, country, temperature, conditions, windspeed, winddeg, pressure, humidity, feelslike, timezone, sunrise, sunset, airPollution, weathericon, lon, lat, forecastDataList, onDelete } = props;

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

    const sunriseHours = sunrisedate.getHours();
    const sunriseMinutes = sunrisedate.getMinutes();

    const sunsetMill = sunset * 1000;
    const sunsetdate = new Date(sunsetMill);

    const sunsetHours = sunsetdate.getHours();
    const sunsetMinutes = sunsetdate.getMinutes();



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
                airQual = 'Moderade';
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
            <div className={`test ${isExpanded ? 'expandedTest' : ''}`}>
                <p className={`conditions ${isExpanded ? 'expandedConditions' : ''}`}>
                    <span>{conditions}</span>
                    <img className="weatherIcon" src={`${iconBaseUrl}${weathericon}@2x.png`} alt="Weather Icon" />
                </p>
                {isExpanded && (


                    <div className="gridWrapper">
                        <div className="forecast">
                            {forecastDataList.list && forecastDataList.list.slice(0, 7).map((item, index) => (
                                <div key={index} className="forecastDiv">
                                    <p>{getDate(index)}</p>
                                    <p>{Math.round(item.main.temp)}</p>
                                    <p>{item.weather.icon}</p>
                                    <img src={`${iconBaseUrl}${item.weather[0].icon}@2x.png`} alt="Weather Icon"></img>

                                </div>
                            ))}

                        </div>

                        <div className="map-container">
                            <GoogleMap

                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                zoom={9}
                                center={center}
                                options={{
                                    disableDefaultUI: true,
                                    zoomControl: false,
                                }}
                            />
                        </div>

                        <div className="wind">
                            <p>Wind</p>
                            <p>{windspeed} MPH</p>
                            <p>{winddeg + '\u00B0'} {windDirection(winddeg)}</p>


                        </div>



                        <div className="sunrise">
                            <p>Sunrise</p>
                            {/* <p>{sunriseHours}:{sunriseMinutes} AM UTC</p> */}
                            <p>{sunrisedate.toUTCString()}</p>
                            
                        </div>

                        <div className="sunset">
                            <p>Sunset</p>
                            {/* <p>{sunsetHours}:{sunsetMinutes} PM UTC</p> */}
                            <p>{sunsetdate.toUTCString()}</p>
                            

                        </div>

                        <div className="humidity">
                            <p>Humidity</p>
                            <p>{humidity}</p>
                        </div>

                        <div className="pressure">
                            <p>Pressure</p>
                            <p>{pressure}</p>

                        </div>

                        <div className="airQuality">
                            <p>Air Quality</p>
                            <p>{airPollution}</p>
                            <p>{airQuality(airPollution)}</p>
                            <input type="range" min="0" max="5" value={airPollution} disabled="true" className="airQualSlider"></input>
                        </div>

                        <div className="feelsLike">
                            <p> Feels Like</p>
                            <p>{Math.round(feelslike)}</p>

                        </div>



                    </div>



                )}

            </div>




            <button className="expandButton" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Minimize' : 'Expand'}
            </button>
            <button className="delete" onClick={onDelete}>x</button>
        </div>
    );
};


export default WeatherComponent;
