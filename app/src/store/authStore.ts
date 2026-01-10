import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthTokens } from '../types';
import authService from '../services/authService';
import { getErrorMessage } from '../utils/errorHandler';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    login: () => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => Promise<void>;
    checkAuth: () => Promise<void>;
    completeOnboarding: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,
            error: null,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            login: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const { user, tokens } = await authService.googleSignIn();
                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    set({ isLoading: false, error: getErrorMessage(error) });
                    throw error;
                }
            },

            logout: () => {
                // Clear state immediately (synchronous)
                set({ user: null, isAuthenticated: false, error: null });

                // Do async cleanup in background without blocking
                (async () => {
                    try {
                        await authService.logout();

                        // Clear couple data too
                        const { useCoupleStore } = await import('./coupleStore');
                        useCoupleStore.getState().clearCouple();
                    } catch (error: any) {
                        console.error('Logout cleanup error:', error);
                    }
                })();
            },

            updateUser: async (updates) => {
                const currentUser = get().user;
                if (currentUser) {
                    try {
                        // Update backend
                        const apiClient = (await import('../services/apiClient')).default;
                        await apiClient.put('/api/users/me', updates);

                        // Update local state
                        set({ user: { ...currentUser, ...updates } });
                    } catch (error) {
                        console.error('Update user error:', error);
                        // Still update local state
                        set({ user: { ...currentUser, ...updates } });
                    }
                }
            },

            checkAuth: async () => {
                try {
                    set({ isLoading: true });
                    const currentUser = get().user;

                    console.log('[AuthStore] checkAuth - Current user:', currentUser);

                    // Fix double-nested user data
                    if (currentUser && (currentUser as any).user) {
                        console.log('[AuthStore] Detected double-nested user, unwrapping...');
                        const unwrappedUser = (currentUser as any).user;
                        set({ user: unwrappedUser, isAuthenticated: true, isLoading: false });
                        console.log('[AuthStore] Unwrapped user:', unwrappedUser);
                        return;
                    }

                    if (currentUser) {
                        // User exists in storage, verify with backend
                        try {
                            const apiClient = (await import('../services/apiClient')).default;
                            const response: any = await apiClient.get('/api/users/me');
                            console.log('[AuthStore] Backend verification successful');
                            set({ user: response.data, isAuthenticated: true, isLoading: false });
                        } catch (error) {
                            console.log('[AuthStore] Backend verification failed, using cached user');
                            set({ isAuthenticated: true, isLoading: false });
                        }
                    } else {
                        console.log('[AuthStore] No user in storage');
                        set({ isAuthenticated: false, isLoading: false });
                    }
                } catch (error: any) {
                    console.error('[AuthStore] checkAuth error:', error);
                    set({ error: error.message, isLoading: false, isAuthenticated: false });
                }
            },

            completeOnboarding: async (data) => {
                const currentUser = get().user;
                if (currentUser) {
                    try {
                        // Update user on backend with onboarding data
                        const apiClient = (await import('../services/apiClient')).default;
                        await apiClient.put('/api/users/me', {
                            ...data,
                            isOnboardingComplete: true,
                        });

                        // Update local state
                        set({
                            user: {
                                ...currentUser,
                                ...data,
                                isOnboardingComplete: true,
                            },
                        });
                    } catch (error) {
                        console.error('Complete onboarding error:', error);
                        // Still update local state even if API call fails
                        set({
                            user: {
                                ...currentUser,
                                ...data,
                                isOnboardingComplete: true,
                            },
                        });
                    }
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            version: 1, // Increment to clear old corrupted data
            migrate: (persistedState: any, version: number) => {
                console.log('[AuthStore] Migrating from version', version);
                // If old version, clear everything and start fresh
                if (version < 1) {
                    console.log('[AuthStore] Clearing old corrupted data');
                    return {
                        user: null,
                        isAuthenticated: false,
                        isLoading: true,
                        error: null,
                    };
                }
                return persistedState;
            },
        }
    )
);

