import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  EventType,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
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
    // Handle foreground notification press
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notification pressed:', detail.notification);
        this.handleNotificationPress(detail.notification?.data);
      }
    });

    // Handle background notification press
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Background notification pressed:', detail.notification);
        this.handleNotificationPress(detail.notification?.data);
      }
    });
  }

  // Get notification that opened the app (cold start)
  async getInitialNotification() {
    try {
      // Check if app was opened by notification
      const initialNotification = await notifee.getInitialNotification();

      if (initialNotification) {
        console.log('App opened from notification:', initialNotification);
        return initialNotification.notification?.data;
      }

      // Also check FCM initial notification
      const fcmInitial = await messaging().getInitialNotification();
      if (fcmInitial) {
        console.log('App opened from FCM notification:', fcmInitial);
        return fcmInitial.data;
      }

      return null;
    } catch (error) {
      console.error('Error getting initial notification:', error);
      return null;
    }
  }

  async displayNotification(title: string, body: string, data?: any) {
    // Generate unique ID based on title, body, and timestamp
    const notificationId = `${title}-${body}-${Date.now()}`;

    // Check if this notification was recently shown (within last 5 seconds)
    const lastShownKey = `last_notification_${title}_${body}`;
    const lastShown = await AsyncStorage.getItem(lastShownKey);
    const now = Date.now();

    if (lastShown && now - parseInt(lastShown) < 5000) {
      console.log('Duplicate notification blocked:', title);
      return; // Skip duplicate
    }

    // Store timestamp
    await AsyncStorage.setItem(lastShownKey, now.toString());

    await notifee.displayNotification({
      id: notificationId,
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

    console.log('Handling notification press:', { type, screen, params });

    // Import navigation service dynamically to avoid circular dependency
    import('./navigationService')
      .then(({ navigate }) => {
        if (screen) {
          // Tab screens need to navigate to MainTabs first
          const tabScreens = ['Home', 'Chat', 'Questions', 'Games', 'Profile'];

          if (tabScreens.includes(screen)) {
            // Navigate to MainTabs with nested screen
            navigate('MainTabs', {
              screen: screen,
              params: params,
            });
            console.log(`Navigated to MainTabs -> ${screen}`);
          } else {
            // Direct navigation for non-tab screens
            navigate(screen, params);
            console.log(`Navigated to ${screen}`);
          }
        }
      })
      .catch(error => {
        console.error('Navigation error:', error);
        // Fallback: Store for later
        AsyncStorage.setItem(
          'pendingNavigation',
          JSON.stringify({ screen, params }),
        );
      });
  }

  // Schedule local notifications
  async scheduleNotification(
    id: string,
    title: string,
    body: string,
    date: Date,
    data?: any,
  ) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

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
          smallIcon: 'ic_launcher',
          color: '#FF6B9D',
        },
        ios: {
          sound: 'default',
        },
      },
      trigger,
    );
  }

  // Schedule daily repeating notification
  async scheduleDailyRepeatingNotification(
    id: string,
    title: string,
    body: string,
    hour: number,
    minute: number,
    data?: any,
  ) {
    const now = new Date();
    const triggerDate = new Date();
    triggerDate.setHours(hour, minute, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    await this.scheduleNotification(id, title, body, triggerDate, data);
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
