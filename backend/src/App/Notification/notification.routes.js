const express = require('express');
const notificationController = require('./notification.controller');
const authMiddleware = require('../Middleware/auth.middleware');
const router = express.Router();

// ------------------------------------------------------------------
// Test Notification Route
// ------------------------------------------------------------------
router.post('/test', authMiddleware, notificationController.testNotification);

module.exports = router;
