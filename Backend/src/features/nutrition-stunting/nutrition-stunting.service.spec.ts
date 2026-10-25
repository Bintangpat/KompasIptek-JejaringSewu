import { Test, TestingModule } from '@nestjs/testing';
import { NutritionStuntingService } from './nutrition-stunting.service';
import { PrismaService } from '../../core/database/prisma.service';
import { UsersWalletService } from '../users-wallet/users-wallet.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('NutritionStuntingService', () => {
  let service: NutritionStuntingService;

  const mockTx = {
    nutritionPackage: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    wallet: {
      findUnique: jest.fn(),
    },
    unifiedTransaction: {
      create: jest.fn(),
    },
    nutritionRedemption: {
      create: jest.fn(),
    },
  };

  const mockPrisma = {
    nutritionPackage: { findMany: jest.fn() },
    nutritionRedemption: { findMany: jest.fn() },
    $transaction: jest.fn((callback) => callback(mockTx)),
  };

  const mockWalletService = {
    mutateWallet: jest.fn().mockResolvedValue({
      pointsBalance: new Prisma.Decimal(25),
      cashBalance: new Prisma.Decimal(0),
    }),
  };

  const mockCrypto = {
    generateTxToken: jest.fn(() => 'mocked.nutrition.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutritionStuntingService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: UsersWalletService, useValue: mockWalletService },
        { provide: CryptoService, useValue: mockCrypto },
      ],
    }).compile();

    service = module.get<NutritionStuntingService>(NutritionStuntingService);
    jest.clearAllMocks();
  });

  it('harus menolak penukaran (409 ERR_STOCK_DEPLETED) jika stok paket gizi sudah habis', async () => {
    mockTx.nutritionPackage.findUnique.mockResolvedValue({
      id: 'pkg-1',
      stockCount: 0,
      pointsCost: new Prisma.Decimal(25),
    });

    await expect(
      service.redeemPackage('user-1', { packageId: 'pkg-1' }),
    ).rejects.toThrow(ConflictException);
  });

  it('harus menolak penukaran (400 ERR_INSUFFICIENT_POINTS) jika poin dompet warga tidak cukup', async () => {
    mockTx.nutritionPackage.findUnique.mockResolvedValue({
      id: 'pkg-1',
      stockCount: 10,
      pointsCost: new Prisma.Decimal(30),
    });
    mockTx.wallet.findUnique.mockResolvedValue({
      id: 'wallet-1',
      pointsBalance: new Prisma.Decimal(10), // Hanya punya 10 poin
    });

    await expect(
      service.redeemPackage('user-1', { packageId: 'pkg-1' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('harus sukses memproses penukaran paket gizi dan memotong poin secara atomik', async () => {
    mockTx.nutritionPackage.findUnique.mockResolvedValue({
      id: 'pkg-1',
      packageName: 'Paket Telur & Lele',
      stockCount: 10,
      pointsCost: new Prisma.Decimal(25),
      pekonId: 'pekon-1',
    });
    mockTx.wallet.findUnique.mockResolvedValue({
      id: 'wallet-1',
      pointsBalance: new Prisma.Decimal(50),
    });
    mockTx.unifiedTransaction.create.mockResolvedValue({ id: 'tx-nut-1' });
    mockTx.nutritionRedemption.create.mockResolvedValue({
      id: 'red-1',
      status: 'CLAIMED',
    });

    const result = await service.redeemPackage('user-1', { packageId: 'pkg-1' });

    expect(result.redemptionId).toEqual('red-1');
    expect(result.remainingPoints).toEqual(new Prisma.Decimal(25));
    expect(mockTx.nutritionPackage.update).toHaveBeenCalledWith({
      where: { id: 'pkg-1' },
      data: { stockCount: { decrement: 1 } },
    });
    expect(mockWalletService.mutateWallet).toHaveBeenCalledTimes(1);
  });
});
