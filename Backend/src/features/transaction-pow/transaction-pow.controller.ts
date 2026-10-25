import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionPowService } from './transaction-pow.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { SelfiePoWDto } from './dto/transaction.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionPowController {
  constructor(
    private readonly transactionPowService: TransactionPowService,
  ) {}

  @Get('me')
  async getMyTransactions(
    @CurrentUser('userId') userId: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    return this.transactionPowService.getMyTransactions(userId, type, status);
  }

  @Get(':id/token')
  async getTransactionToken(
    @Param('id') txId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.transactionPowService.getTransactionToken(txId, userId);
  }

  @Post(':id/selfie-pow')
  @HttpCode(HttpStatus.OK)
  async submitSelfiePoW(
    @Param('id') txId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: SelfiePoWDto,
  ) {
    return this.transactionPowService.verifySelfiePoW(txId, userId, dto);
  }
}
