import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jejaring_access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standard JSON Envelope Unwrapping & Refresh Token on 401
apiClient.interceptors.response.use(
  (response) => {
    // If backend returns { success: true, data: ... }
    if (response.data && response.data.data !== undefined) {
      return response.data;
    }
    return response;
  },
  async (error: AxiosError<{ success?: boolean; errorCode?: string; message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying, try refresh token endpoint
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== "undefined") {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = refreshRes.data?.data?.accessToken;
        if (newToken) {
          localStorage.setItem("jejaring_access_token", newToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        // Refresh token expired or reuse detected
        localStorage.removeItem("jejaring_access_token");
        localStorage.removeItem("jejaring_user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login?session_expired=true";
        }
      }
    }

    const customMessage =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kendala komunikasi ke server.";

    return Promise.reject(new Error(customMessage));
  }
);
