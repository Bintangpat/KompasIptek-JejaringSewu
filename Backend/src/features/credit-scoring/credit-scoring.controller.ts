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
import { CreditScoringService } from './credit-scoring.service';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { ApproveLoanDto } from './dto/credit-scoring.dto';

@UseGuards(JwtAuthGuard)
@Controller('credit-scoring')
export class CreditScoringController {
  constructor(
    private readonly creditScoringService: CreditScoringService,
  ) {}

  @Get('me')
  async getMyScore(@CurrentUser('userId') userId: string) {
    return this.creditScoringService.getMyCreditScore(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.ADMIN_BAPPERIDA, Role.SUPER_ADMIN)
  @Get('pekon/:pekonId')
  async getPekonScores(@Param('pekonId') pekonId: string) {
    return this.creditScoringService.getPekonScores(pekonId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.SUPER_ADMIN)
  @Get('loans/eligible')
  async getEligibleLoans(@Query('pekonId') pekonId?: string) {
    return this.creditScoringService.getEligibleLoans(pekonId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.SUPER_ADMIN)
  @Patch('loans/:id/approve')
  @HttpCode(HttpStatus.OK)
  async approveLoan(
    @CurrentUser('userId') adminId: string,
    @Param('id') loanId: string,
    @Body() dto: ApproveLoanDto,
  ) {
    return this.creditScoringService.approveLoan(adminId, loanId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.ADMIN_BAPPERIDA, Role.SUPER_ADMIN)
  @Get('loans/active')
  async getActiveLoans(
    @Query('pekonId') pekonId?: string,
    @Query('status') status?: string,
  ) {
    return this.creditScoringService.getActiveLoans(pekonId, status);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.SUPER_ADMIN)
  @Post('loans/:id/disburse')
  @HttpCode(HttpStatus.OK)
  async disburseLoan(
    @CurrentUser('userId') adminId: string,
    @Param('id') loanId: string,
  ) {
    return this.creditScoringService.disburseLoan(loanId, adminId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_BUMDES, Role.SUPER_ADMIN)
  @Post('loans/:id/repay')
  @HttpCode(HttpStatus.OK)
  async repayLoan(
    @CurrentUser('userId') adminId: string,
    @Param('id') loanId: string,
  ) {
    return this.creditScoringService.repayLoan(loanId, adminId);
  }
}
