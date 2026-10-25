import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from '../../core/decorators/public.decorator';
import {
  LoginDto,
  GoogleLoginDto,
  SendOtpDto,
  VerifyOtpDto,
  ResetPasswordDto,
  RegisterDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('jejaring_pringsewu', refreshToken, {
      httpOnly: true, // Anti-XSS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Hari
    });
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.loginWithIdentifier(dto, req.ip);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken, user };
  }

  @Public()
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async loginGoogle(
    @Body() dto: GoogleLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.loginWithGoogle(dto, req.ip);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken, user };
  }

  @Public()
  @Throttle({ otp_strict: { limit: 3, ttl: 300000 } })
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.generateAndSendOtp(dto);
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Public()
  @Throttle({ otp_strict: { limit: 3, ttl: 300000 } })
  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: SendOtpDto) {
    return this.authService.initiateForgotPassword(dto.identifier);
  }

  @Public()
  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPasswordWithOtp(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies?.['jejaring_pringsewu'];
    if (!oldRefreshToken) {
      throw new UnauthorizedException({
        errorCode: 'ERR_AUTH_TOKEN_EXPIRED',
        message: 'Refresh token tidak ditemukan di cookie.',
      });
    }
    const { accessToken, refreshToken } =
      await this.authService.rotateRefreshToken(oldRefreshToken, req.ip);
    this.setRefreshTokenCookie(res, refreshToken);
    return { accessToken };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['jejaring_pringsewu'];
    if (refreshToken) await this.authService.revokeSession(refreshToken);
    res.clearCookie('jejaring_pringsewu', { path: '/api/v1/auth' });
    return { message: 'Berhasil keluar dari sesi.' };
  }
}
