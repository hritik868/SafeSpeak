import React, { useState } from "react";

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

    console.log(`latitude : ${latitude}, Longitude: ${longitude}`);
    setLocation({ latitude, longitude });
    setLoading(false);
  };
  const handleError = (error) => {
    console.error("Error occurred. Error code: " + error.code);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={getLocation}>
        {loading ? "Fetching Location" : "send Loacation"}
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
