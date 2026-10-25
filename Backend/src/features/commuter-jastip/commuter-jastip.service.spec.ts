import { Test, TestingModule } from '@nestjs/testing';
import { CommuterJastipService } from './commuter-jastip.service';
import { PrismaService } from '../../core/database/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { ForbiddenException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('CommuterJastipService', () => {
  let service: CommuterJastipService;
  let prisma: PrismaService;

  const mockPrisma = {
    commuterRoute: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    jastipOrder: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    unifiedTransaction: {
      create: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  const mockCrypto = {
    generateTxToken: jest.fn(() => 'mocked.jastip.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommuterJastipService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CryptoService, useValue: mockCrypto },
      ],
    }).compile();

    service = module.get<CommuterJastipService>(CommuterJastipService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('harus menolak pembaruan GPS jika bukan dilakukan oleh pemilik rute (403 Forbidden)', async () => {
    mockPrisma.commuterRoute.findUnique.mockResolvedValue({
      id: 'route-1',
      commuterId: 'commuter-original',
      isActive: true,
    });

    await expect(
      service.pingGps('commuter-impostor', 'route-1', {
        currentLat: -5.35,
        currentLng: 104.98,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('harus menolak titip barang jika pengemudi menitip pada rutenya sendiri (403 Forbidden)', async () => {
    mockPrisma.commuterRoute.findUnique.mockResolvedValue({
      id: 'route-1',
      commuterId: 'user-1',
      isActive: true,
    });

    await expect(
      service.createOrder('user-1', 'route-1', {
        itemDescription: 'Titip Beras 5kg',
        fuelShareCost: 10000,
        pickupLat: -5.35,
        pickupLng: 104.98,
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('harus berhasil menerima pesanan jastip dan membuat UnifiedTransaction atomik', async () => {
    mockPrisma.jastipOrder.findUnique.mockResolvedValue({
      id: 'order-1',
      requesterId: 'requester-1',
      fuelShareCost: new Prisma.Decimal(15000),
      status: 'REQUESTED',
      route: {
        commuterId: 'commuter-1',
      },
    });

    mockPrisma.jastipOrder.update.mockResolvedValue({ id: 'order-1', status: 'ACCEPTED' });
    mockPrisma.unifiedTransaction.create.mockResolvedValue({
      id: 'tx-jastip-1',
      transactionToken: 'mocked.jastip.token',
      status: 'LOCKED_ASSIGNED',
    });

    const result = await service.acceptOrder('commuter-1', 'order-1', 'idempotency-jastip');

    expect(result.status).toEqual('LOCKED_ASSIGNED');
    expect(result.transactionToken).toEqual('mocked.jastip.token');
    expect(mockPrisma.jastipOrder.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'ACCEPTED' },
    });
  });
});
