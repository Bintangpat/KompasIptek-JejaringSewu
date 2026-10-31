import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getErrorMessage } from "./error-mapping";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// Zero-Trust: In-Memory Access Token (Anti-XSS, never persisted in localStorage)
let inMemoryAccessToken: string | null = "demo-mock-token";

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
});

// Request Interceptor: Attach In-Memory Bearer Token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (inMemoryAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Zero-Auth Mode: Session/Refresh Token disabled per user instruction
export const refreshAuthSession = async (): Promise<string | null> => {
  return "demo-mock-token";
};

// Response Interceptor: Standard JSON Envelope & graceful fallback
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data !== undefined) {
      return response.data;
    }
    return response;
  },
  async (error: AxiosError<{ success?: boolean; errorCode?: string; message?: string }>) => {
    const errorMsg = getErrorMessage(error.response?.data?.errorCode, error.response?.data?.message || error.message);
    return Promise.reject(new Error(errorMsg));
  }
);
