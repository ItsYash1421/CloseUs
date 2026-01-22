const express = require('express');
const notificationController = require('./notification.controller');
const router = express.Router();

// Test notification route (for dev/debugging)
router.post('/test', notificationController.testNotification);

module.exports = router;
