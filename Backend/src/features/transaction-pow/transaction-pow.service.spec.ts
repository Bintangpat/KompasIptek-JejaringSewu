import { Test, TestingModule } from '@nestjs/testing';
import { TransactionPowService } from './transaction-pow.service';
import { PrismaService } from '../../core/database/prisma.service';
import { UsersWalletService } from '../users-wallet/users-wallet.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('TransactionPowService', () => {
  let service: TransactionPowService;
  let usersWalletService: UsersWalletService;

  const mockTx = {
    unifiedTransaction: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    selfieProofOfWork: {
      create: jest.fn(),
    },
    user: {
      findUniqueOrThrow: jest.fn(),
    },
    creditScoreSnapshot: {
      create: jest.fn(),
    },
    loanRecommendation: {
      create: jest.fn(),
    },
    outboxEvent: {
      create: jest.fn(),
    },
  };

  const mockPrisma = {
    unifiedTransaction: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockTx)),
  };

  const mockWalletService = {
    mutateWallet: jest.fn(),
  };

  const mockCrypto = {
    generateTxToken: jest.fn(() => 'mocked.pow.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionPowService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: UsersWalletService, useValue: mockWalletService },
        { provide: CryptoService, useValue: mockCrypto },
      ],
    }).compile();

    service = module.get<TransactionPowService>(TransactionPowService);
    usersWalletService = module.get<UsersWalletService>(UsersWalletService);
    jest.clearAllMocks();
  });

  it('harus menolak verifikasi (422 ERR_SELFIE_INTEGRITY_MISMATCH) jika foto berasal dari galeri (isCameraDirect: false)', async () => {
    mockTx.unifiedTransaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      initiatorId: 'user-1',
      counterpartyId: 'user-2',
      status: 'AWAITING_SELFIE_POW',
    });

    await expect(
      service.verifySelfiePoW('tx-1', 'user-1', {
        imageStorageUrl: 'https://r2.dev/selfie.jpg',
        imageSha256Hash:
          '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        gpsLatitude: -5.35,
        gpsLongitude: 104.98,
        gpsAccuracyMeters: 10,
        pekonNameOverlay: 'Pekon Pagelaran',
        isCameraDirect: false, // Dari galeri
      }),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('harus memproses 5 langkah atomik dan membuat LoanRecommendation jika skor kredit >= 85', async () => {
    mockTx.unifiedTransaction.findUnique.mockResolvedValue({
      id: 'tx-1',
      type: 'MINI_JOB',
      initiatorId: 'employer-1',
      counterpartyId: 'worker-1',
      grossAmount: new Prisma.Decimal(50000),
      status: 'LOCKED_ASSIGNED',
      version: 1,
      initiator: { wallet: { id: 'w-emp' } },
      counterparty: { wallet: { id: 'w-wrk' } },
    });

    mockTx.user.findUniqueOrThrow.mockResolvedValue({
      id: 'worker-1',
      vulnerabilityFlags: ['DISABILITAS_FISIK'],
      employerInclusionCount: 0,
    });

    // Simulasi riwayat transaksi
    mockTx.unifiedTransaction.findMany.mockResolvedValue([
      { type: 'MINI_JOB', status: 'VERIFIED_COMPLETED' },
      { type: 'MINI_JOB', status: 'VERIFIED_COMPLETED' },
      { type: 'NEBENG_JASTIP', status: 'VERIFIED_COMPLETED' },
    ]);

    mockTx.creditScoreSnapshot.create.mockResolvedValue({
      id: 'score-1',
      totalSkredit: new Prisma.Decimal(92.5),
      grade: 'GRADE_A_LAYAK_MODAL',
    });

    mockTx.loanRecommendation.create.mockResolvedValue({
      id: 'loan-rec-1',
      recommendedPlafond: new Prisma.Decimal(1500000),
      status: 'ELIGIBLE_WAITING_BUMDES',
    });

    const result = await service.verifySelfiePoW('tx-1', 'worker-1', {
      imageStorageUrl: 'https://r2.dev/selfie.jpg',
      imageSha256Hash:
        '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      gpsLatitude: -5.35,
      gpsLongitude: 104.98,
      gpsAccuracyMeters: 15,
      pekonNameOverlay: 'Pekon Pagelaran',
      isCameraDirect: true,
    });

    expect(result.status).toEqual('VERIFIED_COMPLETED');
    expect(result.creditScore.grade).toEqual('GRADE_A_LAYAK_MODAL');
    expect(result.loanRecommendation).toBeDefined();
    expect(mockWalletService.mutateWallet).toHaveBeenCalledTimes(1);
    expect(mockTx.outboxEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ eventType: 'LOAN_ELIGIBLE' }),
      }),
    );
  });
});
