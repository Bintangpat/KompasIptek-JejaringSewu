import { z } from 'zod';
import { VulnerabilityStatus } from '../../types/enums';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Nomor HP atau email wajib diisi'),
  password: z
    .string()
    .min(8, 'Kata sandi minimal 8 karakter'),
});

export const registerSchema = z.object({
  nik: z
    .string()
    .regex(/^[0-9]{16}$/, 'NIK wajib 16 digit angka'),
  fullName: z
    .string()
    .min(3, 'Nama lengkap minimal 3 karakter'),
  phoneNumber: z
    .string()
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Format nomor HP Indonesia tidak valid (contoh: 08123456789)'),
  email: z
    .string()
    .email('Format email tidak valid')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(8, 'Kata sandi minimal 8 karakter')
    .regex(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Wajib mengandung huruf besar, huruf kecil, dan angka/simbol'
    ),
  confirmPassword: z.string().min(8, 'Konfirmasi kata sandi minimal 8 karakter'),
  pekonId: z
    .string()
    .min(1, 'Pekon wajib dipilih'),
  vulnerabilityFlags: z
    .array(z.nativeEnum(VulnerabilityStatus))
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi kata sandi tidak cocok',
  path: ['confirmPassword'],
});

export const sendOtpSchema = z.object({
  identifier: z.string().min(1, 'Nomor HP atau email wajib diisi'),
  purpose: z.enum(['REGISTRATION', 'FORGOT_PASSWORD', 'VERIFY_ACTION']),
});

export const verifyOtpSchema = z.object({
  identifier: z.string().min(1, 'Identifier wajib diisi'),
  otpCode: z.string().regex(/^[0-9]{6}$/, 'Kode OTP harus berupa 6 digit angka'),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Nomor HP atau email wajib diisi'),
});

export const resetPasswordSchema = z.object({
  identifier: z.string().min(1, 'Identifier wajib diisi'),
  otpCode: z.string().regex(/^[0-9]{6}$/, 'Kode OTP harus berupa 6 digit angka'),
  newPassword: z
    .string()
    .min(8, 'Kata sandi minimal 8 karakter')
    .regex(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Wajib mengandung huruf besar, huruf kecil, dan angka/simbol'
    ),
  confirmNewPassword: z.string().min(8, 'Konfirmasi kata sandi minimal 8 karakter'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Konfirmasi kata sandi tidak cocok',
  path: ['confirmNewPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
