import express from 'express';
const router = express.Router();

import githubController from '../controllers/githubController.js';

const { getGitHubUserData, getGitHubRepos, fetchCommits } = githubController;

// Route for fetching GitHub user data
router.get('/user/:username', githubController.getGitHubUserData);

// Route for fetching GitHub user repositories
router.get('/repos/:username', githubController.getGitHubRepos);

// Route for fetching github repo commits
router.get('/commits/:repoName/:username', githubController.fetchCommits);

export default  router;
