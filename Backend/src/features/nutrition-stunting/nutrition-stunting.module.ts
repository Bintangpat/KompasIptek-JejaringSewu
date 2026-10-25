import { Module } from '@nestjs/common';
import { NutritionStuntingController } from './nutrition-stunting.controller';
import { NutritionStuntingService } from './nutrition-stunting.service';
import { PrismaModule } from '../../core/database/prisma.module';
import { UsersWalletModule } from '../users-wallet/users-wallet.module';
import { CryptoModule } from '../../core/crypto/crypto.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, UsersWalletModule, CryptoModule, AuthModule],
  controllers: [NutritionStuntingController],
  providers: [NutritionStuntingService],
  exports: [NutritionStuntingService],
})
export class NutritionStuntingModule {}
