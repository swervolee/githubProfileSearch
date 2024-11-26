#!/usr/bin/node
import express from 'express';
import cors from 'cors';
import githubRoutes from './routes/githubRoutes.js';
import redisService from './services/redisService.js';
import apiConfig from './config/apiConfig.js';
import morgan from 'morgan';



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

export default app;
