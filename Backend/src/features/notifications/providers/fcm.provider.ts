import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmProvider {
  private readonly logger = new Logger(FcmProvider.name);
  private firebaseApp: admin.app.App | null = null;

  constructor(private readonly configService: ConfigService) {
    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');

    if (projectId && clientEmail && privateKey && !privateKey.includes('...')) {
      try {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        });
        this.logger.log('Firebase Admin SDK initialized successfully.');
      } catch (err: any) {
        this.logger.warn(`Firebase Admin SDK init skipped: ${err.message}`);
      }
    } else {
      this.logger.log(
        'FCM Provider berjalan dalam mode Development/Simulasi (kredensial Firebase dev aktif).',
      );
    }
  }

  // 1. Kirim Push Notification Umum ke Perangkat Android
  async sendPush(payload: {
    token?: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }) {
    if (this.firebaseApp && payload.token) {
      try {
        await this.firebaseApp.messaging().send({
          token: payload.token,
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: payload.data,
        });
        this.logger.log(`FCM Push terkirim ke token: ${payload.token}`);
      } catch (err: any) {
        this.logger.error(`Gagal mengirim FCM Push: ${err.message}`);
        throw err;
      }
    } else {
      this.logger.log(
        `[SIMULASI FCM PUSH] Ke: ${payload.token || 'Semua'} | Judul: ${payload.title} | Pesan: ${payload.body}`,
      );
    }
  }

  // 2. Kirim Kode OTP via Push Notification FCM
  async sendOtp(payload: {
    userId: string;
    phoneNumber?: string;
    purpose: string;
    otpCode: string;
    token?: string;
  }) {
    const title = 'Kode Verifikasi JEJARING-SEWU';
    const body = `Kode OTP Anda adalah: ${payload.otpCode}. Jangan berikan kode ini kepada siapa pun. Berlaku 5 menit.`;

    await this.sendPush({
      token: payload.token,
      title,
      body,
      data: {
        type: 'OTP_VERIFICATION',
        purpose: payload.purpose,
        otpCode: payload.otpCode,
      },
    });
  }
}
