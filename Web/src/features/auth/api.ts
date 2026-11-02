import { api, setAccessToken } from "@/lib/api-client";
import {
  LoginPayload,
  RegisterPayload,
  OtpSendPayload,
  OtpVerifyPayload,
  OtpResponseResult,
  AuthSuccessResult,
} from "./types";

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthSuccessResult> => {
    const data = await api.post<AuthSuccessResult>("/auth/login", payload);
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
    }
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthSuccessResult> => {
    const data = await api.post<AuthSuccessResult>("/auth/register", payload);
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
    }
    return data;
  },

  sendOtp: async (payload: OtpSendPayload): Promise<OtpResponseResult> => {
    return api.post<OtpResponseResult>("/auth/otp/send", payload);
  },

  verifyOtp: async (payload: OtpVerifyPayload): Promise<OtpResponseResult> => {
    return api.post<OtpResponseResult>("/auth/otp/verify", payload);
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout", {});
    } finally {
      setAccessToken(null);
    }
  },
};
