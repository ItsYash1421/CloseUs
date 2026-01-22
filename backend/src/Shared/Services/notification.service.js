const admin = require('firebase-admin');

const initializeFirebase = () => {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }
};

// ------------------------------------------------------------------
// Send Push Notification
// ------------------------------------------------------------------
const sendPushNotification = async (token, title, body, data = {}) => {
    try {
        initializeFirebase();

        const message = {
            notification: {
                title,
                body,
            },
            data: {
                ...data,
                timestamp: Date.now().toString(),
            },
            token,
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    color: '#FF6B9D',
                    channelId: 'closeus-default',
                },
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
        };

        const response = await admin.messaging().send(message);
        console.log('Notification sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

// ------------------------------------------------------------------
// Send Message Notification
// ------------------------------------------------------------------
const sendMessageNotification = async (
    recipientToken,
    senderName,
    messageText,
    messageType = 'text'
) => {
    let body = messageText;

    if (messageType === 'image') {
        body = '📷 Sent a photo';
    } else if (messageType === 'voice') {
        body = '🎤 Sent a voice message';
    } else if (messageType === 'gif') {
        body = '🎬 Sent a GIF';
    }

    return sendPushNotification(recipientToken, `💬 ${senderName}`, body, {
        type: 'message',
        screen: 'Chat',
    });
};

// ------------------------------------------------------------------
// Send Typing Notification
// ------------------------------------------------------------------
const sendTypingNotification = async (recipientToken, senderName) => {
    return sendPushNotification(recipientToken, `${senderName} is typing...`, '', {
        type: 'typing',
        screen: 'Chat',
    });
};

// ------------------------------------------------------------------
// Send Daily Question Notification
// ------------------------------------------------------------------
const sendDailyQuestionNotification = async (tokens, questionText) => {
    const promises = tokens.map((token) =>
        sendPushNotification(token, '❓ New Daily Question!', questionText, {
            type: 'daily_question',
            screen: 'Questions',
        })
    );

    return Promise.allSettled(promises);
};

// ------------------------------------------------------------------
// Send Game Invitation
// ------------------------------------------------------------------
const sendGameInvitation = async (recipientToken, senderName, gameName) => {
    return sendPushNotification(
        recipientToken,
        `🎮 ${senderName} wants to play!`,
        `Join ${gameName} now`,
        {
            type: 'game_invitation',
            screen: 'Games',
        }
    );
};

// ------------------------------------------------------------------
// Send Answer Notification
// ------------------------------------------------------------------
const sendAnswerNotification = async (recipientToken, partnerName, questionText) => {
    return sendPushNotification(
        recipientToken,
        `💭 ${partnerName} answered!`,
        `See their answer to: ${questionText}`,
        {
            type: 'answer',
            screen: 'Questions',
        }
    );
};

// ------------------------------------------------------------------
// Send Bulk Notifications
// ------------------------------------------------------------------
const sendBulkNotifications = async (notifications) => {
    const promises = notifications.map(({ token, title, body, data }) =>
        sendPushNotification(token, title, body, data)
    );

    return Promise.allSettled(promises);
};

module.exports = {
    initializeFirebase,
    sendPushNotification,
    sendMessageNotification,
    sendTypingNotification,
    sendDailyQuestionNotification,
    sendGameInvitation,
    sendAnswerNotification,
    sendAnswerNotification,
    sendBulkNotifications,
};
