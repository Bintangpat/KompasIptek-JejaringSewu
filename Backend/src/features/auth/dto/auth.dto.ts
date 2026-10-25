import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEmail,
  IsUUID,
  IsEnum,
  IsIn,
} from 'class-validator';
import { VulnerabilityStatus } from '@prisma/client';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Nomor HP atau email wajib diisi' })
  identifier: string; // Nomor WhatsApp (utama) atau email (alternatif)

  @IsString()
  @MinLength(8, { message: 'Kata sandi minimal 8 karakter' })
  password: string;

  @IsString()
  deviceId: string;
}

export class RegisterDto {
  @IsString()
  @Matches(/^[0-9]{16}$/, { message: 'NIK wajib berupa 16 digit angka' })
  nik: string;

  @IsString()
  @MinLength(3, { message: 'Nama lengkap minimal 3 karakter' })
  fullName: string;

  @IsString()
  @Matches(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, {
    message: 'Format nomor HP Indonesia tidak valid',
  })
  phoneNumber: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Kata sandi wajib mengandung huruf besar, huruf kecil, dan angka/simbol',
  })
  password: string;

  @IsUUID('4', { message: 'Pekon ID wajib berformat UUID v4' })
  pekonId: string;

  @IsEnum(VulnerabilityStatus, { each: true })
  @IsOptional()
  vulnerabilityFlags?: VulnerabilityStatus[];
}

export class GoogleLoginDto {
  @IsString()
  idToken: string; // Token dari Google Sign-In SDK (Mobile / Web)

  @IsString()
  deviceId: string;

  @IsUUID('4', { message: 'Pekon ID wajib berformat UUID v4' })
  pekonId: string;
}

export class SendOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Identifier wajib diisi' })
  identifier: string; // Nomor WhatsApp (utama) atau email

  @IsString()
  @IsIn(['REGISTRATION', 'FORGOT_PASSWORD', 'VERIFY_ACTION'], {
    message: 'Tujuan pengiriman OTP tidak valid',
  })
  purpose: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Identifier wajib diisi' })
  identifier: string; // Nomor WhatsApp atau email

  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'Kode OTP wajib berupa 6 digit angka' })
  otpCode: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Identifier wajib diisi' })
  identifier: string; // Nomor WhatsApp atau email

  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'Kode OTP wajib berupa 6 digit angka' })
  otpCode: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Kata sandi baru wajib mengandung huruf besar, huruf kecil, dan angka/simbol',
  })
  newPassword: string;
}
