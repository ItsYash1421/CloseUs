import notificationService from './notificationService';

class UserStateNotificationService {
    /**
     * Schedule notifications for users who are not logged in
     * Sends 2 reminders per day to encourage login
     */
    async scheduleForNotLoggedIn() {
        try {
            // Morning: 9 AM
            await notificationService.scheduleDailyRepeatingNotification(
                'login-morning',
                '💕 CloseUs Awaits!',
                'Login to stay connected with your partner',
                9,
                0,
                { type: 'login', screen: 'Welcome' },
            );

            // Evening: 7 PM
            await notificationService.scheduleDailyRepeatingNotification(
                'login-evening',
                '🌙 Missing Your Partner?',
                'Login to CloseUs and send them a message',
                19,
                0,
                { type: 'login', screen: 'Welcome' },
            );
        } catch (error) {
            console.error('Error scheduling not-logged-in notifications:', error);
        }
    }

    /**
     * Schedule notifications for logged-in users who haven't paired yet
     * Sends daily reminder to pair with partner
     */
    async scheduleForNotPaired() {
        try {
            // Daily: 10 AM
            await notificationService.scheduleDailyRepeatingNotification(
                'pairing-reminder',
                '❤️ Find Your Partner!',
                'Pair with your partner to unlock all CloseUs features',
                10,
                0,
                { type: 'pairing', screen: 'CreateKey' },
            );
        } catch (error) {
            console.error('Error scheduling not-paired notifications:', error);
        }
    }

    /**
     * Schedule engagement notifications for paired users
     * Sends daily reminders to interact with partner
     */
    async scheduleForPaired(partnerName: string) {
        try {
            // Good Morning: 8 AM
            await notificationService.scheduleDailyRepeatingNotification(
                'good-morning',
                '☀️ Good Morning!',
                `Say good morning to ${partnerName} 💕`,
                8,
                0,
                { type: 'engagement', screen: 'Chat' },
            );

            // Partner Misses You: 2 PM
            await notificationService.scheduleDailyRepeatingNotification(
                'partner-misses',
                `💭 ${partnerName} Misses You!`,
                'Send them a message and make their day 💕',
                14,
                0,
                { type: 'engagement', screen: 'Chat' },
            );

            // Good Night: 9:30 PM
            await notificationService.scheduleDailyRepeatingNotification(
                'good-night',
                '🌙 Goodnight!',
                `Send ${partnerName} a sweet goodnight message 💤`,
                21,
                30,
                { type: 'engagement', screen: 'Chat' },
            );
        } catch (error) {
            console.error('Error scheduling paired notifications:', error);
        }
    }

    /**
     * Cancel all user-state notifications
     */
    async cancelAllStateNotifications() {
        const notificationIds = [
            'login-morning',
            'login-evening',
            'pairing-reminder',
            'good-morning',
            'partner-misses',
            'good-night',
        ];

        for (const id of notificationIds) {
            await notificationService.cancelNotification(id);
        }
    }

    /**
     * Update notifications based on current user state
     */
    async updateForUserState(isLoggedIn: boolean, isPaired: boolean, partnerName?: string) {
        // Cancel all existing state notifications first
        await this.cancelAllStateNotifications();

        if (!isLoggedIn) {
            await this.scheduleForNotLoggedIn();
        } else if (!isPaired) {
            await this.scheduleForNotPaired();
        } else if (partnerName) {
            await this.scheduleForPaired(partnerName);
        }
    }
}

export const userStateNotificationService = new UserStateNotificationService();
export default userStateNotificationService;
