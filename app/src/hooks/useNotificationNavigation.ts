import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../services/notificationService';

export const useNotificationNavigation = () => {
    const navigation = useNavigation();

    useEffect(() => {
        // Check for pending navigation from notification
        const checkPendingNavigation = async () => {
            try {
                const pending = await AsyncStorage.getItem('pendingNavigation');
                if (pending) {
                    const { screen, params } = JSON.parse(pending);

                    // Small delay to ensure navigation is ready
                    setTimeout(() => {
                        navigation.navigate(screen as never, params as never);
                    }, 500);

                    // Clear pending navigation
                    await AsyncStorage.removeItem('pendingNavigation');
                }
            } catch (error) {
                console.error('Error checking pending navigation:', error);
            }
        };

        checkPendingNavigation();
    }, [navigation]);
};
