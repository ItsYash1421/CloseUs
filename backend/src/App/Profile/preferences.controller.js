const User = require('../../models/User');

/**
 * Get notification preferences for the authenticated user
 */
exports.getNotificationPreferences = async (req, res) => {
    try {
        console.log('[Preferences] Getting preferences for user:', req.user?.userId);
        const user = await User.findById(req.user.userId).select('notificationPreferences');

        if (!user) {
            console.log('[Preferences] User not found:', req.user?.userId);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Return default preferences if not set
        const preferences = user.notificationPreferences || {
            pushEnabled: true,
            dailyReminders: true,
            partnerActivity: true,
            messages: true
        };

        console.log('[Preferences] Returning preferences:', preferences);
        res.json({
            success: true,
            data: preferences
        });
    } catch (error) {
        console.error('Error getting notification preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get notification preferences'
        });
    }
};


/**
 * Update notification preferences for the authenticated user
 */
exports.updateNotificationPreferences = async (req, res) => {
    try {
        const { pushEnabled, dailyReminders, partnerActivity, messages } = req.body;
        console.log('[Preferences] Updating preferences for user:', req.user?.userId, req.body);

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                notificationPreferences: {
                    pushEnabled: pushEnabled ?? true,
                    dailyReminders: dailyReminders ?? true,
                    partnerActivity: partnerActivity ?? true,
                    messages: messages ?? true
                }
            },
            { new: true, runValidators: true }
        ).select('notificationPreferences');

        if (!user) {
            console.log('[Preferences] User not found for update:', req.user?.userId);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('[Preferences] Updated preferences:', user.notificationPreferences);
        res.json({
            success: true,
            data: user.notificationPreferences,
            message: 'Notification preferences updated successfully'
        });
    } catch (error) {
        console.error('Error updating notification preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update notification preferences'
        });
    }
};
