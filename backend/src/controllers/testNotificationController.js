const notificationService = require('../services/notificationService');
const { successResponse, errorResponse } = require('../utils');

/**
 * Test notification endpoint - send to specific FCM token
 */
const testNotification = async (req, res) => {
    try {
        const { token, title, body } = req.body;

        if (!token) {
            return res.status(400).json(errorResponse('FCM token required', 400));
        }

        const notifTitle = title || 'Test Notification 🚀';
        const notifBody = body || 'This is a test notification from CloseUs backend!';

        await notificationService.sendPushNotification(
            token,
            notifTitle,
            notifBody,
            {
                type: 'test',
                screen: 'Home',
                timestamp: Date.now().toString(),
            }
        );

        res.json(successResponse(
            { sent: true, token, title: notifTitle, body: notifBody },
            'Test notification sent successfully'
        ));
    } catch (error) {
        console.error('Test notification error:', error);
        res.status(500).json(errorResponse(error.message || 'Failed to send test notification'));
    }
};

module.exports = {
    testNotification,
};
