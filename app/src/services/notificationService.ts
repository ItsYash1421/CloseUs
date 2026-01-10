import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class NotificationService {
    private channelId = 'closeus-default';

    async initialize() {
        // Request permission
        await this.requestPermission();

        // Create notification channel (Android)
        if (Platform.OS === 'android') {
            await this.createChannel();
        }

        // Get FCM token
        const token = await this.getFCMToken();
        console.log('FCM Token:', token);

        // Listen for foreground messages
        this.setupForegroundHandler();

        // Listen for background messages
        this.setupBackgroundHandler();

        // Handle notification interactions
        this.setupNotificationHandler();

        return token;
    }

    async requestPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Notification permission granted');
        }
    }

    async createChannel() {
        await notifee.createChannel({
            id: this.channelId,
            name: 'CloseUs Notifications',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
        });
    }

    async getFCMToken() {
        try {
            const token = await messaging().getToken();
            await AsyncStorage.setItem('fcmToken', token);
            return token;
        } catch (error) {
            console.error('Error getting FCM token:', error);
            return null;
        }
    }

    setupForegroundHandler() {
        messaging().onMessage(async remoteMessage => {
            console.log('Foreground message:', remoteMessage);

            // Display notification using notifee
            await this.displayNotification(
                remoteMessage.notification?.title || 'New Message',
                remoteMessage.notification?.body || '',
                remoteMessage.data,
            );
        });
    }

    setupBackgroundHandler() {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Background message:', remoteMessage);

            await this.displayNotification(
                remoteMessage.notification?.title || 'New Message',
                remoteMessage.notification?.body || '',
                remoteMessage.data,
            );
        });
    }

    setupNotificationHandler() {
        notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS) {
                console.log('Notification pressed:', detail.notification);
                // Handle navigation based on notification data
                this.handleNotificationPress(detail.notification?.data);
            }
        });

        notifee.onBackgroundEvent(async ({ type, detail }) => {
            if (type === EventType.PRESS) {
                console.log('Background notification pressed:', detail.notification);
                this.handleNotificationPress(detail.notification?.data);
            }
        });
    }

    async displayNotification(title: string, body: string, data?: any) {
        await notifee.displayNotification({
            title,
            body,
            data,
            android: {
                channelId: this.channelId,
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                },
                smallIcon: 'ic_launcher', // Use default launcher icon
                color: '#FF6B9D',
            },
            ios: {
                sound: 'default',
                foregroundPresentationOptions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },
            },
        });
    }

    handleNotificationPress(data?: any) {
        if (!data) return;

        const { type, screen, params } = data;

        // Navigation will be handled by the app
        // Store the navigation intent
        AsyncStorage.setItem('pendingNavigation', JSON.stringify({ screen, params }));
    }

    // Schedule local notifications
    async scheduleNotification(
        id: string,
        title: string,
        body: string,
        date: Date,
        data?: any,
    ) {
        await notifee.createTriggerNotification(
            {
                id,
                title,
                body,
                data,
                android: {
                    channelId: this.channelId,
                    importance: AndroidImportance.HIGH,
                    pressAction: { id: 'default' },
                    smallIcon: 'ic_launcher', // Use default launcher icon
                    color: '#FF6B9D',
                },
                ios: {
                    sound: 'default',
                },
            },
            {
                type: 'timestamp' as any,
                timestamp: date.getTime(),
            },
        );
    }

    async cancelNotification(id: string) {
        await notifee.cancelNotification(id);
    }

    async cancelAllNotifications() {
        await notifee.cancelAllNotifications();
    }

    async getBadgeCount(): Promise<number> {
        if (Platform.OS === 'ios') {
            return await notifee.getBadgeCount();
        }
        return 0;
    }

    async setBadgeCount(count: number) {
        if (Platform.OS === 'ios') {
            await notifee.setBadgeCount(count);
        }
    }

    async incrementBadge() {
        const current = await this.getBadgeCount();
        await this.setBadgeCount(current + 1);
    }

    async clearBadge() {
        await this.setBadgeCount(0);
    }
}

export const notificationService = new NotificationService();
export default notificationService;
