import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../core/database/prisma.service';
import { FcmProvider } from '../providers/fcm.provider';
import { ResendProvider } from '../providers/resend.provider';

@Processor('outbox')
export class OutboxProcessor extends WorkerHost {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmProvider: FcmProvider,
    private readonly resendProvider: ResendProvider,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const event = job.data;
    this.logger.log(`Memproses outbox event: ${event.eventType} [${event.id}]`);

    try {
      switch (event.eventType) {
        case 'FCM_PUSH':
          await this.fcmProvider.sendPush(event.payload);
          break;

        case 'FCM_OTP':
        case 'SMART_OTP':
          await this.handleSmartOtpDispatch(event.payload);
          break;

        case 'EMAIL_OTP':
          if (!event.payload.email) {
            throw new Error('Alamat email tujuan tidak ditemukan pada payload.');
          }
          await this.resendProvider.sendOtpEmail({
            to: event.payload.email,
            otpCode: event.payload.otpCode,
            purpose: event.payload.purpose,
          });
          break;

        case 'LOAN_ELIGIBLE':
          await this.fcmProvider.sendPush({
            token: event.payload.fcmToken,
            title: 'Kredit BUMDes Siap Dicairkan!',
            body: event.payload.message,
            data: {
              type: 'LOAN_ELIGIBLE',
              plafond: String(event.payload.plafond),
            },
          });
          break;

        default:
          this.logger.warn(`Tipe event tidak dikenali: ${event.eventType}`);
      }

      // Update status OutboxEvent menjadi COMPLETED
      await this.prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          status: 'COMPLETED',
          processedAt: new Date(),
        },
      });
    } catch (err: any) {
      this.logger.error(
        `Gagal memproses outbox event [${event.id}]: ${err.message}`,
      );

      await this.prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          status: 'FAILED',
          retryCount: { increment: 1 },
          lastError: err.message,
        },
      });

      throw err; // Trigger exponential retry oleh BullMQ
    }
  }

  /**
   * Logika Pengiriman OTP Cerdas (Smart OTP Dispatcher):
   * 1. Jika Platform Klien adalah WEB -> Langsung kirim via Email (Resend).
   * 2. Jika Platform Klien adalah MOBILE -> Coba FCM Push Notification.
   *    Jika FCM gagal (token kosong, expired, network error), lakukan failover ke Email (Resend).
   */
  private async handleSmartOtpDispatch(payload: {
    userId?: string;
    phoneNumber?: string;
    email?: string;
    fcmToken?: string;
    otpCode: string;
    purpose: string;
    platform?: 'mobile' | 'web';
  }) {
    let email = payload.email;
    let fcmToken = payload.fcmToken;

    // Ambil data user terkini jika tersedia userId dan informasi belum lengkap
    if (payload.userId && (!email || !fcmToken)) {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: { email: true, fcmToken: true, phoneNumber: true },
      });
      if (user) {
        email = email || user.email || undefined;
        fcmToken = fcmToken || user.fcmToken || undefined;
      }
    }

    const platform = payload.platform?.toLowerCase() || 'mobile';

    // RUTE 1: Klien WEB -> Langsung kirim ke Email
    if (platform === 'web') {
      this.logger.log(
        `[OTP DISPATCH - WEB] Mengirimkan OTP langsung via Email ke: ${email || payload.phoneNumber}`,
      );

      if (!email) {
        throw new Error(
          'Pengiriman OTP Web gagal: Pengguna belum memiliki alamat email terdaftar.',
        );
      }

      await this.resendProvider.sendOtpEmail({
        to: email,
        otpCode: payload.otpCode,
        purpose: payload.purpose,
      });
      return;
    }

    // RUTE 2: Klien MOBILE -> Utamakan FCM Push Notification
    this.logger.log(
      `[OTP DISPATCH - MOBILE] Mencoba pengiriman via FCM Push Notification ke perangkat...`,
    );

    try {
      if (!fcmToken) {
        throw new Error('FCM token tidak ditemukan pada profil pengguna.');
      }

      await this.fcmProvider.sendOtp({
        userId: payload.userId || 'unknown',
        token: fcmToken,
        phoneNumber: payload.phoneNumber,
        otpCode: payload.otpCode,
        purpose: payload.purpose,
      });

      this.logger.log(
        `[OTP DISPATCH - MOBILE SUCCESS] OTP berhasil terkirim via FCM Push Notification.`,
      );
    } catch (fcmError: any) {
      // Galat FCM terdeteksi -> Picu Fallback ke Email Resend
      this.logger.warn(
        `[OTP FAILOVER] FCM gagal (${fcmError.message}). Memulai pengiriman fallback via Email Resend...`,
      );

      if (!email) {
        throw new Error(
          `Pengiriman OTP Mobile gagal: FCM tidak dapat dijangkau (${fcmError.message}) dan pengguna tidak memiliki alamat email fallback.`,
        );
      }

      await this.resendProvider.sendOtpEmail({
        to: email,
        otpCode: payload.otpCode,
        purpose: payload.purpose,
      });

      this.logger.log(
        `[OTP FAILOVER SUCCESS] OTP berhasil dikirim ke alamat email fallback: ${email}`,
      );
    }
  }
}
