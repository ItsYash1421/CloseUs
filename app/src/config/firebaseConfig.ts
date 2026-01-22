import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

/**
 * Firebase Configuration and Initialization
 * Note: Firebase is auto-initialized on Android via google-services.json
 * This file provides helper functions and configuration
 */

// Firebase project configuration (from google-services.json)
export const FIREBASE_CONFIG = {
  projectId: 'closeus-cdeef',
  projectNumber: '679581555584',
  storageBucket: 'closeus-cdeef.firebasestorage.app',
  apiKey: 'AIzaSyAgC9mvRo8t37Xk1UapCaMLdH3GWYDPcuc',
  appId: '1:679581555584:android:e04cb45442b92b60f13f65',
};

/**
 * Request permission for push notifications
 * @returns Promise<boolean> - true if permission granted
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted:', authStatus);
    } else {
      console.log('Notification permission denied');
    }

    return enabled;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Get FCM token for push notifications
 * @returns Promise<string | null> - FCM token or null if failed
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

/**
 * Initialize Firebase Cloud Messaging
 * Sets up foreground and background message handlers
 */
export function initializeFirebaseMessaging() {
  // Handle foreground messages
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage);
    // You can show a local notification here using Notifee
  });

  // Handle background messages
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message received:', remoteMessage);
  });

  // Handle notification opened app
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification opened app:', remoteMessage);
    // Handle navigation based on notification data
  });

  // Check if app was opened from a notification (cold start)
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'App opened from quit state by notification:',
          remoteMessage,
        );
        // Handle navigation based on notification data
      }
    });
}

export default {
  FIREBASE_CONFIG,
  requestNotificationPermission,
  getFCMToken,
  initializeFirebaseMessaging,
};
