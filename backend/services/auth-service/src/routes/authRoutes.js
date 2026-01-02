const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');

// Google OAuth routes
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
    authController.googleCallback
);

// Token routes
router.post('/refresh', authController.refreshToken);
router.get('/verify', authController.verifyToken);
router.post('/logout', authController.logout);

// Failure route
router.get('/failure', (req, res) => {
    res.status(401).json({ success: false, message: 'Authentication failed' });
});

module.exports = router;
