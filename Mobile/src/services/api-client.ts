import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as Crypto from 'expo-crypto';
import { API_BASE_URL, STORAGE_KEYS } from '../lib/constants';
import { SecureStorage } from './secure-storage';
import { ApiErrorResponse } from '../types/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`);

    // 1. Inject Access Token
    const accessToken = await SecureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // 2. Inject Idempotency-Key on mutations
    const mutationMethods = ['post', 'put', 'patch', 'delete'];
    if (
      config.method &&
      mutationMethods.includes(config.method.toLowerCase()) &&
      !config.headers['X-Idempotency-Key']
    ) {
      config.headers['X-Idempotency-Key'] = Crypto.randomUUID();
    }

    // 3. Inject Device ID
    let deviceId = await SecureStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (!deviceId) {
      deviceId = `mobile_${Crypto.randomUUID().substring(0, 8)}`;
      await SecureStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
    }
    if (config.headers) {
      config.headers['X-Device-Id'] = deviceId;
    }

    return config;
  },
  (error) => {
    console.error('[API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor with Token Refresh Logic
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE ${response.status}] ${response.config.url}`);
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    console.warn(
      `[API RESPONSE ERROR] ${error.config?.url} ->`,
      error.message,
      error.response?.status,
      error.response?.data
    );

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and request hasn't been retried yet, and it's not the refresh/login endpoint
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call backend refresh endpoint
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Cookie: `jejaring_pringsewu=${refreshToken}`,
            },
          }
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.accessToken;

        if (newAccessToken) {
          await SecureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh response missing access token');
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        // Clean session on failure
        await SecureStorage.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
        await SecureStorage.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
