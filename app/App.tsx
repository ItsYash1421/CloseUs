import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BackHandler, Alert } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import notificationService from './src/services/notificationService';
import userStateNotificationService from './src/services/userStateNotificationService';
import reminderService from './src/services/reminderService';
import dailyNotificationScheduler from './src/services/dailyNotificationScheduler';
import { useAuthStore } from './src/store/authStore';
import { useCoupleStore } from './src/store/coupleStore';
import apiClient from './src/services/apiClient';
import { NetworkLoggerButton } from './src/components/NetworkLoggerButton';

function App() {
  const user = useAuthStore(state => state.user);
  const couple = useCoupleStore(state => state.couple);
  const partner = useCoupleStore(state => state.partner);

  // Handle notification that opened the app (cold start)
  useEffect(() => {
    const handleInitialNotification = async () => {
      // Wait a bit for navigation to be ready
      setTimeout(async () => {
        const initialData = await notificationService.getInitialNotification();

        if (initialData && initialData.screen) {
          console.log('Navigating to screen from initial notification:', initialData.screen);

          // Import navigation service and navigate
          const { navigate } = await import('./src/services/navigationService');
          navigate(initialData.screen, initialData.params);
        }
      }, 1000); // Wait 1 second for app to be ready
    };

    handleInitialNotification();
  }, []);

  useEffect(() => {
    // Initialize notification system
    const initNotifications = async () => {
      try {
        // Initialize and get FCM token
        const token = await notificationService.initialize();
        console.log('FCM Token:', token);

        // Send token to backend if user is logged in
        if (token && user?._id) {
          try {
            await apiClient.post('/api/users/update-push-token', { token });
            console.log('Push token updated on backend');
          } catch (error) {
            console.error('Failed to update push token:', error);
          }
        }

        // Schedule notifications based on user state
        if (!user) {
          // Not logged in - send login reminders
          console.log('User not logged in - scheduling login reminders');
          await userStateNotificationService.scheduleForNotLoggedIn();
        } else if (!couple) {
          // Logged in but not paired - send pairing reminders
          console.log('User not paired - scheduling pairing reminders');
          await userStateNotificationService.scheduleForNotPaired();
        } else if (partner) {
          // Paired - send engagement reminders + special occasions
          console.log('User paired - scheduling all reminders');

          // Daily engagement reminders
          await userStateNotificationService.scheduleForPaired(partner.name || 'Partner');

          // Special occasion reminders (birthday, anniversary, etc.)
          const partnerBirthday = partner.dob ? new Date(partner.dob) : new Date();
          const anniversary = couple.startDate ? new Date(couple.startDate) : new Date();

          await reminderService.scheduleAllReminders(
            partnerBirthday,
            anniversary,
            partner.name || 'Partner'
          );

          console.log('All reminders scheduled successfully');
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initNotifications();

    // Start daily notification scheduler
    dailyNotificationScheduler.start();

    return () => {
      // Cleanup on unmount
      dailyNotificationScheduler.stop();
    };
  }, [user, couple, partner]);

  // Clear badge when app is opened
  useEffect(() => {
    notificationService.clearBadge();
  }, []);

  // Android back button handler
  useEffect(() => {
    const backAction = () => {
      const isLoggedIn = useAuthStore.getState().isAuthenticated;
      const isPaired = useCoupleStore.getState().couple !== null;

      // If user is logged in and paired, show exit confirmation
      if (isLoggedIn && isPaired) {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: true }
        );
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <NetworkLoggerButton />
    </SafeAreaProvider>
  );
}

export default App;
