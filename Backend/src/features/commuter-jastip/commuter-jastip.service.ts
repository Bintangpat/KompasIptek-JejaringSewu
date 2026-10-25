import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../core/database/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import {
  StartRouteDto,
  PingGpsDto,
  NearbyQueryDto,
  CreateOrderDto,
} from './dto/commuter.dto';

@Injectable()
export class CommuterJastipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  // 1. Komuter Mulai Rute Searah
  async startRoute(commuterId: string, dto: StartRouteDto) {
    return this.prisma.commuterRoute.create({
      data: {
        commuterId,
        originName: dto.originName,
        destinationName: dto.destinationName,
        originLat: new Prisma.Decimal(dto.originLat),
        originLng: new Prisma.Decimal(dto.originLng),
        destLat: new Prisma.Decimal(dto.destLat),
        destLng: new Prisma.Decimal(dto.destLng),
        currentLat: new Prisma.Decimal(dto.originLat),
        currentLng: new Prisma.Decimal(dto.originLng),
        isActive: true,
      },
    });
  }

  // 2. Ping Koordinat GPS Terkini Komuter
  async pingGps(commuterId: string, routeId: string, dto: PingGpsDto) {
    const route = await this.prisma.commuterRoute.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Rute perjalanan tidak ditemukan.',
      });
    }

    if (route.commuterId !== commuterId) {
      throw new ForbiddenException({
        errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
        message: 'Hanya pengemudi rute yang dapat memperbarui koordinat GPS.',
      });
    }

    if (!route.isActive) {
      throw new ConflictException({
        errorCode: 'ERR_CONFLICT_STATE',
        message: 'Rute perjalanan sudah berakhir.',
      });
    }

    return this.prisma.commuterRoute.update({
      where: { id: routeId },
      data: {
        currentLat: new Prisma.Decimal(dto.currentLat),
        currentLng: new Prisma.Decimal(dto.currentLng),
      },
    });
  }

  // 3. Pencarian Rute Komuter Terdekat Menggunakan PostGIS Spatial Query
  async findNearbyRoutes(dto: NearbyQueryDto) {
    const radiusMeters = (dto.radiusKm || 5) * 1000;

    return this.prisma.$queryRaw<any[]>`
      SELECT cr.*, 
        ST_Distance(
          ST_SetSRID(ST_MakePoint(${dto.lng}, ${dto.lat}), 4326)::geography,
          ST_SetSRID(ST_MakePoint(cr."currentLng"::float8, cr."currentLat"::float8), 4326)::geography
        ) AS distance_meters
      FROM "CommuterRoute" cr
      WHERE cr."isActive" = true
        AND cr."currentLat" IS NOT NULL
        AND ST_DWithin(
          ST_SetSRID(ST_MakePoint(${dto.lng}, ${dto.lat}), 4326)::geography,
          ST_SetSRID(ST_MakePoint(cr."currentLng"::float8, cr."currentLat"::float8), 4326)::geography,
          ${radiusMeters}
        )
      ORDER BY distance_meters ASC
      LIMIT 20
    `;
  }

  // 4. Titip Barang pada Rute Komuter
  async createOrder(requesterId: string, routeId: string, dto: CreateOrderDto) {
    const route = await this.prisma.commuterRoute.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Rute komuter tidak ditemukan.',
      });
    }

    if (!route.isActive) {
      throw new ConflictException({
        errorCode: 'ERR_CONFLICT_STATE',
        message: 'Rute komuter sudah tidak aktif.',
      });
    }

    if (route.commuterId === requesterId) {
      throw new ForbiddenException({
        errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
        message: 'Pengemudi tidak dapat menitip barang ke rute miliknya sendiri.',
      });
    }

    return this.prisma.jastipOrder.create({
      data: {
        routeId,
        requesterId,
        itemDescription: dto.itemDescription,
        fuelShareCost: new Prisma.Decimal(dto.fuelShareCost),
        pickupLat: new Prisma.Decimal(dto.pickupLat),
        pickupLng: new Prisma.Decimal(dto.pickupLng),
        status: 'REQUESTED',
      },
    });
  }

  // 5. Komuter Menerima Titipan -> Buat UnifiedTransaction Atomik
  async acceptOrder(
    commuterId: string,
    orderId: string,
    idempotencyKey?: string,
  ) {
    const safeKey = idempotencyKey || uuidv4();

    return this.prisma.$transaction(
      async (tx) => {
        const order = await tx.jastipOrder.findUnique({
          where: { id: orderId },
          include: { route: true },
        });

        if (!order) {
          throw new NotFoundException({
            errorCode: 'ERR_RESOURCE_NOT_FOUND',
            message: 'Pesanan titipan tidak ditemukan.',
          });
        }

        if (order.route.commuterId !== commuterId) {
          throw new ForbiddenException({
            errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
            message:
              'Hanya pengemudi rute yang berhak menerima pesanan jastip ini.',
          });
        }

        if (order.status !== 'REQUESTED') {
          throw new ConflictException({
            errorCode: 'ERR_CONFLICT_STATE',
            message: 'Pesanan jastip ini sudah tidak dalam status menunggu konfirmasi.',
          });
        }

        await tx.jastipOrder.update({
          where: { id: orderId },
          data: { status: 'ACCEPTED' },
        });

        const txId = uuidv4();
        const transactionToken = this.cryptoService.generateTxToken(
          txId,
          order.requesterId,
          commuterId,
        );

        const unifiedTx = await tx.unifiedTransaction.create({
          data: {
            id: txId,
            idempotencyKey: safeKey,
            transactionToken,
            type: 'NEBENG_JASTIP',
            referenceEntityId: order.id,
            initiatorId: order.requesterId,
            counterpartyId: commuterId,
            grossAmount: order.fuelShareCost,
            status: 'LOCKED_ASSIGNED',
          },
        });

        return {
          transactionId: unifiedTx.id,
          transactionToken: unifiedTx.transactionToken,
          status: unifiedTx.status,
          message:
            'Titipan jastip berhasil diterima. Transaksi siap dilaksanakan.',
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }
}
