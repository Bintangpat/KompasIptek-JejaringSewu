import { IsUUID, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RedeemPackageDto {
  @IsUUID('4', { message: 'Package ID wajib berformat UUID v4' })
  packageId: string;
}

export class PackageQueryDto {
  @IsOptional()
  @IsUUID('4', { message: 'Pekon ID wajib berformat UUID v4' })
  pekonId?: string;
}

export class RestockPackageDto {
  @Type(() => Number)
  @IsInt({ message: 'Jumlah tambahan stok wajib bilangan bulat' })
  @Min(1, { message: 'Tambahan stok minimal 1' })
  additionalStock: number;
}

