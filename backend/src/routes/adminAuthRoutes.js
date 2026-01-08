const express = require('express');
const adminAuthController = require('../controllers/adminAuthController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

const router = express.Router();

// Auth routes
router.post('/login', adminAuthController.login);
router.get('/me', adminAuthMiddleware, adminAuthController.getProfile);

module.exports = router;
