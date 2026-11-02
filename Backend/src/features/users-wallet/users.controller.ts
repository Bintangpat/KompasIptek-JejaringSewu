import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  Query,
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
  QueryUsersDto,
  AdminUpdateUserDto,
  AdminQueryUsersDto,
  AdminImportUsersDto,
} from './dto/users.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersWalletService: UsersWalletService) {}

  @Get('me')
  async getMyProfile(@CurrentUser('userId') userId: string) {
    return this.usersWalletService.getProfile(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.ADMIN_BAPPERIDA, Role.SUPER_ADMIN)
  @Get('unverified')
  async getUnverifiedUsers(@Query('pekonId') pekonId?: string) {
    return this.usersWalletService.getUnverifiedUsers(pekonId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.ADMIN_BAPPERIDA, Role.SUPER_ADMIN)
  @Get('pekon/:pekonId')
  async getUsersByPekon(
    @Param('pekonId') pekonId: string,
    @Query('isNikVerified') isNikVerified?: string,
  ) {
    const verifiedBool =
      isNikVerified !== undefined ? isNikVerified === 'true' : undefined;
    return this.usersWalletService.getUsersByPekon(pekonId, verifiedBool);
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

  // ==========================================
  // SUPER ADMIN: MANAJEMEN PENGGUNA TERPUSAT
  // ==========================================

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/all')
  async getAllUsersAdmin(@Query() query: AdminQueryUsersDto) {
    return this.usersWalletService.getAdminUsers(query);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get('admin/export')
  async exportUsersAdmin(@Query() query: AdminQueryUsersDto) {
    return this.usersWalletService.adminExportUsers(query);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('admin/backup')
  @HttpCode(HttpStatus.OK)
  async backupUsersAdmin() {
    return this.usersWalletService.adminBackupData();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post('admin/import')
  @HttpCode(HttpStatus.OK)
  async importUsersAdmin(@Body() dto: AdminImportUsersDto) {
    return this.usersWalletService.adminImportUsers(dto.users);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch('admin/:id')
  async updateUserDataAdmin(
    @Param('id') userId: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.usersWalletService.adminUpdateUser(userId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete('admin/:id')
  async deleteUserAdmin(@Param('id') userId: string) {
    return this.usersWalletService.adminDeleteUser(userId);
  }
}
