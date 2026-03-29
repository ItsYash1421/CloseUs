const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const passport = require('./config/passport');
const routes = require('./routes/api.routes');
const { errorResponse } = require('./Shared/Utils');

const app = express();

// ------------------------------------------------------------------
// Allowed Origins
// ------------------------------------------------------------------
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.ADMIN_URL,
    process.env.WEB_URL,
].filter(Boolean);

// ------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(passport.initialize());

// ------------------------------------------------------------------
// Rate Limiting
// ------------------------------------------------------------------
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts, please try again later.' },
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/admin/auth', authLimiter);

// ------------------------------------------------------------------
// Security & Caching Headers
// ------------------------------------------------------------------
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});

// ------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------
app.use('/api', routes);

// ------------------------------------------------------------------
// Health Check
// ------------------------------------------------------------------
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', version: '1.0.0' });
});

// ------------------------------------------------------------------
// 404 Handler
// ------------------------------------------------------------------
app.use((req, res) => {
    res.status(404).json(errorResponse('Route not found', 404));
});

// ------------------------------------------------------------------
// Error Handler
// ------------------------------------------------------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(errorResponse('Internal server error', 500));
});

module.exports = app;
