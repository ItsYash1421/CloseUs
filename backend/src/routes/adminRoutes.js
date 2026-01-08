const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const {
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
    pauseCampaign,
    getCampaignMetrics,
} = require('../controllers/adminCampaignController');

const {
    createNotification,
    getNotifications,
    sendNotification,
    getNotificationMetrics,
} = require('../controllers/adminNotificationController');

const {
    createPromotion,
    getPromotions,
    updatePromotion,
    deletePromotion,
    getPromotionUsage,
} = require('../controllers/adminPromotionController');

const {
    createFeatureFlag,
    getFeatureFlags,
    updateFeatureFlag,
    toggleFeatureFlag,
    updateRollout,
} = require('../controllers/adminFeatureController');

const {
    getEnhancedStats,
    getUserAnalytics,
    getEngagementAnalytics,
} = require('../controllers/adminAnalyticsController');

// Apply auth middleware to all routes
router.use(adminAuthMiddleware);

// Campaign routes
router.post('/campaigns', createCampaign);
router.get('/campaigns', getCampaigns);
router.get('/campaigns/:id', getCampaignById);
router.put('/campaigns/:id', updateCampaign);
router.delete('/campaigns/:id', deleteCampaign);
router.post('/campaigns/:id/launch', launchCampaign);
router.post('/campaigns/:id/pause', pauseCampaign);
router.get('/campaigns/:id/metrics', getCampaignMetrics);

// Notification routes
router.post('/notifications', createNotification);
router.get('/notifications', getNotifications);
router.post('/notifications/:id/send', sendNotification);
router.get('/notifications/:id/metrics', getNotificationMetrics);

// Promotion routes
router.post('/promotions', createPromotion);
router.get('/promotions', getPromotions);
router.put('/promotions/:id', updatePromotion);
router.delete('/promotions/:id', deletePromotion);
router.get('/promotions/:id/usage', getPromotionUsage);

// Feature flag routes
router.post('/features', createFeatureFlag);
router.get('/features', getFeatureFlags);
router.put('/features/:id', updateFeatureFlag);
router.post('/features/:id/toggle', toggleFeatureFlag);
router.put('/features/:id/rollout', updateRollout);

// Enhanced analytics routes
router.get('/analytics/stats', getEnhancedStats);
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/engagement', getEngagementAnalytics);

module.exports = router;
