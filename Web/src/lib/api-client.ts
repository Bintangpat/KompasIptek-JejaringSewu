import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getErrorMessage } from "./error-mapping";
import { ApiResponse, ApiError } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// Zero-Trust: In-Memory Access Token (Anti-XSS, never persisted in localStorage)
let inMemoryAccessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach Bearer Token & Auto-Generate Idempotency-Key on mutations
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (inMemoryAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }

    // Attach Idempotency-Key for mutating HTTP methods if not explicitly provided
    const method = config.method?.toUpperCase();
    if (
      (method === "POST" || method === "PATCH" || method === "PUT" || method === "DELETE") &&
      config.headers &&
      !config.headers["X-Idempotency-Key"]
    ) {
      try {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          config.headers["X-Idempotency-Key"] = crypto.randomUUID();
        }
      } catch {
        // Fallback random string
        config.headers["X-Idempotency-Key"] = `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Single-Flight Silent Refresh Mutex & Envelope Unwrapping
apiClient.interceptors.response.use(
  (response) => {
    // If wrapped in standard envelope { success, data, ... }, return data directly
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data ?? response;
  },
  async (error: AxiosError<{ success?: boolean; errorCode?: string; message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized with Silent Refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
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
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.accessToken;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          processQueue(null, newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          processQueue(new Error("Refresh token failed to return new access token"), null);
          return Promise.reject(error);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setAccessToken(null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // Enrich error with human-friendly message & preservation of errorCode
    const errorCode = error.response?.data?.errorCode;
    const backendMessage = error.response?.data?.message || error.message;
    const humanMessage = getErrorMessage(errorCode, backendMessage);

    const customError = new Error(humanMessage) as Error & {
      errorCode?: string;
      statusCode?: number;
      originalError?: AxiosError;
    };
    customError.errorCode = errorCode;
    customError.statusCode = error.response?.status;
    customError.originalError = error;

    return Promise.reject(customError);
  }
);

// Typed API Helper Methods
export const api = {
  get: <T = any>(url: string, params?: Record<string, any>): Promise<T> =>
    apiClient.get(url, { params }) as unknown as Promise<T>,

  post: <T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<T> =>
    apiClient.post(url, data, { headers }) as unknown as Promise<T>,

  patch: <T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<T> =>
    apiClient.patch(url, data, { headers }) as unknown as Promise<T>,

  put: <T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<T> =>
    apiClient.put(url, data, { headers }) as unknown as Promise<T>,

  delete: <T = any>(url: string, params?: Record<string, any>): Promise<T> =>
    apiClient.delete(url, { params }) as unknown as Promise<T>,
};
