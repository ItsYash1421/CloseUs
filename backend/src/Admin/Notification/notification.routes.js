const express = require('express');
const router = express.Router();
const adminNotificationController = require('./notification.controller');
const authMiddleware = require('../../App/Middleware/auth.middleware');
const adminAuthMiddleware = require('../Middleware/auth.middleware');

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminAuthMiddleware);

// ------------------------------------------------------------------
// Notification Templates
// ------------------------------------------------------------------
router.get('/templates', adminNotificationController.getAllTemplates);
router.post('/templates', adminNotificationController.createTemplate);
router.put('/templates/:id', adminNotificationController.updateTemplate);
router.delete('/templates/:id', adminNotificationController.deleteTemplate);
router.patch('/templates/:id/toggle', adminNotificationController.toggleTemplateStatus);

// ------------------------------------------------------------------
// Send Notifications
// ------------------------------------------------------------------
router.post('/send/all', adminNotificationController.sendToAllUsers);
router.post('/send/specific', adminNotificationController.sendToSpecificUsers);

// ------------------------------------------------------------------
// Stats
// ------------------------------------------------------------------
router.get('/stats', adminNotificationController.getNotificationStats);

// ------------------------------------------------------------------
// Legacy Routes
// ------------------------------------------------------------------
router.post('/notifications', adminNotificationController.createNotification);
router.get('/notifications', adminNotificationController.getNotifications);
router.post('/notifications/:id/send', adminNotificationController.sendNotification);
router.get('/notifications/:id/metrics', adminNotificationController.getNotificationMetrics);

module.exports = router;
