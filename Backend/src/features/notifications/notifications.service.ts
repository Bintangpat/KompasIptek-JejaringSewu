import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('outbox') private readonly outboxQueue: Queue,
  ) {}

  // Pindai & antrekan event pending ke BullMQ worker
  async queuePendingOutboxEvents() {
    const pendingEvents = await this.prisma.outboxEvent.findMany({
      where: { status: 'PENDING' },
      take: 50,
      orderBy: { createdAt: 'asc' },
    });

    for (const event of pendingEvents) {
      // Tandai PROCESSING di DB
      await this.prisma.outboxEvent.update({
        where: { id: event.id },
        data: { status: 'PROCESSING' },
      });

      await this.outboxQueue.add(event.eventType, event, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000, // 2s, 4s, 8s backoff
        },
        removeOnComplete: true,
      });
    }

    return { queuedCount: pendingEvents.length };
  }
}
