const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const locationRoutes = require("./routes/locationRoutes");
app.use("/api/location", locationRoutes);


module.exports = server;
