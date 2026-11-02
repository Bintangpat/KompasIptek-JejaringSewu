import { User, Pekon } from '@/types/entities';
import { VulnerabilityStatus } from '@/types/enums';

export interface LoginRequest {
  identifier: string;
  password: string;
  deviceId?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  refreshToken?: string;
}

export interface RegisterRequest {
  nik: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  password: string;
  pekonId: string;
  vulnerabilityFlags?: VulnerabilityStatus[];
}

export interface RegisterResponse {
  userId: string;
  fullName: string;
  phoneNumber: string;
  message?: string;
}

export interface SendOtpRequest {
  identifier: string;
  purpose: 'REGISTRATION' | 'FORGOT_PASSWORD' | 'VERIFY_ACTION';
}

export interface VerifyOtpRequest {
  identifier: string;
  otpCode: string;
}

export interface ResetPasswordRequest {
  identifier: string;
  otpCode: string;
  newPassword: string;
}

export interface GoogleLoginRequest {
  idToken: string;
  deviceId?: string;
  pekonId: string;
}
