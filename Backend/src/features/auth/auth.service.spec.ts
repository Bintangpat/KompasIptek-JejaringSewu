import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../core/database/prisma.service';
import { RedisService } from '../../core/redis/redis.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthService (Unit Test)', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let redis: RedisService;

  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    pekon: {
      findUnique: jest.fn(),
    },
    userSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  const mockRedis = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  const mockJwt = {
    sign: jest.fn().mockReturnValue('mocked.jwt.access.token'),
  };

  const mockConfig = {
    get: jest.fn((key: string, defaultValue?: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      if (key === 'JWT_EXPIRATION') return '15m';
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        CryptoService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
    jest.clearAllMocks();
  });

  it('harus berhasil login dengan nomor HP/email & password yang valid serta membuat sesi Refresh Token', async () => {
    const hashedPassword = await argon2.hash('SandiKuat123!');
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 'uuid-warga-1',
      fullName: 'Budi Santoso',
      phoneNumber: '081234567890',
      email: 'petani@pekon.id',
      passwordHash: hashedPassword,
      role: 'WARGA',
      pekonId: 'uuid-pekon-1',
      vulnerabilityFlags: ['NONE'],
      wallet: { pointsBalance: 100, cashBalance: 50000 },
    });
    mockPrisma.userSession.create.mockResolvedValue({ id: 'session-1' });

    const result = await service.loginWithIdentifier(
      {
        identifier: '081234567890',
        password: 'SandiKuat123!',
        deviceId: 'expo-android-01',
      },
      '127.0.0.1',
    );

    expect(result).toHaveProperty('accessToken', 'mocked.jwt.access.token');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user).toHaveProperty('id', 'uuid-warga-1');
    expect(mockPrisma.userSession.create).toHaveBeenCalledTimes(1);
  });

  it('harus menolak login (401 ERR_AUTH_INVALID_CREDENTIALS) jika kata sandi salah', async () => {
    const hashedPassword = await argon2.hash('SandiBenar123!');
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 'uuid-warga-1',
      phoneNumber: '081234567890',
      passwordHash: hashedPassword,
    });

    await expect(
      service.loginWithIdentifier(
        {
          identifier: '081234567890',
          password: 'SandiSalah999!',
          deviceId: 'dev-1',
        },
        '127.0.0.1',
      ),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('harus menolak verifikasi OTP (400 ERR_OTP_INVALID_OR_EXPIRED) jika OTP di Redis sudah kedaluwarsa', async () => {
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 'uuid-warga-1',
      phoneNumber: '081234567890',
    });
    mockRedis.get.mockResolvedValue(null); // Simulasi TTL 5 menit habis di Redis

    await expect(
      service.verifyOtp({ identifier: '081234567890', otpCode: '123456' }),
    ).rejects.toThrow(BadRequestException);
  });
});
