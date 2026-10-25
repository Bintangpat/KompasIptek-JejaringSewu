import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../../core/database/prisma.service';
import { FcmProvider } from '../providers/fcm.provider';

@Processor('outbox')
export class OutboxProcessor extends WorkerHost {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmProvider: FcmProvider,
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
          await this.fcmProvider.sendOtp(event.payload);
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
}
