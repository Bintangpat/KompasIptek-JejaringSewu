import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HarvestBursaService } from './harvest-bursa.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import {
  CreateListingDto,
  ListingQueryDto,
  PlaceBidDto,
} from './dto/harvest.dto';

@UseGuards(JwtAuthGuard)
@Controller('harvests')
export class HarvestBursaController {
  constructor(private readonly harvestBursaService: HarvestBursaService) {}

  @Post('listings')
  async createListing(
    @CurrentUser('userId') farmerId: string,
    @CurrentUser('pekonId') pekonId: string,
    @Body() dto: CreateListingDto,
  ) {
    return this.harvestBursaService.createListing(farmerId, pekonId, dto);
  }

  @Get('listings')
  async getListings(@Query() query: ListingQueryDto) {
    return this.harvestBursaService.getListings(query);
  }

  @Post('listings/:id/bids')
  async placeBid(
    @CurrentUser('userId') collectorId: string,
    @Param('id') listingId: string,
    @Body() dto: PlaceBidDto,
  ) {
    return this.harvestBursaService.placeBid(collectorId, listingId, dto);
  }

  @Post('bids/:bidId/accept')
  @HttpCode(HttpStatus.OK)
  async acceptBid(
    @CurrentUser('userId') farmerId: string,
    @Param('bidId') bidId: string,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.harvestBursaService.acceptBid(
      farmerId,
      bidId,
      idempotencyKey,
    );
  }

  @Get('collectors/trusted')
  async getTrustedCollectors(@Query('pekonId') pekonId?: string) {
    return this.harvestBursaService.getTrustedCollectors(pekonId);
  }
}
