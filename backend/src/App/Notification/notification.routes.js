const express = require('express');
const notificationController = require('./notification.controller');
const router = express.Router();

// ------------------------------------------------------------------
// Test Notification Route
// ------------------------------------------------------------------
router.post('/test', notificationController.testNotification);

module.exports = router;
