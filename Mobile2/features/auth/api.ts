import { apiClient, getOrCreateDeviceId } from '@/services/api';
import { ApiResponse } from '@/types/api';
import { User, Pekon } from '@/types/entities';
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

// Fallback master pekon jika endpoint /pekon belum diekspos di backend
const FALLBACK_PEKONS: Pekon[] = [
  {
    id: '18.10.02.2001',
    kodeKemendagri: '18.10.02.2001',
    namaPekon: 'Pekon Pagelaran',
    kecamatan: 'Pagelaran',
    namaBumdes: 'BUMDes Mandiri Sejahtera Pagelaran',
    latitude: -5.3421,
    longitude: 104.9452,
  },
  {
    id: '18.10.01.1001',
    kodeKemendagri: '18.10.01.1001',
    namaPekon: 'Pringsewu Barat',
    kecamatan: 'Pringsewu',
    namaBumdes: 'BUMDes Karya Bersama Barat',
    latitude: -5.3587,
    longitude: 104.9741,
  },
  {
    id: '18.10.03.2001',
    kodeKemendagri: '18.10.03.2001',
    namaPekon: 'Pekon Gading Rejo',
    kecamatan: 'Gading Rejo',
    namaBumdes: 'BUMDes Berkah Gading Rejo',
    latitude: -5.3612,
    longitude: 105.0234,
  },
  {
    id: '18.10.04.2001',
    kodeKemendagri: '18.10.04.2001',
    namaPekon: 'Pekon Sukoharjo',
    kecamatan: 'Sukoharjo',
    namaBumdes: 'BUMDes Sukoharjo Maju',
    latitude: -5.2981,
    longitude: 104.9912,
  },
  {
    id: '18.10.05.2001',
    kodeKemendagri: '18.10.05.2001',
    namaPekon: 'Pekon Ambarawa',
    kecamatan: 'Ambarawa',
    namaBumdes: 'BUMDes Makmur Ambarawa',
    latitude: -5.4123,
    longitude: 104.9621,
  },
];

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const deviceId = payload.deviceId || (await getOrCreateDeviceId());
    const res: any = await apiClient.post('/auth/login', {
      ...payload,
      deviceId,
    });
    return res.data || res;
  },

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    const res: any = await apiClient.post('/auth/register', payload);
    return res.data || res;
  },

  async googleLogin(payload: GoogleLoginRequest): Promise<LoginResponse> {
    const deviceId = payload.deviceId || (await getOrCreateDeviceId());
    const res: any = await apiClient.post('/auth/google', {
      ...payload,
      deviceId,
    });
    return res.data || res;
  },

  async sendOtp(payload: SendOtpRequest): Promise<{ message: string }> {
    const res: any = await apiClient.post('/auth/otp/send', payload);
    return res.data || res;
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<{ success: boolean; message: string }> {
    const res: any = await apiClient.post('/auth/otp/verify', payload);
    return res.data || res;
  },

  async forgotPassword(identifier: string): Promise<{ message: string }> {
    const res: any = await apiClient.post('/auth/password/forgot', { identifier });
    return res.data || res;
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<{ message: string }> {
    const res: any = await apiClient.post('/auth/password/reset', payload);
    return res.data || res;
  },

  async logout(): Promise<{ message: string }> {
    const res: any = await apiClient.post('/auth/logout');
    return res.data || res;
  },

  async getMe(): Promise<User> {
    const res: any = await apiClient.get('/users/me');
    return res.data || res;
  },

  async getPekons(): Promise<Pekon[]> {
    try {
      const res: any = await apiClient.get('/pekon');
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      if (Array.isArray(res) && res.length > 0) {
        return res;
      }
    } catch {
      // Fallback ke master pekon Pringsewu
    }
    return FALLBACK_PEKONS;
  },
};
