import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateMiniJobDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul pekerjaan wajib diisi' })
  title: string; // Misal: Kupas Singkong 50kg, Kemas Gula Aren

  @IsString()
  @IsNotEmpty({ message: 'Deskripsi pekerjaan wajib diisi' })
  description: string;

  @IsNumber()
  @Min(5000, { message: 'Upah mini-job minimal Rp 5.000' })
  @Type(() => Number)
  wageAmount: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isDisabilityFriendly?: boolean = false;
}

export class MiniJobQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isDisabilityFriendly?: boolean;
}
