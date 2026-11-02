import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UploadBase64Dto {
  @IsString()
  @IsNotEmpty({ message: 'Data gambar base64 wajib diisi' })
  base64Data: string;

  @IsOptional()
  @IsString()
  prefix?: string;

  @IsOptional()
  @IsString()
  folder?: string;
}
