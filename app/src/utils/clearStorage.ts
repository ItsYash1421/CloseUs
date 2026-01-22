import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clear all AsyncStorage data
 * Use this to reset the app completely
 */
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('[Storage] All AsyncStorage data cleared');
    return true;
  } catch (error) {
    console.error('[Storage] Error clearing AsyncStorage:', error);
    return false;
  }
};

/**
 * Clear specific storage keys
 */
export const clearAuthStorage = async () => {
  try {
    await AsyncStorage.removeItem('auth-storage');
    await AsyncStorage.removeItem('couple-storage');
    console.log('[Storage] Auth and couple storage cleared');
    return true;
  } catch (error) {
    console.error('[Storage] Error clearing storage:', error);
    return false;
  }
};
