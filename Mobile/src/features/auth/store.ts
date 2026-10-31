import { create } from 'zustand';
import { User } from '../../types/entities';
import { SecureStorage } from '../../services/secure-storage';
import { STORAGE_KEYS } from '../../lib/constants';
import { authApi } from './api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRestoringSession: boolean;

  // Actions
  setSession: (token: string, user: User, refreshToken?: string) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  restoreSession: () => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  isRestoringSession: true,

  setSession: async (token: string, user: User, refreshToken?: string) => {
    await SecureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    await SecureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    if (refreshToken) {
      await SecureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    set({
      accessToken: token,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  updateUser: (partialUser: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...partialUser };
    set({ user: updated });
    SecureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updated)).catch((err) =>
      console.warn('Failed to persist updated user:', err)
    );
  },

  restoreSession: async () => {
    set({ isRestoringSession: true });
    try {
      const token = await SecureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const userJson = await SecureStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (!token || !userJson) {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isRestoringSession: false,
        });
        return false;
      }

      const cachedUser: User = JSON.parse(userJson);
      set({
        accessToken: token,
        user: cachedUser,
        isAuthenticated: true,
      });

      // Silently refresh user profile in background
      authApi
        .getMe()
        .then((res) => {
          if (res?.data) {
            set({ user: res.data });
            SecureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.data));
          }
        })
        .catch((err) => {
          console.warn('[AuthStore] Failed to revalidate user on startup:', err);
        });

      set({ isRestoringSession: false });
      return true;
    } catch (error) {
      console.warn('[AuthStore] Session restore failed:', error);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isRestoringSession: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout().catch(() => {});
    } finally {
      await SecureStorage.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
      await SecureStorage.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
      await SecureStorage.deleteItem(STORAGE_KEYS.USER_DATA);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
