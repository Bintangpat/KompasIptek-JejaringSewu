import { apiClient } from '../../services/api-client';
import { ApiResponse } from '../../types/api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SendOtpRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  GoogleLoginRequest,
} from './types';
import { User, Pekon } from '../../types/entities';
import { SecureStorage } from '../../services/secure-storage';
import { STORAGE_KEYS } from '../../lib/constants';
import * as Crypto from 'expo-crypto';

async function getOrCreateDeviceId(): Promise<string> {
  let deviceId = await SecureStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!deviceId) {
    deviceId = `mobile_${Crypto.randomUUID().substring(0, 8)}`;
    await SecureStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);
  }
  return deviceId;
}

export const authApi = {
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const deviceId = payload.deviceId || (await getOrCreateDeviceId());
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
      ...payload,
      deviceId,
    });
    return res.data;
  },

  async register(payload: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    const res = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', payload);
    return res.data;
  },

  async googleLogin(payload: GoogleLoginRequest): Promise<ApiResponse<LoginResponse>> {
    const deviceId = payload.deviceId || (await getOrCreateDeviceId());
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/google', {
      ...payload,
      deviceId,
    });
    return res.data;
  },

  async sendOtp(payload: SendOtpRequest): Promise<ApiResponse<{ message: string }>> {
    const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/otp/send', payload);
    return res.data;
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<ApiResponse<{ valid: boolean }>> {
    const res = await apiClient.post<ApiResponse<{ valid: boolean }>>('/auth/otp/verify', payload);
    return res.data;
  },

  async forgotPassword(identifier: string): Promise<ApiResponse<{ message: string }>> {
    const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/password/forgot', {
      identifier,
    });
    return res.data;
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/password/reset', payload);
    return res.data;
  },

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const res = await apiClient.post<ApiResponse<{ message: string }>>('/auth/logout');
    return res.data;
  },

  async getMe(): Promise<ApiResponse<User>> {
    const res = await apiClient.get<ApiResponse<User>>('/users/me');
    return res.data;
  },

  async getPekons(): Promise<ApiResponse<Pekon[]>> {
    const res = await apiClient.get<ApiResponse<Pekon[]>>('/pekon');
    return res.data;
  },
};
