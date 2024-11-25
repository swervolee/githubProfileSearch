const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

// Route for fetching GitHub user data
router.get('/user/:username', githubController.getGitHubUserData);

// Route for fetching GitHub user repositories
router.get('/repos/:username', githubController.getGitHubRepos);

module.exports = router;
