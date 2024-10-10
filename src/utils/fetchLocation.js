const getLocation = () => {
  return new Promise((resolve, reject) => {
    const showPosition = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      resolve({ latitude, longitude });
    };
    const handleError = (error) => {
      reject(error);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

export default getLocation;
