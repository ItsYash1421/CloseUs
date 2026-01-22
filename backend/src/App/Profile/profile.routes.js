const express = require('express');
const userController = require('./profile.controller');
const dailyQuestionController = require('../Home/dailyQuestion.controller');
const userPreferencesController = require('./preferences.controller');
const authMiddleware = require('../Middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// ------------------------------------------------------------------
// User Profile Routes
// ------------------------------------------------------------------
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.post('/update-push-token', userController.updatePushToken);
router.post('/complete-onboarding', userController.completeOnboarding);
router.post('/heartbeat', userController.heartbeat);
router.get('/partner-status', userController.getPartnerStatus);

// ------------------------------------------------------------------
// Notification Preferences Routes
// ------------------------------------------------------------------
router.get('/preferences/notifications', userPreferencesController.getNotificationPreferences);
router.put('/preferences/notifications', userPreferencesController.updateNotificationPreferences);

// ------------------------------------------------------------------
// Wildcard Route
// ------------------------------------------------------------------
router.get('/:id', userController.getUserById);

module.exports = router;
