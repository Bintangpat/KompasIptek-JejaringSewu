import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import * as Crypto from "expo-crypto";
import { Config } from "@/constants/Config";
import { SecureStorage, STORAGE_KEYS } from "@/services/secure-storage";

export async function getOrCreateDeviceId(): Promise<string> {
  let deviceId = await SecureStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = `mobile_${Crypto.randomUUID().substring(0, 8)}`;
    await SecureStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Menempelkan Bearer Access Token, Device ID, & Idempotency Key
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // 1. Inject Access Token
      const token = await SecureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 2. Inject Device ID
      const deviceId = await getOrCreateDeviceId();
      if (config.headers) {
        config.headers['X-Device-Id'] = deviceId;
      }

      // 3. Inject Idempotency-Key on mutations jika belum ada
      const mutationMethods = ['post', 'put', 'patch', 'delete'];
      if (
        config.method &&
        mutationMethods.includes(config.method.toLowerCase()) &&
        config.headers &&
        !config.headers['x-idempotency-key'] &&
        !config.headers['X-Idempotency-Key']
      ) {
        config.headers['X-Idempotency-Key'] = Crypto.randomUUID();
      }
    } catch (e) {
      // Abaikan jika SecureStorage gagal di web/emulator fallback
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unpack JSON Envelope & Automatic Refresh Token on 401
apiClient.interceptors.response.use(
  (response) => {
    // Unpack NestJS TransformInterceptor: { success: true, data: ... }
    if (response.data && response.data.data !== undefined) {
      return response.data;
    }
    return response;
  },
  async (error: AxiosError<{ success?: boolean; errorCode?: string; message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const refreshRes = await axios.post(`${Config.API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const newAccessToken = refreshRes.data?.data?.accessToken;
          const newRefreshToken = refreshRes.data?.data?.refreshToken;

          if (newAccessToken) {
            await SecureStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
            if (newRefreshToken) {
              await SecureStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
            }

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return apiClient(originalRequest);
          }
        }
      } catch (refreshErr) {
        // Refresh token hangus/expired
        await SecureStorage.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
        await SecureStorage.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
        await SecureStorage.deleteItem(STORAGE_KEYS.USER_DATA);
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Gagal terhubung ke server Pekon. Periksa koneksi internet Anda.";

    return Promise.reject(new Error(message));
  }
);
