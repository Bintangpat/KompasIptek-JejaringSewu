import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersWalletService } from './users-wallet.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import {
  UpdateProfileDto,
  VerifyNikDto,
  UpdateFcmTokenDto,
} from './dto/users.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersWalletService: UsersWalletService) {}

  @Get('me')
  async getMyProfile(@CurrentUser('userId') userId: string) {
    return this.usersWalletService.getProfile(userId);
  }

  @Patch('me')
  async updateMyProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersWalletService.updateProfile(userId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.SUPER_ADMIN)
  @Post('verify-nik')
  @HttpCode(HttpStatus.OK)
  async verifyNik(
    @CurrentUser('userId') adminId: string,
    @Body() dto: VerifyNikDto,
  ) {
    return this.usersWalletService.verifyNikByAdmin(adminId, dto);
  }

  @Patch('me/fcm-token')
  async updateFcmToken(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateFcmTokenDto,
  ) {
    return this.usersWalletService.updateFcmToken(userId, dto);
  }
}
