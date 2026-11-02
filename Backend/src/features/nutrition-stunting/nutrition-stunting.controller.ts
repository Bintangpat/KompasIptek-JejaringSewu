import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { NutritionStuntingService } from './nutrition-stunting.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import {
  RedeemPackageDto,
  PackageQueryDto,
  RestockPackageDto,
} from './dto/nutrition.dto';

@UseGuards(JwtAuthGuard)
@Controller('nutrition')
export class NutritionStuntingController {
  constructor(
    private readonly nutritionStuntingService: NutritionStuntingService,
  ) {}

  @Get('packages')
  async getPackages(@Query() query: PackageQueryDto) {
    return this.nutritionStuntingService.getPackages(query);
  }

  @Get('redemptions/me')
  async getMyRedemptions(@CurrentUser('userId') userId: string) {
    return this.nutritionStuntingService.getMyRedemptions(userId);
  }

  @Post('redeem')
  @HttpCode(HttpStatus.OK)
  async redeemPackage(
    @CurrentUser('userId') userId: string,
    @Body() dto: RedeemPackageDto,
  ) {
    return this.nutritionStuntingService.redeemPackage(userId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.SUPER_ADMIN)
  @Patch('packages/:id/restock')
  async restockPackage(
    @Param('id') packageId: string,
    @Body() dto: RestockPackageDto,
  ) {
    return this.nutritionStuntingService.restockPackage(packageId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.SUPER_ADMIN)
  @Get('redemptions/pekon/:pekonId')
  async getRedemptionsByPekon(@Param('pekonId') pekonId: string) {
    return this.nutritionStuntingService.getRedemptionsByPekon(pekonId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.SUPER_ADMIN)
  @Patch('redemptions/:id/complete')
  async completeRedemption(@Param('id') redemptionId: string) {
    return this.nutritionStuntingService.completeRedemption(redemptionId);
  }
}
