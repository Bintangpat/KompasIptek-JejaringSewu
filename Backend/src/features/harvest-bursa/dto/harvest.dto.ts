import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama komoditas wajib diisi' })
  commodityName: string; // Misal: Singkong, Kakao, Kelapa, Pisang, Ikan Nila

  @IsNumber()
  @Min(1, { message: 'Estimasi panen minimal 1 kg' })
  @Type(() => Number)
  estimatedKg: number;

  @IsNumber()
  @Min(100, { message: 'Harga minimal penawaran per kg minimal Rp 100' })
  @Type(() => Number)
  minPricePerKg: number;
}

export class ListingQueryDto {
  @IsOptional()
  @IsUUID('4', { message: 'Pekon ID harus valid UUID v4' })
  pekonId?: string;

  @IsOptional()
  @IsString()
  commodityName?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class PlaceBidDto {
  @IsNumber()
  @Min(100, { message: 'Harga penawaran minimal Rp 100 per kg' })
  @Type(() => Number)
  offeredPricePerKg: number;

  @IsOptional()
  @IsString()
  referralUsedCode?: string;
}
