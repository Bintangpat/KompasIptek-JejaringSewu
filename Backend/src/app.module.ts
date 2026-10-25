import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './core/database/prisma.module';
import { RedisModule } from './core/redis/redis.module';
import { CryptoModule } from './core/crypto/crypto.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersWalletModule } from './features/users-wallet/users-wallet.module';
import { HarvestBursaModule } from './features/harvest-bursa/harvest-bursa.module';
import { CommuterJastipModule } from './features/commuter-jastip/commuter-jastip.module';
import { MiniJobModule } from './features/mini-job/mini-job.module';
import { TransactionPowModule } from './features/transaction-pow/transaction-pow.module';
import { CreditScoringModule } from './features/credit-scoring/credit-scoring.module';
import { NutritionStuntingModule } from './features/nutrition-stunting/nutrition-stunting.module';
import { NotificationsModule } from './features/notifications/notifications.module';

@Module({
  imports: [
    // 1. Global Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Multi-Tier Throttler
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 100 },
      { name: 'otp_strict', ttl: 300000, limit: 3 },
    ]),

    // 3. BullMQ Asynchronous Processing
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD') || undefined,
        },
      }),
      inject: [ConfigService],
    }),

    // 4. Core Infrastructure
    PrismaModule,
    RedisModule,
    CryptoModule,

    // 5. Feature Modules (All 7 Feature Pillars)
    AuthModule,
    UsersWalletModule,
    HarvestBursaModule,
    CommuterJastipModule,
    MiniJobModule,
    TransactionPowModule,
    CreditScoringModule,
    NutritionStuntingModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
