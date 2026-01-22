const express = require('express');
const adminAuthController = require('./auth.controller');
const adminAuthMiddleware = require('../Middleware/auth.middleware');

const router = express.Router();

// Auth routes
router.post('/login', adminAuthController.login);
router.get('/me', adminAuthMiddleware, adminAuthController.getProfile);

module.exports = router;
