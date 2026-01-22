const express = require('express');
const passport = require('passport');
const authController = require('./auth.controller');
const authMiddleware = require('../Middleware/auth.middleware');

const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    authController.googleCallback
);

// Mobile Google Sign-In
router.post('/google/mobile', authController.googleMobileLogin);

// Token management
router.post('/refresh', authController.refreshAccessToken);
router.get('/verify', authMiddleware, authController.verifyAuthDetail);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
