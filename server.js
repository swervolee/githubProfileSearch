#!/usr/bin/node

const express = require("express");
const Redis = require("ioredis");
const fetch = require("node-fetch");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));

const redis = new Redis();
const PORT = 3000;
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json',
    "Authorization": process.env.git_token,
    "User-Agent": "swervolee",
}


redis.on("connect", () => console.log("Connected to Redis"));
redis.on("error", (err) => console.error("Redis Error:", err));

// Endpoint to fetch GitHub user data
app.get("/api/github/:username", async (req, res) => {
    const { username } = req.params;

    try {
        // Check if data exists in Redis
        const cachedData = await redis.get(username);
        if (cachedData) {
            return res.json(JSON.parse(cachedData)); // Return cached data
        }

        // Fetch data from GitHub API
        const apiUrl = `https://api.github.com/users/${username}`;
	console.log(apiUrl);
        const response = await fetch(apiUrl, headers);

        if (!response.ok) {
            throw new Error(`GitHub API Request Failed. Status: ${response.status}`);
        }

        const data = await response.json();

        // Cache the data in Redis (with a TTL of 1 hour)
        await redis.set(username, JSON.stringify(data), "EX", 3600);

        return res.json(data);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: "An error occurred", details: err.message });
    }
});


// Endpoint to fetch users repositories
app.get("/api/github/repos/:username", async (req, res) => {
    const { username } = req.params;

    try {
	const cachedData = await redis.get(`${username}_repos`);

	if (cachedData) {
	    return res.json(JSON.parse(cachedData));
	}

	// else fetch the data from github
	const response = await fetch(`https://api.github.com/users/${username}/repos`);
	

	if (!response.ok) {
            throw new Error(`GitHub API Request Failed. Status: ${response.status}`);
	}

	const data = await response.json();

	// Give the redis data a 1hr TTL
	await redis.set(`${username}_repos`, JSON.stringify(data), 'EX', 3600);
	return res.json(data);
    } catch (err) {
	console.error('Error', err.message);
	res.status(500).json({ error: 'An error occured', details: err.message });
    }
    
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
