import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';

export interface UploadResult {
  storageUrl: string;
  key: string;
  bucket: string;
  sha256Hash: string;
  sizeBytes: number;
  contentType: string;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly downloadBaseUrl: string;
  private readonly endpoint: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('BACKBLAZE_BUCKET_NAME') ||
      this.configService.get<string>('BACKBLAZE_bucketname') ||
      'jejaring-sewu-pow-dev';

    const keyId =
      this.configService.get<string>('BACKBLAZE_KEY_ID') ||
      this.configService.get<string>('BACKBLAZE_keyID') ||
      '';

    const appKey =
      this.configService.get<string>('BACKBLAZE_APPLICATION_KEY') ||
      this.configService.get<string>('BACKBLAZE_applicationKey') ||
      '';

    this.endpoint =
      this.configService.get<string>('BACKBLAZE_ENDPOINT') ||
      'https://s3.us-east-005.backblazeb2.com';

    this.region =
      this.configService.get<string>('BACKBLAZE_REGION') || 'us-east-005';

    this.downloadBaseUrl =
      this.configService.get<string>('BACKBLAZE_DOWNLOAD_URL') ||
      'https://f005.backblazeb2.com';

    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: this.region,
      credentials: {
        accessKeyId: keyId,
        secretAccessKey: appKey,
      },
      forcePathStyle: true,
    });

    this.logger.log(
      `[Backblaze B2] StorageService initialized (Bucket: ${this.bucketName}, Region: ${this.region})`,
    );
  }

  // 1. Upload Buffer langsung ke Backblaze B2
  async uploadBuffer(
    buffer: Buffer,
    key: string,
    contentType: string = 'image/jpeg',
    metadata?: Record<string, string>,
  ): Promise<UploadResult> {
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        sha256: sha256Hash,
        ...(metadata || {}),
      },
    });

    await this.s3Client.send(command);

    const storageUrl = this.getPublicUrl(key);
    this.logger.log(`[Backblaze B2] File berhasil diunggah: ${key} (${buffer.length} bytes)`);

    return {
      storageUrl,
      key,
      bucket: this.bucketName,
      sha256Hash,
      sizeBytes: buffer.length,
      contentType,
    };
  }

  // 2. Upload Base64 Image (biasa dikirim dari mobile kamera / canvas web)
  async uploadBase64(
    base64String: string,
    filenamePrefix: string = 'pow',
    folder: string = 'pow',
  ): Promise<UploadResult> {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let contentType = 'image/jpeg';
    let rawBase64 = base64String;

    if (matches && matches.length === 3) {
      contentType = matches[1];
      rawBase64 = matches[2];
    }

    const buffer = Buffer.from(rawBase64, 'base64');
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const timestamp = Date.now();
    const key = `${folder}/${filenamePrefix}_${timestamp}_${sha256Hash.substring(0, 12)}.jpg`;

    return this.uploadBuffer(buffer, key, contentType, {
      uploader: 'jejaring-client',
      uploadedAt: new Date().toISOString(),
    });
  }

  // 3. Dapatkan URL publik permanen
  getPublicUrl(key: string): string {
    return `${this.downloadBaseUrl}/file/${this.bucketName}/${key}`;
  }
}
