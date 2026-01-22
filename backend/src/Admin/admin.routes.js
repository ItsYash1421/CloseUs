const express = require('express');
const router = express.Router();

const authRoutes = require('./Auth/auth.routes');
const campaignRoutes = require('./Campaign/campaign.routes');
const promotionRoutes = require('./Promotion/promotion.routes');
const featureRoutes = require('./Feature/feature.routes');
const analyticsRoutes = require('./Analytics/analytics.routes');
const notificationRoutes = require('./Notification/notification.routes');
const dashboardRoutes = require('./Dashboard/dashboard.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/promotions', promotionRoutes);
router.use('/features', featureRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
