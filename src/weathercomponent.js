import React from "react";
// import { useNavigate} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useState } from "react";
import './App.css'


const WeatherComponent = (props) => {
    const { city, country, temperature, conditions, wind, winddeg, pressure, humidity, sunrise, sunset, weathericon, lon, lat, forecastDataList, onDelete } = props;

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

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps</div>;
    }

    return (

        <div className="weatherDiv" onClick={() => setIsExpanded(!isExpanded)}>
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

                        <div className="wind">
                            <p>Wind</p>
                            <p>{wind}</p>
                            <p>{winddeg}</p>

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

                        <div className="sunrise">
                            <p>Sunrise</p>
                            <p>{sunrise}</p>
                        </div>

                        <div className="sunset">
                            <p>Sunset</p>
                            <p>{sunset}</p>

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
                        </div>


                    </div>
                )}

            </div>



            {isExpanded && (
                <div className="expandedDiv">
                    <div className="map-container">
                        {/* <GoogleMap
                            className="map"
                            mapContainerStyle={mapContainerStyle}
                            zoom={9}
                            center={center}
                            options={{
                                disableDefaultUI: true,
                                zoomControl: false,
                            }}
                        /> */}
                    </div>
                </div>


            )}

            <button className="delete" onClick={onDelete}>-</button>
        </div>
    );
};


export default WeatherComponent;
