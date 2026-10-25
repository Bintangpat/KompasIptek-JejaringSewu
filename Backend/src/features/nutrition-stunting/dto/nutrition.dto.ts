import { IsUUID, IsOptional } from 'class-validator';

export class RedeemPackageDto {
  @IsUUID('4', { message: 'Package ID wajib berformat UUID v4' })
  packageId: string;
}

export class PackageQueryDto {
  @IsOptional()
  @IsUUID('4', { message: 'Pekon ID wajib berformat UUID v4' })
  pekonId?: string;
}
