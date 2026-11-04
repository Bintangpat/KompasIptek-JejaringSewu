import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { OutboxProcessor } from './processors/outbox.processor';
import { FcmProvider } from './providers/fcm.provider';
import { ResendProvider } from './providers/resend.provider';
import { PrismaModule } from '../../core/database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    BullModule.registerQueue({
      name: 'outbox',
    }),
  ],
  providers: [NotificationsService, OutboxProcessor, FcmProvider, ResendProvider],
  exports: [NotificationsService, FcmProvider, ResendProvider],
})
export class NotificationsModule {}
