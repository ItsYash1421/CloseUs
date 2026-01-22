const express = require('express');
const router = express.Router();
const analyticsController = require('./analytics.controller');
const adminAuthMiddleware = require('../Middleware/auth.middleware');

router.use(adminAuthMiddleware);

router.get('/stats', analyticsController.getEnhancedStats);
router.get('/users', analyticsController.getUserAnalytics);
router.get('/engagement', analyticsController.getEngagementAnalytics);

module.exports = router;
