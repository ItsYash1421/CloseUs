const express = require('express');
const chatController = require('./chat.controller');
const authMiddleware = require('../Middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// ------------------------------------------------------------------
// Chat Routes
// ------------------------------------------------------------------
router.get('/messages/recent', chatController.getRecentMessages);
router.get('/messages/older', chatController.getOlderMessages);
router.post('/send', chatController.sendMessage);
router.put('/read/:messageId', chatController.markAsRead);

module.exports = router;
