import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'jejaring_sewu_access_token',
  REFRESH_TOKEN: 'jejaring_sewu_refresh_token',
  USER_DATA: 'jejaring_sewu_user_data',
  DEVICE_ID: 'jejaring_sewu_device_id',
  ACTIVE_COMMUTER_ROUTE_ID: 'jejaring_sewu_active_commuter_route_id',
  OFFLINE_MUTATION_QUEUE: 'jejaring_sewu_offline_queue',
  ONBOARDING_COMPLETED: 'jejaring_sewu_onboarding_completed',
} as const;

export const SecureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`[SecureStorage] Error getting item for key ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`[SecureStorage] Error setting item for key ${key}:`, error);
    }
  },

  async deleteItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`[SecureStorage] Error deleting item for key ${key}:`, error);
    }
  },
};
