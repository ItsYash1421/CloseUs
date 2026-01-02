const User = require('../models/User');
const { successResponse, errorResponse } = require('@closeus/utils');

/**
 * Get current user profile
 */
exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId; // from auth middleware

        const user = await User.findById(userId).select('-__v').populate('coupleId');

        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        res.json(successResponse({ user }, 'User retrieved successfully'));
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Update user profile (onboarding data)
 */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, dob, relationshipStatus, partnerName, livingStyle, anniversary } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (dob) updateData.dob = new Date(dob);
        if (relationshipStatus) updateData.relationshipStatus = relationshipStatus;
        if (partnerName) updateData.partnerName = partnerName;
        if (livingStyle) updateData.livingStyle = livingStyle;
        if (anniversary) updateData.anniversary = new Date(anniversary);

        // Check if profile is complete
        const user = await User.findById(userId);
        if (user && dob && relationshipStatus && partnerName && livingStyle && anniversary) {
            updateData.profileComplete = true;
            updateData.isOnboarded = true;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!updatedUser) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        res.json(successResponse({ user: updatedUser }, 'Profile updated successfully'));
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};

/**
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-__v');

        if (!user) {
            return res.status(404).json(errorResponse('User not found', 404));
        }

        res.json(successResponse({ user }, 'User retrieved successfully'));
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json(errorResponse('Internal server error', 500));
    }
};
