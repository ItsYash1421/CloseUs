const express = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/messages', chatController.getMessages);
router.post('/send', chatController.sendMessage);
router.put('/read/:messageId', chatController.markAsRead);

module.exports = router;
