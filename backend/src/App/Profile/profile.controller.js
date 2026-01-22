const User = require('../../models/User');
const { successResponse, errorResponse } = require('../../Shared/Utils');

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
            'photoUrl', 'pushToken', 'isDefaultAvatar'
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

        // Sync shared fields to Couple model if user is paired
        if (user.coupleId && (safeUpdates.relationshipStatus || safeUpdates.livingStyle || safeUpdates.anniversary)) {
            const Couple = require('../../models/Couple');
            const coupleUpdates = {};

            if (safeUpdates.relationshipStatus) coupleUpdates.relationshipStatus = safeUpdates.relationshipStatus;
            if (safeUpdates.livingStyle) coupleUpdates.livingStyle = safeUpdates.livingStyle;
            if (safeUpdates.anniversary) coupleUpdates.startDate = safeUpdates.anniversary; // Map anniversary to startDate

            await Couple.findByIdAndUpdate(user.coupleId, coupleUpdates);
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

/**
 * Update user's lastActive timestamp (heartbeat)
 */
const heartbeat = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.userId,
            { lastActive: new Date() },
            { new: true }
        );

        res.json(successResponse(null, 'Heartbeat updated'));
    } catch (error) {
        console.error('Heartbeat error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

/**
 * Get partner's online status
 */
const getPartnerStatus = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('coupleId');

        if (!user || !user.coupleId) {
            return res.status(404).json(errorResponse('Not paired yet', 404));
        }

        const couple = user.coupleId;
        const partnerId = couple.partner1Id.toString() === req.userId
            ? couple.partner2Id
            : couple.partner1Id;

        const partner = await User.findById(partnerId).select('name photoUrl lastActive');

        if (!partner) {
            return res.status(404).json(errorResponse('Partner not found', 404));
        }

        let isOnline = partner.isOnline;
        let lastActive = partner.lastActive;

        // Special logic for Dev Partner: Toggle online/offline every 5 minutes
        // 0-5: Online, 5-10: Offline, 10-15: Online, etc.
        if (partner.name === 'Dev Partner') {
            const currentMinute = new Date().getMinutes();
            const isOnlineInterval = Math.floor(currentMinute / 5) % 2 === 0;

            if (isOnlineInterval) {
                isOnline = true;
                lastActive = new Date();
            } else {
                isOnline = false;
                lastActive = new Date(Date.now() - 15 * 60 * 1000); // 15 mins ago
            }
        }

        res.json(successResponse({
            name: partner.name,
            photoUrl: partner.photoUrl,
            isOnline: isOnline,
            lastActive: lastActive
        }));
    } catch (error) {
        console.error('Get partner status error:', error);
        res.status(500).json(errorResponse('Internal server error'));
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updatePushToken,
    getUserById,
    completeOnboarding,
    heartbeat,
    getPartnerStatus
};
