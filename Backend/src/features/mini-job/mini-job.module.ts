import { Module } from '@nestjs/common';
import { MiniJobController } from './mini-job.controller';
import { MiniJobService } from './mini-job.service';
import { PrismaModule } from '../../core/database/prisma.module';
import { CryptoModule } from '../../core/crypto/crypto.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, CryptoModule, AuthModule],
  controllers: [MiniJobController],
  providers: [MiniJobService],
  exports: [MiniJobService],
})
export class MiniJobModule {}
