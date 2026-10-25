import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ApproveLoanDto {
  @IsOptional()
  @IsNumber()
  @Min(500000, { message: 'Plafond minimal Rp 500.000' })
  @Type(() => Number)
  approvedPlafond?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
