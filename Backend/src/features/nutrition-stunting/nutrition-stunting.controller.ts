import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NutritionStuntingService } from './nutrition-stunting.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { RedeemPackageDto, PackageQueryDto } from './dto/nutrition.dto';

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
}
