const express = require('express');
const userController = require('../controllers/userController');
const dailyQuestionController = require('../controllers/dailyQuestionController');
const userPreferencesController = require('../controllers/userPreferencesController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// User profile routes (specific paths first)
router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.post('/update-push-token', userController.updatePushToken);
router.post('/complete-onboarding', userController.completeOnboarding);
router.post('/heartbeat', userController.heartbeat);
router.get('/partner-status', userController.getPartnerStatus);

// Notification Preferences Routes (must come before /:id wildcard)
router.get('/preferences/notifications', userPreferencesController.getNotificationPreferences);
router.put('/preferences/notifications', userPreferencesController.updateNotificationPreferences);

// Daily Question Routes
router.get('/questions/daily', dailyQuestionController.getDailyQuestion);
router.post('/questions/daily/:id/answer', dailyQuestionController.answerDailyQuestion);
router.delete('/questions/daily/:id/answer', dailyQuestionController.deleteDailyAnswer);

// Wildcard route - MUST be last
router.get('/:id', userController.getUserById);

module.exports = router;
