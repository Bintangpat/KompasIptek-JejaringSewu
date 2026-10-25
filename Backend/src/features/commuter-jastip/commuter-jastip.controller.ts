import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommuterJastipService } from './commuter-jastip.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import {
  StartRouteDto,
  PingGpsDto,
  NearbyQueryDto,
  CreateOrderDto,
} from './dto/commuter.dto';

@UseGuards(JwtAuthGuard)
@Controller('commuters')
export class CommuterJastipController {
  constructor(
    private readonly commuterJastipService: CommuterJastipService,
  ) {}

  @Post('routes/start')
  async startRoute(
    @CurrentUser('userId') commuterId: string,
    @Body() dto: StartRouteDto,
  ) {
    return this.commuterJastipService.startRoute(commuterId, dto);
  }

  @Patch('routes/:id/ping')
  async pingGps(
    @CurrentUser('userId') commuterId: string,
    @Param('id') routeId: string,
    @Body() dto: PingGpsDto,
  ) {
    return this.commuterJastipService.pingGps(commuterId, routeId, dto);
  }

  @Get('routes/nearby')
  async findNearby(@Query() query: NearbyQueryDto) {
    return this.commuterJastipService.findNearbyRoutes(query);
  }

  @Post('routes/:id/orders')
  async createOrder(
    @CurrentUser('userId') requesterId: string,
    @Param('id') routeId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.commuterJastipService.createOrder(
      requesterId,
      routeId,
      dto,
    );
  }

  @Patch('orders/:id/accept')
  @HttpCode(HttpStatus.OK)
  async acceptOrder(
    @CurrentUser('userId') commuterId: string,
    @Param('id') orderId: string,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.commuterJastipService.acceptOrder(
      commuterId,
      orderId,
      idempotencyKey,
    );
  }
}
