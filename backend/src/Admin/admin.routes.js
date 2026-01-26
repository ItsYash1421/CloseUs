const express = require('express');
const router = express.Router();

const authRoutes = require('./Auth/auth.routes');
const campaignRoutes = require('./Campaign/campaign.routes');
const promotionRoutes = require('./Promotion/promotion.routes');
const featureRoutes = require('./Feature/feature.routes');
const analyticsRoutes = require('./Analytics/analytics.routes');
const notificationRoutes = require('./Notification/notification.routes');
const dashboardRoutes = require('./Dashboard/dashboard.routes');
const gameRoutes = require('./Game/game.routes');
const questionRoutes = require('./Question/question.routes');

// ------------------------------------------------------------------
// Mount Routes
// ------------------------------------------------------------------
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/promotions', promotionRoutes);
router.use('/features', featureRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/games', gameRoutes);
router.use('/questions', questionRoutes);

module.exports = router;
