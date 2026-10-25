import { Test, TestingModule } from '@nestjs/testing';
import { CreditScoringService } from './credit-scoring.service';
import { PrismaService } from '../../core/database/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('CreditScoringService', () => {
  let service: CreditScoringService;
  let prisma: PrismaService;

  const mockPrisma = {
    creditScoreSnapshot: {
      findFirst: jest.fn(),
    },
    loanRecommendation: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
    outboxEvent: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditScoringService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CreditScoringService>(CreditScoringService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('harus menolak persetujuan pinjaman jika rekomendasi tidak ditemukan (404)', async () => {
    mockPrisma.loanRecommendation.findUnique.mockResolvedValue(null);

    await expect(
      service.approveLoan('admin-1', 'loan-999', {}),
    ).rejects.toThrow(NotFoundException);
  });

  it('harus menolak persetujuan jika pinjaman sudah pernah disetujui sebelumnya (409 Conflict)', async () => {
    mockPrisma.loanRecommendation.findUnique.mockResolvedValue({
      id: 'loan-1',
      status: 'APPROVED',
    });

    await expect(
      service.approveLoan('admin-1', 'loan-1', {}),
    ).rejects.toThrow(ConflictException);
  });

  it('harus berhasil menyetujui pinjaman modal BUMDes dan membuat OutboxEvent notifikasi', async () => {
    mockPrisma.loanRecommendation.findUnique.mockResolvedValue({
      id: 'loan-1',
      userId: 'user-1',
      status: 'ELIGIBLE_WAITING_BUMDES',
      recommendedPlafond: new Prisma.Decimal(1500000),
    });

    mockPrisma.loanRecommendation.update.mockResolvedValue({
      id: 'loan-1',
      status: 'APPROVED',
      recommendedPlafond: new Prisma.Decimal(1500000),
    });

    const result = await service.approveLoan('admin-1', 'loan-1', {
      approvedPlafond: 1500000,
    });

    expect(result.status).toEqual('APPROVED');
    expect(mockPrisma.outboxEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ eventType: 'FCM_PUSH' }),
      }),
    );
  });
});
