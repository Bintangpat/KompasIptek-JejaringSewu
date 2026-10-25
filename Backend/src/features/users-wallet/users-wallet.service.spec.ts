import { Test, TestingModule } from '@nestjs/testing';
import { UsersWalletService } from './users-wallet.service';
import { PrismaService } from '../../core/database/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import {
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('UsersWalletService', () => {
  let service: UsersWalletService;
  let prisma: PrismaService;
  let cryptoService: CryptoService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    wallet: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    ledgerEntry: {
      createMany: jest.fn(),
    },
  };

  const mockCrypto = {
    hashNik: jest.fn((nik: string) => `hash_${nik}`),
    generateLedgerSignature: jest.fn(() => 'valid_hmac_signature'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersWalletService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CryptoService, useValue: mockCrypto },
      ],
    }).compile();

    service = module.get<UsersWalletService>(UsersWalletService);
    prisma = module.get<PrismaService>(PrismaService);
    cryptoService = module.get<CryptoService>(CryptoService);
    jest.clearAllMocks();
  });

  it('harus berhasil memverifikasi NIK warga jika input NIK cocok dengan hash (200 OK)', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      nikHash: 'hash_1801051234560001',
    });
    mockPrisma.user.update.mockResolvedValue({ id: 'user-1', isNikVerified: true });

    const result = await service.verifyNikByAdmin('admin-1', {
      userId: 'user-1',
      nikInput: '1801051234560001',
    });

    expect(result.success).toBe(true);
    expect(result.isNikVerified).toBe(true);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { isNikVerified: true },
    });
  });

  it('harus menolak verifikasi (422 ERR_NIK_VERIFICATION_FAILED) jika input NIK tidak cocok', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      nikHash: 'hash_1801051234560001',
    });

    await expect(
      service.verifyNikByAdmin('admin-1', {
        userId: 'user-1',
        nikInput: '1801059999999999',
      }),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('harus menolak mutasi dompet (400 ERR_INSUFFICIENT_POINTS) jika saldo poin tidak cukup', async () => {
    const mockTx = {
      wallet: {
        findUniqueOrThrow: jest.fn().mockResolvedValue({
          id: 'w-1',
          pointsBalance: new Prisma.Decimal(10),
          cashBalance: new Prisma.Decimal(0),
          version: 1,
        }),
        update: jest.fn(),
      },
      ledgerEntry: {
        createMany: jest.fn(),
      },
    } as unknown as Prisma.TransactionClient;

    await expect(
      service.mutateWallet(mockTx, 'w-1', 'tx-1', { pointsDelta: -50 }),
    ).rejects.toThrow(BadRequestException);
  });
});
