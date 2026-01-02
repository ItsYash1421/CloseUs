const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('@closeus/db/connection');
const coupleRoutes = require('./routes/coupleRoutes');
const { PORTS } = require('@closeus/constants');

dotenv.config();

const app = express();
const PORT = process.env.PORT || PORTS.COUPLE;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/couples', coupleRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, service: 'couple-service', status: 'healthy' });
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
            console.log(`🚀 Couple Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start couple service:', error);
        process.exit(1);
    }
};

startServer();
