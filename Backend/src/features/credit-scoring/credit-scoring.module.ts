import { Module } from '@nestjs/common';
import { CreditScoringController } from './credit-scoring.controller';
import { CreditScoringService } from './credit-scoring.service';
import { PrismaModule } from '../../core/database/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CreditScoringController],
  providers: [CreditScoringService],
  exports: [CreditScoringService],
})
export class CreditScoringModule {}
