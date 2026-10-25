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
import { MiniJobService } from './mini-job.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { CreateMiniJobDto, MiniJobQueryDto } from './dto/mini-job.dto';

@UseGuards(JwtAuthGuard)
@Controller('mini-jobs')
export class MiniJobController {
  constructor(private readonly miniJobService: MiniJobService) {}

  @Post()
  async createJob(
    @CurrentUser('userId') employerId: string,
    @Body() dto: CreateMiniJobDto,
  ) {
    return this.miniJobService.createJob(employerId, dto);
  }

  @Get()
  async getJobs(@Query() query: MiniJobQueryDto) {
    return this.miniJobService.getJobs(query);
  }

  @Post(':id/claim')
  @HttpCode(HttpStatus.OK)
  async claimJob(
    @CurrentUser('userId') workerId: string,
    @Param('id') jobId: string,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ) {
    return this.miniJobService.claimDisabilityMiniJob(
      jobId,
      workerId,
      idempotencyKey,
    );
  }
}
