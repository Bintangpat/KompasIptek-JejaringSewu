import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StartRouteDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama asal perjalanan wajib diisi' })
  originName: string; // Misal: Pekon Pagelaran Utara

  @IsString()
  @IsNotEmpty({ message: 'Nama tujuan perjalanan wajib diisi' })
  destinationName: string; // Misal: Pasar Induk Pringsewu

  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  originLat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  originLng: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  destLat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  destLng: number;
}

export class PingGpsDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  currentLat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  currentLng: number;
}

export class NearbyQueryDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  lng: number;

  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(50)
  @Type(() => Number)
  radiusKm?: number = 5;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Deskripsi barang titipan wajib diisi' })
  itemDescription: string;

  @IsNumber()
  @Min(1000, { message: 'Biaya patungan bensin minimal Rp 1.000' })
  @Type(() => Number)
  fuelShareCost: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  pickupLat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  pickupLng: number;
}
