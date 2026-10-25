import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersWalletService } from './users-wallet.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly usersWalletService: UsersWalletService) {}

  @Get('me')
  async getMyWallet(@CurrentUser('userId') userId: string) {
    return this.usersWalletService.getWalletWithLedger(userId);
  }
}
