import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Request } from 'express';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  constructor(private readonly redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const idempotencyKey = request.headers['x-idempotency-key'] as string;

    if (!idempotencyKey) {
      throw new BadRequestException({
        errorCode: 'ERR_VALIDATION_FAILED',
        message: 'Header X-Idempotency-Key wajib disertakan pada transaksi ini.',
      });
    }

    const redisKey = `idempotency:${idempotencyKey}`;
    // Coba setNX dengan lock 120 detik
    const lockAcquired = await this.redis.set(
      redisKey,
      'PROCESSING',
      'EX',
      120,
      'NX',
    );

    if (!lockAcquired) {
      const existingState = await this.redis.get(redisKey);
      if (existingState === 'PROCESSING') {
        throw new ConflictException({
          errorCode: 'ERR_CONCURRENCY_LOCK',
          message: 'Transaksi dengan kunci idempotensi ini sedang diproses.',
        });
      }
    }

    return true;
  }
}
