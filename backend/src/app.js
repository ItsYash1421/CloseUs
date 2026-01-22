const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const routes = require('./routes');
const { errorResponse } = require('./Shared/Utils');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json(errorResponse('Route not found', 404));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(errorResponse('Internal server error', 500));
});

module.exports = app;
