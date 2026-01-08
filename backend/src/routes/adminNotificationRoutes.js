const express = require('express');
const router = express.Router();
const adminNotificationController = require('../controllers/adminNotificationController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// ========== NOTIFICATION TEMPLATES ==========
router.get('/templates', adminNotificationController.getAllTemplates);
router.post('/templates', adminNotificationController.createTemplate);
router.put('/templates/:id', adminNotificationController.updateTemplate);
router.delete('/templates/:id', adminNotificationController.deleteTemplate);
router.patch('/templates/:id/toggle', adminNotificationController.toggleTemplateStatus);

// ========== SEND NOTIFICATIONS ==========
router.post('/send/all', adminNotificationController.sendToAllUsers);
router.post('/send/specific', adminNotificationController.sendToSpecificUsers);

// ========== STATS ==========
router.get('/stats', adminNotificationController.getNotificationStats);

// ========== LEGACY ROUTES (Backward compatibility) ==========
router.post('/notifications', adminNotificationController.createNotification);
router.get('/notifications', adminNotificationController.getNotifications);
router.post('/notifications/:id/send', adminNotificationController.sendNotification);
router.get('/notifications/:id/metrics', adminNotificationController.getNotificationMetrics);

module.exports = router;
