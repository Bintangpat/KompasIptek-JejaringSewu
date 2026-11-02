import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { UploadBase64Dto } from './dto/upload.dto';
import { Public } from '../decorators/public.decorator';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  async uploadBase64(@Body() dto: UploadBase64Dto) {
    return this.storageService.uploadBase64(
      dto.base64Data,
      dto.prefix || 'pow',
      dto.folder || 'pow',
    );
  }
}
