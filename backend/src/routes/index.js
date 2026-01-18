const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const coupleRoutes = require('./coupleRoutes');
const chatRoutes = require('./chatRoutes');
const adminAuthRoutes = require('./adminAuthRoutes');
const adminRoutes = require('./adminRoutes');
const adminNotificationRoutes = require('./adminNotificationRoutes');
const webRoutes = require('../web/web.routes');

// Web routes (public)
router.use('/web', webRoutes);

// Auth routes (public)
router.use('/auth', authRoutes);

// Admin auth routes (public)
router.use('/admin/auth', adminAuthRoutes);

// Admin routes (protected)
router.use('/admin', adminRoutes);
router.use('/admin/notifications', adminNotificationRoutes);

// User routes (protected)
router.use('/users', userRoutes);
router.use('/couples', coupleRoutes);
router.use('/chat', chatRoutes);

// Analytics tracking (public endpoint for mobile)
const authMiddleware = require('../middleware/authMiddleware');
const { trackEvent } = require('../controllers/adminAnalyticsController');
router.post('/analytics/track', authMiddleware, trackEvent);

// Promotion redemption (public endpoint for mobile)
const { redeemPromotion } = require('../controllers/adminPromotionController');
router.post('/promotions/redeem', authMiddleware, redeemPromotion);

// Feature flags (public endpoint for mobile)
const { getUserFeatures } = require('../controllers/adminFeatureController');
router.get('/features/user', authMiddleware, getUserFeatures);

// Test notification endpoint (development only)
const { testNotification } = require('../controllers/testNotificationController');
router.post('/test/notification', testNotification);

module.exports = router;
