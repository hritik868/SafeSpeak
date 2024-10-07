import React, { useState } from "react";
import axios from "axios";
const App = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(false);
  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  const showPosition = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    sendLocation(latitude, longitude);
    console.log(`latitude : ${latitude}, Longitude: ${longitude}`);
    setLocation({ latitude, longitude });
    setLoading(false);
  };
  const handleError = (error) => {
    console.log(error);
    console.error("Error occurred. Error code: " + error);
    setLoading(false);
  };

  const sendLocation = async (latitude, longitude) => {
    const url = `${import.meta.env.VITE_SERVER_URL}/api/location/getLocation`;
    console.log(url);
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/location/getLocation`,
      {
        latitude,
        longitude,
      }
    );
  };
  return (
    <div>
      <button onClick={getLocation}>
        {loading ? "Fetching Location" : "send Location"}
      </button>
      {location.latitude && location.longitude && (
        <div>
          Location: {location.latitude} Latitude: {location.longitude}
        </div>
      )}
    </div>
  );
};

export default App;
