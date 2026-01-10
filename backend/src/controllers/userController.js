const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils');

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('coupleId');

        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        res.json(successResponse(user));
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const allowedUpdates = [
            'name', 'dob', 'relationshipStatus',
            'livingStyle', 'anniversary', 'partnerName',
            'photoUrl', 'pushToken'
        ];

        // Filter allowed updates
        const safeUpdates = {};
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                safeUpdates[key] = updates[key];
            }
        });

        // Check if onboarding is complete
        // Simple logic: if name, dob, status, anniversary are present
        if (!req.user?.isOnboardingComplete) {
            const user = await User.findById(req.userId);
            const merged = { ...user.toObject(), ...safeUpdates };

            if (merged.name && merged.dob && merged.relationshipStatus && merged.anniversary) {
                safeUpdates.isOnboardingComplete = true;
            }
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            safeUpdates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        res.json(successResponse(user, 'Profile updated'));
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Update push token
 */
const updatePushToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json(errorResponse('Token required', 400));
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { pushToken: token },
            { new: true }
        );

        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        res.json(successResponse(null, 'Push token updated'));
    } catch (error) {
        console.error('Update push token error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-email -googleId');
        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }
        res.json(successResponse(user));
    } catch (error) {
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Complete onboarding - Single API call with all data
 */
const completeOnboarding = async (req, res) => {
    try {
        const {
            gender,
            name,
            photoUrl,
            dob,
            relationshipStatus,
            livingStyle,
            anniversary,
            partnerName
        } = req.body;

        // Validate required fields
        if (!gender || !name || !dob || !relationshipStatus || !livingStyle || !anniversary || !partnerName) {
            return res.status(400).json(errorResponse('All fields are required', 400));
        }

        // Update user with all onboarding data
        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                gender,
                name,
                photoUrl,
                dob: new Date(dob),
                relationshipStatus,
                livingStyle,
                anniversary: new Date(anniversary),
                partnerName,
                isOnboardingComplete: true
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        res.json(successResponse({ user }, 'Onboarding completed successfully'));
    } catch (error) {
        console.error('Complete onboarding error:', error);
        res.status(500).json(errorResponse(error.message || 'Internal server error'));
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updatePushToken,
    getUserById,
    completeOnboarding
};
