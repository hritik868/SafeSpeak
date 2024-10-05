const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("SUCCESS");
});

app.get("/nearby", (req, res) => {
    
})

module.exports = server;
