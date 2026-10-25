import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { WalletsController } from './wallets.controller';
import { UsersWalletService } from './users-wallet.service';
import { PrismaModule } from '../../core/database/prisma.module';
import { CryptoModule } from '../../core/crypto/crypto.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, CryptoModule, AuthModule],
  controllers: [UsersController, WalletsController],
  providers: [UsersWalletService],
  exports: [UsersWalletService],
})
export class UsersWalletModule {}
