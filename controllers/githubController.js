import fetch from 'node-fetch';
import redisService from '../services/redisService.js';
import headers from '../config/apiConfig.js';

// GitHub API Request
const fetchGitHubUser = async (username) => {
    const apiUrl = `https://api.github.com/users/${username}`;
    const response = await fetch(apiUrl, headers);
    if (!response.ok) {
        throw new Error(`GitHub API Request Failed. Status: ${response.status}`);
    }
    return await response.json();
};


const getGitHubUserData = async (req, res) => {
    const { username } = req.params;
    try {
        const cachedData = await redisService.get(username);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const data = await fetchGitHubUser(username);
        await redisService.set(username, JSON.stringify(data), "EX", 3600);
        return res.json(data);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: "An error occurred", details: err.message });
    }
};

const getGitHubRepos = async (req, res) => {
    const { username } = req.params;
    try {
        const cachedData = await redisService.get(`${username}_repos`);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const response = await fetch(`https://api.github.com/users/${username}/repos`, headers);
        if (!response.ok) {
            throw new Error(`GitHub API Request Failed. Status: ${response.status}`);
        }

        const data = await response.json();
        await redisService.set(`${username}_repos`, JSON.stringify(data), 'EX', 3600);
        return res.json(data);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: "An error occurred", details: err.message });
    }
};

const fetchCommits = async(req, res) => {
    const { repoName: repo, username } = req.params;
    try {
	const cachedData = await redisService.get(`${repo}_commits`);
	if (cachedData) {
	    return res.json(JSON.parse(cachedData));
	}
	const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
	if (!response.ok) {
	    throw new Error(`Github API Request Failed, Status: ${response.status}`);
	}
	const data = await response.json()
	await redisService.set(`${repo}_commits`, JSON.stringify(data), 'EX', 3600);
	return res.json(data);
    } catch (err) {
	console.error("Error:", err.message);
	res.status(500).json({error: "An error occurred", details: err.message });
    }
}


export default { getGitHubUserData, getGitHubRepos, fetchCommits };
