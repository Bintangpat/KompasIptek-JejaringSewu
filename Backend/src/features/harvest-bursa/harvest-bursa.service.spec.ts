import { Test, TestingModule } from '@nestjs/testing';
import { HarvestBursaService } from './harvest-bursa.service';
import { PrismaService } from '../../core/database/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { ForbiddenException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('HarvestBursaService', () => {
  let service: HarvestBursaService;
  let prisma: PrismaService;

  const mockPrisma = {
    harvestListing: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    harvestBid: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    unifiedTransaction: {
      create: jest.fn(),
    },
    collectorReferral: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  const mockCrypto = {
    generateTxToken: jest.fn(() => 'mocked.tx.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestBursaService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CryptoService, useValue: mockCrypto },
      ],
    }).compile();

    service = module.get<HarvestBursaService>(HarvestBursaService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('harus menolak tawaran jika petani menawar hasil panen miliknya sendiri (403 Forbidden)', async () => {
    mockPrisma.harvestListing.findUnique.mockResolvedValue({
      id: 'listing-1',
      farmerId: 'farmer-1',
      status: 'OPEN_BIDDING',
    });

    await expect(
      service.placeBid('farmer-1', 'listing-1', { offeredPricePerKg: 2500 }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('harus menolak persetujuan tawaran jika bukan dilakukan oleh petani pemilik (403 Forbidden)', async () => {
    mockPrisma.harvestBid.findUnique.mockResolvedValue({
      id: 'bid-1',
      listingId: 'listing-1',
      collectorId: 'collector-1',
      listing: {
        id: 'listing-1',
        farmerId: 'farmer-original',
        status: 'OPEN_BIDDING',
      },
    });

    await expect(
      service.acceptBid('farmer-impostor', 'bid-1'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('harus berhasil mengunci bursa panen dan membuat UnifiedTransaction secara atomik saat deal disetujui', async () => {
    mockPrisma.harvestBid.findUnique.mockResolvedValue({
      id: 'bid-1',
      listingId: 'listing-1',
      collectorId: 'collector-1',
      offeredPricePerKg: new Prisma.Decimal(2500),
      listing: {
        id: 'listing-1',
        farmerId: 'farmer-1',
        estimatedKg: new Prisma.Decimal(1000),
        status: 'OPEN_BIDDING',
      },
    });

    mockPrisma.harvestListing.update.mockResolvedValue({ id: 'listing-1', status: 'DEAL_LOCKED' });
    mockPrisma.harvestBid.update.mockResolvedValue({ id: 'bid-1', isAccepted: true });
    mockPrisma.unifiedTransaction.create.mockResolvedValue({
      id: 'tx-123',
      transactionToken: 'mocked.tx.token',
      status: 'AWAITING_SELFIE_POW',
      grossAmount: new Prisma.Decimal(2500000),
    });

    const result = await service.acceptBid('farmer-1', 'bid-1', 'idempotency-key-1');

    expect(result.status).toEqual('AWAITING_SELFIE_POW');
    expect(result.transactionToken).toEqual('mocked.tx.token');
    expect(mockPrisma.harvestListing.update).toHaveBeenCalledWith({
      where: { id: 'listing-1' },
      data: { status: 'DEAL_LOCKED' },
    });
  });
});
