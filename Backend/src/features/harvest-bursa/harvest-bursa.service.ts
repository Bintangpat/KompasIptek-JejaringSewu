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
  CreateListingDto,
  ListingQueryDto,
  PlaceBidDto,
} from './dto/harvest.dto';

@Injectable()
export class HarvestBursaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  // 1. Petani Pasang Hasil Panen
  async createListing(
    farmerId: string,
    pekonId: string,
    dto: CreateListingDto,
  ) {
    return this.prisma.harvestListing.create({
      data: {
        farmerId,
        pekonId,
        commodityName: dto.commodityName.trim(),
        estimatedKg: new Prisma.Decimal(dto.estimatedKg),
        minPricePerKg: new Prisma.Decimal(dto.minPricePerKg),
        status: 'OPEN_BIDDING',
      },
    });
  }

  // 2. Katalog Komoditas Panen Terbuka
  async getListings(query: ListingQueryDto) {
    return this.prisma.harvestListing.findMany({
      where: {
        pekonId: query.pekonId,
        commodityName: query.commodityName
          ? { contains: query.commodityName, mode: 'insensitive' }
          : undefined,
        status: query.status || 'OPEN_BIDDING',
      },
      include: {
        farmer: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            isTrustedCollector: true,
          },
        },
        pekon: {
          select: {
            id: true,
            namaPekon: true,
            kecamatan: true,
          },
        },
        bids: {
          orderBy: { offeredPricePerKg: 'desc' },
          take: 5,
          include: {
            collector: {
              select: {
                id: true,
                fullName: true,
                isTrustedCollector: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Pengepul Ajukan Penawaran Harga
  async placeBid(collectorId: string, listingId: string, dto: PlaceBidDto) {
    const listing = await this.prisma.harvestListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Komoditas panen tidak ditemukan.',
      });
    }

    if (listing.status !== 'OPEN_BIDDING') {
      throw new ConflictException({
        errorCode: 'ERR_CONFLICT_STATE',
        message: 'Penawaran untuk komoditas panen ini telah ditutup/dikunci.',
      });
    }

    if (listing.farmerId === collectorId) {
      throw new ForbiddenException({
        errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
        message: 'Petani tidak dapat menawar komoditas miliknya sendiri.',
      });
    }

    return this.prisma.harvestBid.create({
      data: {
        listingId,
        collectorId,
        offeredPricePerKg: new Prisma.Decimal(dto.offeredPricePerKg),
        referralUsedCode: dto.referralUsedCode || null,
      },
    });
  }

  // 4. Petani Setujui Tawaran -> Kunci Bursa & Buat UnifiedTransaction Atomik
  async acceptBid(farmerId: string, bidId: string, idempotencyKey?: string) {
    const safeIdempotencyKey = idempotencyKey || uuidv4();

    return this.prisma.$transaction(
      async (tx) => {
        const bid = await tx.harvestBid.findUnique({
          where: { id: bidId },
          include: { listing: true },
        });

        if (!bid) {
          throw new NotFoundException({
            errorCode: 'ERR_RESOURCE_NOT_FOUND',
            message: 'Tawaran harga tidak ditemukan.',
          });
        }

        if (bid.listing.farmerId !== farmerId) {
          throw new ForbiddenException({
            errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
            message:
              'Hanya petani pemilik hasil panen yang berhak menyetujui tawaran ini.',
          });
        }

        if (bid.listing.status !== 'OPEN_BIDDING') {
          throw new ConflictException({
            errorCode: 'ERR_CONFLICT_STATE',
            message: 'Komoditas ini sudah disepakati atau tidak dalam status lelang aktif.',
          });
        }

        // Kunci listing agar tidak bisa ditawar lagi
        await tx.harvestListing.update({
          where: { id: bid.listingId },
          data: { status: 'DEAL_LOCKED' },
        });

        // Tandai bid sebagai diterima
        await tx.harvestBid.update({
          where: { id: bidId },
          data: { isAccepted: true },
        });

        // Hitung total nilai transaksi
        const grossAmount = bid.offeredPricePerKg.mul(bid.listing.estimatedKg);
        const txId = uuidv4();
        const transactionToken = this.cryptoService.generateTxToken(
          txId,
          farmerId,
          bid.collectorId,
        );

        // Buat UnifiedTransaction
        const unifiedTx = await tx.unifiedTransaction.create({
          data: {
            id: txId,
            idempotencyKey: safeIdempotencyKey,
            transactionToken,
            type: 'HARVEST_DEAL',
            referenceEntityId: bid.listingId,
            initiatorId: farmerId,
            counterpartyId: bid.collectorId,
            grossAmount,
            status: 'AWAITING_SELFIE_POW',
          },
        });

        // Tangani referral pengepul terpercaya jika ada
        if (bid.referralUsedCode) {
          const referrer = await tx.user.findUnique({
            where: { referralCode: bid.referralUsedCode },
          });

          if (referrer && referrer.id !== bid.collectorId) {
            await tx.collectorReferral.create({
              data: {
                referrerId: referrer.id,
                collectorId: bid.collectorId,
                transactionId: unifiedTx.id,
                microCommission: new Prisma.Decimal(5000), // Rp 5.000 komisi mikro
                reputationPoints: new Prisma.Decimal(10), // 10 poin reputasi
              },
            });
          }
        }

        return {
          transactionId: unifiedTx.id,
          transactionToken: unifiedTx.transactionToken,
          status: unifiedTx.status,
          grossAmount: unifiedTx.grossAmount,
          message:
            'Kesepakatan harga berhasil dikunci. Silakan lanjutkan verifikasi fisik timbangan & Selfie PoW.',
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  // 5. Daftar Pengepul Jujur Terpercaya
  async getTrustedCollectors(pekonId?: string) {
    return this.prisma.user.findMany({
      where: {
        role: 'PENGEPUL',
        isTrustedCollector: true,
        pekonId: pekonId || undefined,
      },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        isTrustedCollector: true,
        pekon: {
          select: {
            namaPekon: true,
            kecamatan: true,
          },
        },
        _count: {
          select: {
            counterpartyTx: {
              where: { status: 'VERIFIED_COMPLETED' },
            },
          },
        },
      },
    });
  }
}
