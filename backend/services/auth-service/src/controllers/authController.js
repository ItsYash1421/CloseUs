const { generateToken, generateRefreshToken, successResponse, errorResponse } = require('@closeus/utils');
const User = require('../models/User');

/**
 * Google OAuth callback handler
 */
exports.googleCallback = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json(errorResponse('Authentication failed', 401));
        }

        // Generate tokens
        const accessToken = generateToken({ userId: user._id, email: user.email });
        const refreshToken = generateRefreshToken({ userId: user._id });

        res.json(
            successResponse(
                {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        isOnboarded: user.isOnboarded,
                        profileComplete: user.profileComplete,
                        coupleId: user.coupleId
                    },
                    accessToken,
                    refreshToken
                },
                'Login successful'
            )
        );
    } catch (error) {
        console.error('Google callback error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Refresh token
 */
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json(errorResponse('Refresh token is required', 400));
        }

        const { verifyToken } = require('@closeus/utils');
        const decoded = verifyToken(refreshToken);

        if (!decoded) {
            return res.status(401).json(errorResponse('Invalid refresh token', 401));
        }

        // Generate new access token
        const accessToken = generateToken({
            userId: decoded.userId,
            email: decoded.email
        });

        res.json(successResponse({ accessToken }, 'Token refreshed'));
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Verify token
 */
exports.verifyToken = async (req, res) => {
    try {
        const { verifyToken } = require('@closeus/utils');
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json(errorResponse('No token provided', 401));
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json(errorResponse('Invalid token', 401));
        }

        const user = await User.findById(decoded.userId).select('-__v');

        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        res.json(successResponse({ user, decoded }, 'Token is valid'));
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Logout
 */
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json(errorResponse('Logout failed', 500));
        }
        res.json(successResponse(null, 'Logged out successfully'));
    });
};
