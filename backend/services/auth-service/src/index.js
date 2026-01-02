const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('@closeus/db/connection');
const authRoutes = require('./routes/authRoutes');
const { PORTS } = require('@closeus/constants');

dotenv.config();

const app = express();
const PORT = process.env.PORT || PORTS.AUTH;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for passport
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'closeus-session-secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' }
    })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ success: true, service: 'auth-service', status: 'healthy' });
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
        // Connect to MongoDB
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Auth Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start auth service:', error);
        process.exit(1);
    }
};

startServer();
