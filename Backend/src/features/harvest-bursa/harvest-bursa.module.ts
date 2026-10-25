import { Module } from '@nestjs/common';
import { HarvestBursaController } from './harvest-bursa.controller';
import { HarvestBursaService } from './harvest-bursa.service';
import { PrismaModule } from '../../core/database/prisma.module';
import { CryptoModule } from '../../core/crypto/crypto.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, CryptoModule, AuthModule],
  controllers: [HarvestBursaController],
  providers: [HarvestBursaService],
  exports: [HarvestBursaService],
})
export class HarvestBursaModule {}
