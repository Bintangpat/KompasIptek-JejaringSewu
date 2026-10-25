import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class SelfiePoWDto {
  @IsString()
  @IsNotEmpty({ message: 'URL gambar selfie PoW di Cloudflare R2 wajib ada' })
  imageStorageUrl: string;

  @IsString()
  @Matches(/^[a-fA-F0-9]{64}$/, {
    message: 'Checksum gambar wajib berformat SHA-256 (64 karakter heksadesimal)',
  })
  imageSha256Hash: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  gpsLatitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  gpsLongitude: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  gpsAccuracyMeters: number;

  @IsString()
  @IsNotEmpty({ message: 'Nama pekon pada watermark wajib diisi' })
  pekonNameOverlay: string;

  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  isCameraDirect: boolean;
}
