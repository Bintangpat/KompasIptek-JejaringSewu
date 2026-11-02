import {
  IsString,
  IsOptional,
  IsEmail,
  IsUUID,
  IsEnum,
  IsBoolean,
  Matches,
  MinLength,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Role, VulnerabilityStatus } from '@prisma/client';

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

export class QueryUsersDto {
  @IsOptional()
  @IsString()
  isNikVerified?: string;

  @IsOptional()
  @IsUUID('4')
  pekonId?: string;
}

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Nama lengkap minimal 3 karakter' })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsUUID('4', { message: 'pekonId wajib berupa UUID v4' })
  pekonId?: string;

  @IsOptional()
  @IsBoolean()
  isNikVerified?: boolean;

  @IsOptional()
  @IsEnum(VulnerabilityStatus, { each: true })
  vulnerabilityFlags?: VulnerabilityStatus[];

  @IsOptional()
  @IsBoolean()
  hasToddler?: boolean;

  @IsOptional()
  @IsBoolean()
  isTrustedCollector?: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

export class AdminQueryUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsUUID('4')
  pekonId?: string;

  @IsOptional()
  @IsString()
  isNikVerified?: string;

  @IsOptional()
  @IsString()
  isDeleted?: string;
}

export class ImportUserRowDto {
  @IsString()
  @Matches(/^[0-9]{16}$/, { message: 'NIK wajib 16 digit angka' })
  nik: string;

  @IsString()
  @MinLength(3, { message: 'Nama lengkap minimal 3 karakter' })
  fullName: string;

  @IsString()
  @Matches(/^08[0-9]{8,12}$/, { message: 'Format nomor WhatsApp tidak valid' })
  phoneNumber: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsUUID('4')
  pekonId?: string;

  @IsOptional()
  @IsEnum(VulnerabilityStatus, { each: true })
  vulnerabilityFlags?: VulnerabilityStatus[];

  @IsOptional()
  @IsBoolean()
  hasToddler?: boolean;

  @IsOptional()
  @IsBoolean()
  isNikVerified?: boolean;
}

export class AdminImportUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportUserRowDto)
  users: ImportUserRowDto[];
}

