import { apiClient } from './apiClient';

interface NotificationPreferences {
    pushEnabled: boolean;
    dailyReminders: boolean;
    partnerActivity: boolean;
    messages: boolean;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const preferencesService = {
    /**
     * Get user's notification preferences
     */
    getNotificationPreferences: async (): Promise<NotificationPreferences | null> => {
        try {
            const response = await apiClient.get<ApiResponse<NotificationPreferences>>('/api/users/preferences/notifications');
            return (response as any).data || response;
        } catch (error) {
            console.error('Failed to get notification preferences:', error);
            // Return defaults if API fails
            return {
                pushEnabled: true,
                dailyReminders: true,
                partnerActivity: true,
                messages: true,
            };
        }
    },

    /**
     * Update user's notification preferences
     */
    updateNotificationPreferences: async (
        prefs: NotificationPreferences
    ): Promise<NotificationPreferences | null> => {
        try {
            const response = await apiClient.put<ApiResponse<NotificationPreferences>>('/api/users/preferences/notifications', prefs);
            return (response as any).data || response;
        } catch (error) {
            console.error('Failed to update notification preferences:', error);
            throw error;
        }
    },
};
