const getLocationThroughBrowser = () => {
    
  console.log(navigator.geolocation);
};
exports.getLocation = (req, res) => {
  getLocationThroughBrowser();
  res.status(200).json({
    Message: "Success",
  });
};
