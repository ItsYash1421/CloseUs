const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { generateToken, generateRefreshToken, successResponse, errorResponse } = require('../../Shared/Utils');

/**
 * Google Mobile Login (ID Token)
 */
const googleMobileLogin = async (req, res) => {
    try {
        const { idToken, user: userInfo } = req.body;

        if (!idToken) {
            return res.status(400).json(errorResponse('ID Token required', 400));
        }

        // Verify ID token with Google
        const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);

        if (!googleResponse.ok) {
            return res.status(401).json(errorResponse('Invalid Google ID Token', 401));
        }

        const payload = await googleResponse.json();

        // Check if user exists
        let user = await User.findOne({
            $or: [
                { googleId: payload.sub },
                { email: payload.email }
            ]
        });

        if (!user) {
            // Create new user
            user = await User.create({
                email: payload.email,
                googleId: payload.sub,
                name: payload.name || userInfo?.name || 'User',
                photoUrl: payload.picture || userInfo?.photo,
                isOnboardingComplete: false
            });
        } else if (!user.googleId) {
            // Link Google ID if existing user by email
            user.googleId = payload.sub;
            if (!user.photoUrl && payload.picture) user.photoUrl = payload.picture;
            await user.save();
        }

        // Generate tokens
        const accessToken = generateToken({ userId: user._id });
        const refreshToken = generateRefreshToken({ userId: user._id });

        res.json(successResponse({
            user,
            tokens: {
                accessToken,
                refreshToken
            }
        }, 'Login successful'));

    } catch (error) {
        console.error('Mobile auth error:', error);
        res.status(500).json(errorResponse('Authentication failed'));
    }
};

/**
 * Google OAuth Callback
 */
const googleCallback = async (req, res) => {
    try {
        // User is already authenticated by passport and attached to req.user
        const user = req.user;

        // Generate tokens
        const accessToken = generateToken({ userId: user._id });
        const refreshToken = generateRefreshToken({ userId: user._id });

        // Redirect to app with tokens
        // Ideally this should use a deep link scheme like closeus://
        // For now, we'll assume a development setup or a web redirect
        const redirectUrl = `${process.env.MOBILE_APP_SCHEME || 'closeus://'}auth?accessToken=${accessToken}&refreshToken=${refreshToken}&userId=${user._id}&isNew=${user.isOnboardingComplete ? 'false' : 'true'}`;

        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Auth callback error:', error);
        res.status(500).json(errorResponse('Authentication failed'));
    }
};

/**
 * Refresh Access Token
 */
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json(errorResponse('Refresh token required', 400));
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(404).json(errorResponse('User not found', 404));
            }

            const newAccessToken = generateToken({ userId: user._id });
            res.json(successResponse({ accessToken: newAccessToken }, 'Token refreshed'));
        } catch (err) {
            return res.status(401).json(errorResponse('Invalid refresh token', 401));
        }
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Verify Token
 */
const verifyAuthDetail = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        res.json(successResponse({ user }, 'Token valid'));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Logout
 */
const logout = async (req, res) => {
    // Client should discard tokens
    res.json(successResponse(null, 'Logged out successfully'));
};

module.exports = {
    googleMobileLogin,
    googleCallback,
    refreshAccessToken,
    verifyAuthDetail,
    logout
};
