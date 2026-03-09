import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types';

// Cache keys
const CACHE_KEYS = {
  messages: (coupleId: string) => `messages_${coupleId}`,
  lastSync: (coupleId: string) => `last_sync_${coupleId}`,
};

export const chatCache = {
  // Save messages to cache
  saveMessages: (coupleId: string, messages: Message[]) => {
    try {
      // Make it fire-and-forget (don't await)
      AsyncStorage.setItem(
        CACHE_KEYS.messages(coupleId),
        JSON.stringify(messages),
      );
      AsyncStorage.setItem(
        CACHE_KEYS.lastSync(coupleId),
        new Date().toISOString(),
      );
    } catch (error) {
      console.error('Failed to save messages to cache:', error);
    }
  },

  // Get cached messages (use async for AsyncStorage)
  getCachedMessages: async (coupleId: string): Promise<Message[]> => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEYS.messages(coupleId));
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to get cached messages:', error);
      return [];
    }
  },

  // Add single message to cache
  addMessageToCache: (coupleId: string, message: Message) => {
    try {
      // Fire-and-forget async operation
      (async () => {
        const cached = await chatCache.getCachedMessages(coupleId);
        const updated = [message, ...cached];
        const trimmed = updated.slice(0, 500);
        await AsyncStorage.setItem(
          CACHE_KEYS.messages(coupleId),
          JSON.stringify(trimmed),
        );
      })();
    } catch (error) {
      console.error('Failed to add message to cache:', error);
    }
  },

  // Get last sync time
  getLastSync: async (coupleId: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(CACHE_KEYS.lastSync(coupleId));
    } catch (error) {
      return null;
    }
  },

  // Clear cache for couple
  clearCache: async (coupleId: string) => {
    try {
      await AsyncStorage.removeItem(CACHE_KEYS.messages(coupleId));
      await AsyncStorage.removeItem(CACHE_KEYS.lastSync(coupleId));
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  },
};
