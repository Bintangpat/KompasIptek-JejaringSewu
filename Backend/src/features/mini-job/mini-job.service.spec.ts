import { Test, TestingModule } from '@nestjs/testing';
import { MiniJobService } from './mini-job.service';
import { PrismaService } from '../../core/database/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('MiniJobService - Zero Discrimination Auto-Accept Lock', () => {
  let service: MiniJobService;

  const mockTx = {
    $queryRaw: jest.fn(),
    user: {
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
    },
    miniJob: { update: jest.fn() },
    unifiedTransaction: { create: jest.fn() },
  };

  const mockPrisma = {
    $transaction: jest.fn((callback) => callback(mockTx)),
  };

  const mockCrypto = {
    generateTxToken: jest.fn(() => 'mocked.minijob.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MiniJobService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CryptoService, useValue: mockCrypto },
      ],
    }).compile();

    service = module.get<MiniJobService>(MiniJobService);
    jest.clearAllMocks();
  });

  it('harus mengunci otomatis (autoAcceptLock: true) saat pekerja disabilitas mengambil tugas ramah disabilitas', async () => {
    mockTx.$queryRaw.mockResolvedValue([
      {
        id: 'job-1',
        employerId: 'umkm-1',
        wageAmount: new Prisma.Decimal(50000),
        isDisabilityFriendly: true,
        version: 1,
      },
    ]);
    mockTx.user.findUniqueOrThrow.mockResolvedValue({
      id: 'worker-disabilitas-1',
      vulnerabilityFlags: ['DISABILITAS_FISIK'],
    });
    mockTx.miniJob.update.mockResolvedValue({
      id: 'job-1',
      status: 'LOCKED_BY_PRIORITY',
      autoAcceptLock: true,
      workerId: 'worker-disabilitas-1',
    });
    mockTx.unifiedTransaction.create.mockResolvedValue({
      id: 'tx-1',
      status: 'LOCKED_ASSIGNED',
      transactionToken: 'mocked.minijob.token',
    });

    const result = await service.claimDisabilityMiniJob(
      'job-1',
      'worker-disabilitas-1',
      'idem-key-001',
    );

    expect(result.job.autoAcceptLock).toBe(true);
    expect(result.job.status).toBe('LOCKED_BY_PRIORITY');
    expect(mockTx.unifiedTransaction.create).toHaveBeenCalledTimes(1);
    expect(mockTx.user.update).toHaveBeenCalledWith({
      where: { id: 'umkm-1' },
      data: { employerInclusionCount: { increment: 1 } },
    });
  });

  it('harus melempar ForbiddenException (403) jika pengguna non-prioritas mengambil tugas khusus disabilitas', async () => {
    mockTx.$queryRaw.mockResolvedValue([
      {
        id: 'job-1',
        employerId: 'umkm-1',
        wageAmount: new Prisma.Decimal(50000),
        isDisabilityFriendly: true,
        version: 1,
      },
    ]);
    mockTx.user.findUniqueOrThrow.mockResolvedValue({
      id: 'worker-umum',
      vulnerabilityFlags: ['NONE'],
    });

    await expect(
      service.claimDisabilityMiniJob('job-1', 'worker-umum', 'idem-key-002'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('harus melempar ConflictException (409) jika tugas sudah dikunci pekerja lain pada milidetik yang sama', async () => {
    mockTx.$queryRaw.mockResolvedValue([]); // Baris tidak ditemukan karena status bukan OPEN

    await expect(
      service.claimDisabilityMiniJob(
        'job-1',
        'worker-disabilitas-2',
        'idem-key-003',
      ),
    ).rejects.toThrow(ConflictException);
  });
});
