import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../core/database/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import {
  RegisterDto,
  LoginDto,
  GoogleLoginDto,
  SendOtpDto,
  VerifyOtpDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
  ) {}

  // 1. Registrasi Akun Warga / Pengepul / UMKM
  async register(dto: RegisterDto) {
    const pekon = await this.prisma.pekon.findUnique({
      where: { id: dto.pekonId },
    });
    if (!pekon) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Wilayah Pekon yang dipilih tidak terdaftar di sistem.',
      });
    }

    const nikHash = this.cryptoService.hashNik(dto.nik);

    // Cek duplikasi NIK, Nomor Telepon, atau Email
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { nikHash },
          { phoneNumber: dto.phoneNumber },
          ...(dto.email ? [{ email: dto.email }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException({
        errorCode: 'ERR_DUPLICATE_ENTRY',
        message:
          'NIK, nomor WhatsApp, atau email sudah terdaftar dalam sistem.',
      });
    }

    const nikEncrypted = this.cryptoService.encryptNik(dto.nik);
    const passwordHash = await argon2.hash(dto.password);
    const referralCode = `JS-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          nikHash,
          nikEncrypted,
          fullName: dto.fullName,
          phoneNumber: dto.phoneNumber,
          email: dto.email || null,
          passwordHash,
          pekonId: dto.pekonId,
          referralCode,
          vulnerabilityFlags: dto.vulnerabilityFlags || ['NONE'],
        },
      });

      // Buat dompet buku besar (Wallet)
      await tx.wallet.create({
        data: {
          userId: user.id,
        },
      });

      // Buat event OTP di Outbox
      const otpCode = this.cryptoService.generateOtp();
      const otpHash = this.cryptoService.hashOtp(otpCode);

      await this.redis.set(
        `otp:REGISTRATION:${user.id}`,
        otpHash,
        'EX',
        300, // 5 menit TTL
      );

      await tx.outboxEvent.create({
        data: {
          eventType: 'FCM_OTP',
          payload: {
            userId: user.id,
            phoneNumber: dto.phoneNumber,
            purpose: 'REGISTRATION',
            otpCode, // Dalam dev/testing, disimpan di event outbox
          },
        },
      });

      return {
        userId: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        message:
          'Registrasi berhasil. Kode OTP verifikasi dikirimkan ke perangkat Anda.',
      };
    });
  }

  // 2. Login dengan Nomor HP / Email & Password
  async loginWithIdentifier(dto: LoginDto, ipAddress?: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber: dto.identifier }, { email: dto.identifier }],
      },
      include: { wallet: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException({
        errorCode: 'ERR_AUTH_INVALID_CREDENTIALS',
        message: 'Nomor WhatsApp/Email atau kata sandi salah.',
      });
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        errorCode: 'ERR_AUTH_INVALID_CREDENTIALS',
        message: 'Nomor WhatsApp/Email atau kata sandi salah.',
      });
    }

    return this.createSessionAndIssueTokens(user, dto.deviceId, ipAddress);
  }

  // 3. Login dengan Google OAuth2
  async loginWithGoogle(dto: GoogleLoginDto, ipAddress?: string) {
    // Stub / Decoded payload handler untuk Google Sign-In
    const dummyGoogleSub = `google_${dto.idToken.substring(0, 16)}`;
    const dummyEmail = `google_${dto.idToken.substring(0, 8)}@gmail.com`;

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: dummyGoogleSub }, { email: dummyEmail }],
      },
      include: { wallet: true },
    });

    if (!user) {
      // Registrasi otomatis pengguna Google
      const dummyNik = `1801${Date.now().toString().slice(-12)}`;
      const nikHash = this.cryptoService.hashNik(dummyNik);
      const nikEncrypted = this.cryptoService.encryptNik(dummyNik);
      const referralCode = `JS-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      const dummyPhone = `08${Date.now().toString().slice(-9)}`;

      user = await this.prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            nikHash,
            nikEncrypted,
            fullName: 'Pengguna Google',
            phoneNumber: dummyPhone,
            email: dummyEmail,
            googleId: dummyGoogleSub,
            pekonId: dto.pekonId,
            referralCode,
            isEmailVerified: true,
            vulnerabilityFlags: ['NONE'],
          },
          include: { wallet: true },
        });

        await tx.wallet.create({
          data: { userId: newUser.id },
        });

        return newUser;
      });
    }

    return this.createSessionAndIssueTokens(user, dto.deviceId, ipAddress);
  }

  // 4. Generate dan Kirim OTP
  async generateAndSendOtp(dto: SendOtpDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber: dto.identifier }, { email: dto.identifier }],
      },
    });

    if (!user) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Pengguna dengan nomor WhatsApp atau email tidak ditemukan.',
      });
    }

    const otpCode = this.cryptoService.generateOtp();
    const otpHash = this.cryptoService.hashOtp(otpCode);

    await this.redis.set(
      `otp:${dto.purpose}:${user.id}`,
      otpHash,
      'EX',
      300,
    );

    await this.prisma.outboxEvent.create({
      data: {
        eventType: 'FCM_OTP',
        payload: {
          userId: user.id,
          phoneNumber: user.phoneNumber,
          purpose: dto.purpose,
          otpCode,
        },
      },
    });

    return {
      message: 'Kode OTP telah berhasil dikirimkan via FCM Push Notification.',
    };
  }

  // 5. Verifikasi OTP
  async verifyOtp(dto: VerifyOtpDto, purpose: string = 'REGISTRATION') {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber: dto.identifier }, { email: dto.identifier }],
      },
    });

    if (!user) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Pengguna tidak ditemukan.',
      });
    }

    const redisKey = `otp:${purpose}:${user.id}`;
    const storedHash = await this.redis.get(redisKey);

    if (!storedHash) {
      throw new BadRequestException({
        errorCode: 'ERR_OTP_INVALID_OR_EXPIRED',
        message: 'Kode OTP tidak ditemukan atau telah kedaluwarsa.',
      });
    }

    const incomingHash = this.cryptoService.hashOtp(dto.otpCode);
    if (storedHash !== incomingHash) {
      throw new BadRequestException({
        errorCode: 'ERR_OTP_INVALID_OR_EXPIRED',
        message: 'Kode OTP yang Anda masukkan salah.',
      });
    }

    // Hapus kode OTP yang telah digunakan
    await this.redis.del(redisKey);

    return {
      success: true,
      message: 'Verifikasi kode OTP berhasil.',
    };
  }

  // 6. Inisiasi Lupa Sandi
  async initiateForgotPassword(identifier: string) {
    return this.generateAndSendOtp({
      identifier,
      purpose: 'FORGOT_PASSWORD',
    });
  }

  // 7. Atur Ulang Kata Sandi
  async resetPasswordWithOtp(dto: ResetPasswordDto) {
    await this.verifyOtp(
      { identifier: dto.identifier, otpCode: dto.otpCode },
      'FORGOT_PASSWORD',
    );

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ phoneNumber: dto.identifier }, { email: dto.identifier }],
      },
    });

    if (!user) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Pengguna tidak ditemukan.',
      });
    }

    const newPasswordHash = await argon2.hash(dto.newPassword);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });

      // Cabut semua sesi aktif pengguna demi keamanan
      await tx.userSession.updateMany({
        where: { userId: user.id },
        data: { isRevoked: true },
      });
    });

    return {
      message:
        'Kata sandi berhasil diatur ulang. Semua sesi lama telah dicabut.',
    };
  }

  // 8. Refresh Token Rotation & Reuse Detection
  async rotateRefreshToken(oldRefreshToken: string, ipAddress?: string) {
    const oldHash = this.cryptoService.hashRefreshToken(oldRefreshToken);

    const session = await this.prisma.userSession.findUnique({
      where: { refreshTokenHash: oldHash },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException({
        errorCode: 'ERR_AUTH_TOKEN_EXPIRED',
        message: 'Sesi tidak valid atau telah kedaluwarsa.',
      });
    }

    // Deteksi Pencurian Token (Token Reuse Detection)
    if (session.isRevoked) {
      await this.prisma.userSession.updateMany({
        where: { tokenFamily: session.tokenFamily },
        data: { isRevoked: true },
      });

      throw new UnauthorizedException({
        errorCode: 'ERR_AUTH_TOKEN_EXPIRED',
        message:
          'Terdeteksi penggunaan sesi yang mencurigakan. Seluruh sesi telah dicabut.',
      });
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException({
        errorCode: 'ERR_AUTH_TOKEN_EXPIRED',
        message: 'Sesi telah kedaluwarsa. Silakan login kembali.',
      });
    }

    // Buat token baru & rotasikan
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash =
      this.cryptoService.hashRefreshToken(newRefreshToken);

    return this.prisma.$transaction(async (tx) => {
      // Cabut token lama
      await tx.userSession.update({
        where: { id: session.id },
        data: { isRevoked: true },
      });

      // Terbitkan sesi baru dalam tokenFamily yang sama
      const newSession = await tx.userSession.create({
        data: {
          userId: session.userId,
          tokenFamily: session.tokenFamily,
          refreshTokenHash: newRefreshTokenHash,
          deviceId: session.deviceId,
          ipAddress: ipAddress || session.ipAddress,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      const accessToken = this.signAccessToken(session.user, newSession.id);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    });
  }

  // 9. Logout & Cabut Sesi
  async revokeSession(refreshToken: string) {
    const hash = this.cryptoService.hashRefreshToken(refreshToken);
    await this.prisma.userSession.updateMany({
      where: { refreshTokenHash: hash },
      data: { isRevoked: true },
    });
  }

  // --- Helper Methods ---
  private async createSessionAndIssueTokens(
    user: any,
    deviceId: string,
    ipAddress?: string,
  ) {
    const tokenFamily = uuidv4();
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash =
      this.cryptoService.hashRefreshToken(refreshToken);

    const session = await this.prisma.userSession.create({
      data: {
        userId: user.id,
        tokenFamily,
        refreshTokenHash,
        deviceId,
        ipAddress: ipAddress || null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = this.signAccessToken(user, session.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        pekonId: user.pekonId,
        vulnerabilityFlags: user.vulnerabilityFlags,
        pointsBalance: user.wallet?.pointsBalance || 0,
        cashBalance: user.wallet?.cashBalance || 0,
      },
    };
  }

  private signAccessToken(user: any, sessionId: string): string {
    const payload = {
      sub: user.id,
      pekonId: user.pekonId,
      role: user.role,
      vulFlags: user.vulnerabilityFlags || [],
      jti: sessionId,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
    });
  }
}
