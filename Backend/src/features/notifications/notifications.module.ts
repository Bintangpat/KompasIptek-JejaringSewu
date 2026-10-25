import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { OutboxProcessor } from './processors/outbox.processor';
import { FcmProvider } from './providers/fcm.provider';
import { PrismaModule } from '../../core/database/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    BullModule.registerQueue({
      name: 'outbox',
    }),
  ],
  providers: [NotificationsService, OutboxProcessor, FcmProvider],
  exports: [NotificationsService, FcmProvider],
})
export class NotificationsModule {}
