const express = require("express");
const locationFunctions = require("./../controllers/locationControllers");
const Router = express.Router();

Router.route("/getLocation").get(locationFunctions.getLocation);
module.exports = Router;
