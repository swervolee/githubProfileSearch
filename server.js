#!/usr/bin/node

const express = require("express");
const cors = require('cors');
const githubRoutes = require('./routes/githubRoutes');
const redisService = require('./services/redisService');
const apiConfig = require('./config/apiConfig');
const morgan = require('morgan');


const app = express();
const PORT = 3000;

app.use(morgan('combined'));
app.use(cors());
app.use(express.static('public'));

// Use routes
app.use("/api/github", githubRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
