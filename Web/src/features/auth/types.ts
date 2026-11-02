import { UserProfile, UserRole, VulnerabilityFlag } from "@/types";

export interface LoginPayload {
  identifier: string;
  password?: string;
  deviceId?: string;
}

export interface RegisterPayload {
  nik: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  password?: string;
  pekonId: string;
  vulnerabilityFlags?: VulnerabilityFlag[];
  hasToddler?: boolean;
}

export type OtpPurpose = "REGISTRATION" | "FORGOT_PASSWORD" | "VERIFY_ACTION";

export interface OtpSendPayload {
  identifier: string;
  purpose: OtpPurpose;
}

export interface OtpVerifyPayload {
  identifier: string;
  otpCode: string;
}

export interface OtpResponseResult {
  success?: boolean;
  message: string;
}

export interface AuthSuccessResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}
