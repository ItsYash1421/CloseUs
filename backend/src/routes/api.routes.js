const express = require('express');
const router = express.Router();

// Import routes
// Import routes
const authRoutes = require('../App/Auth/auth.routes');
const userRoutes = require('../App/Profile/profile.routes');
const coupleRoutes = require('../App/Couple/couple.routes');
const homeRoutes = require('../App/Home/home.routes');
const chatRoutes = require('../App/Chat/chat.routes');
const adminRoutes = require('../Admin/admin.routes');
const webRoutes = require('../Web/EarlyAccess/earlyAccess.routes');

// Web routes (public)
router.use('/web', webRoutes);

// Auth routes (public)
router.use('/auth', authRoutes);

// Admin routes (protected)
router.use('/admin', adminRoutes);

// User routes (protected)
// User routes (protected)
router.use('/users', homeRoutes); // Mount Home routes (Daily Question) on /users to preserve API path
router.use('/users', userRoutes);
router.use('/couples', coupleRoutes);
router.use('/chat', chatRoutes);

// Analytics tracking (public endpoint for mobile)
const authMiddleware = require('../App/Middleware/auth.middleware');
const { trackEvent } = require('../Admin/Analytics/analytics.controller');
router.post('/analytics/track', authMiddleware, trackEvent);

// Promotion redemption (public endpoint for mobile)
const { redeemPromotion } = require('../Admin/Promotion/promotion.controller');
router.post('/promotions/redeem', authMiddleware, redeemPromotion);

// Feature flags (public endpoint for mobile)
const { getUserFeatures } = require('../Admin/Feature/feature.controller');
router.get('/features/user', authMiddleware, getUserFeatures);

// Notification routes (dev/mixed)
const notificationRoutes = require('../App/Notification/notification.routes');
router.use('/notifications', notificationRoutes);

module.exports = router;
