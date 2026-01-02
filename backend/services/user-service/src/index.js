const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('@closeus/db/connection');
const userRoutes = require('./routes/userRoutes');
const { PORTS } = require('@closeus/constants');

dotenv.config();

const app = express();
const PORT = process.env.PORT || PORTS.USER;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, service: 'user-service', status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 User Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start user service:', error);
        process.exit(1);
    }
};

startServer();
