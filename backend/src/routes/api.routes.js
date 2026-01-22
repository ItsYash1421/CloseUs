const express = require('express');
const router = express.Router();

// ------------------------------------------------------------------
// Import Routes
// ------------------------------------------------------------------
const authRoutes = require('../App/Auth/auth.routes');
const userRoutes = require('../App/Profile/profile.routes');
const coupleRoutes = require('../App/Couple/couple.routes');
const homeRoutes = require('../App/Home/home.routes');
const chatRoutes = require('../App/Chat/chat.routes');
const adminRoutes = require('../Admin/admin.routes');
const webRoutes = require('../Web/EarlyAccess/earlyAccess.routes');

// ------------------------------------------------------------------
// Web Routes (Public)
// ------------------------------------------------------------------
router.use('/web', webRoutes);

// ------------------------------------------------------------------
// Auth Routes (Public)
// ------------------------------------------------------------------
router.use('/auth', authRoutes);

// ------------------------------------------------------------------
// Admin Routes (Protected)
// ------------------------------------------------------------------
router.use('/admin', adminRoutes);

// ------------------------------------------------------------------
// User Routes (Protected)
// ------------------------------------------------------------------
router.use('/users', homeRoutes);
router.use('/users', userRoutes);
router.use('/couples', coupleRoutes);
router.use('/chat', chatRoutes);

// ------------------------------------------------------------------
// Analytics & Misc (Protected)
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// Analytics Tracking
// ------------------------------------------------------------------
const authMiddleware = require('../App/Middleware/auth.middleware');
const { trackEvent } = require('../Admin/Analytics/analytics.controller');
router.post('/analytics/track', authMiddleware, trackEvent);

// ------------------------------------------------------------------
// Promotion Redemption
// ------------------------------------------------------------------
const { redeemPromotion } = require('../Admin/Promotion/promotion.controller');
router.post('/promotions/redeem', authMiddleware, redeemPromotion);

// ------------------------------------------------------------------
// Feature Flags
// ------------------------------------------------------------------
const { getUserFeatures } = require('../Admin/Feature/feature.controller');
router.get('/features/user', authMiddleware, getUserFeatures);

// ------------------------------------------------------------------
// Notification Routes (Dev/Mixed)
// ------------------------------------------------------------------
const notificationRoutes = require('../App/Notification/notification.routes');
router.use('/notifications', notificationRoutes);

module.exports = router;
