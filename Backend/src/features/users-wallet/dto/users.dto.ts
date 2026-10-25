import {
  IsString,
  IsOptional,
  IsEmail,
  IsUUID,
  IsEnum,
  IsBoolean,
  Matches,
  MinLength,
} from 'class-validator';
import { VulnerabilityStatus } from '@prisma/client';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Nama lengkap minimal 3 karakter' })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email?: string;

  @IsOptional()
  @IsEnum(VulnerabilityStatus, { each: true })
  vulnerabilityFlags?: VulnerabilityStatus[];

  @IsOptional()
  @IsBoolean()
  hasToddler?: boolean;
}

export class VerifyNikDto {
  @IsUUID('4', { message: 'User ID wajib berupa UUID v4' })
  userId: string;

  @IsString()
  @Matches(/^[0-9]{16}$/, { message: 'NIK input wajib 16 digit angka' })
  nikInput: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateFcmTokenDto {
  @IsString()
  fcmToken: string;
}
