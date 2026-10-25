import { Module } from '@nestjs/common';
import { CommuterJastipController } from './commuter-jastip.controller';
import { CommuterJastipService } from './commuter-jastip.service';
import { PrismaModule } from '../../core/database/prisma.module';
import { CryptoModule } from '../../core/crypto/crypto.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, CryptoModule, AuthModule],
  controllers: [CommuterJastipController],
  providers: [CommuterJastipService],
  exports: [CommuterJastipService],
})
export class CommuterJastipModule {}
