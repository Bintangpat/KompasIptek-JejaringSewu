import { Module } from '@nestjs/common';
import { TransactionPowController } from './transaction-pow.controller';
import { TransactionPowService } from './transaction-pow.service';
import { PrismaModule } from '../../core/database/prisma.module';
import { UsersWalletModule } from '../users-wallet/users-wallet.module';
import { CryptoModule } from '../../core/crypto/crypto.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, UsersWalletModule, CryptoModule, AuthModule],
  controllers: [TransactionPowController],
  providers: [TransactionPowService],
  exports: [TransactionPowService],
})
export class TransactionPowModule {}
