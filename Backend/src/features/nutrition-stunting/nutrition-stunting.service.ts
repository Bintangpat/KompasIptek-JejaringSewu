import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../core/database/prisma.service';
import { UsersWalletService } from '../users-wallet/users-wallet.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { RedeemPackageDto, PackageQueryDto, RestockPackageDto } from './dto/nutrition.dto';

@Injectable()
export class NutritionStuntingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersWalletService: UsersWalletService,
    private readonly cryptoService: CryptoService,
  ) {}

  // 1. Katalog Paket Gizi Intervensi Stunting
  async getPackages(query: PackageQueryDto) {
    return this.prisma.nutritionPackage.findMany({
      where: {
        pekonId: query.pekonId,
      },
      include: {
        pekon: {
          select: {
            id: true,
            namaPekon: true,
            kecamatan: true,
          },
        },
      },
      orderBy: { pointsCost: 'asc' },
    });
  }

  // 2. Riwayat Penukaran Paket Gizi Saya
  async getMyRedemptions(userId: string) {
    return this.prisma.nutritionRedemption.findMany({
      where: { userId },
      include: {
        package: {
          include: {
            pekon: {
              select: {
                namaPekon: true,
                kecamatan: true,
              },
            },
          },
        },
      },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  // 3. Penukaran Poin ke Paket Gizi (Atomik: Cek Stok, Validasi Poin, Mutasi Wallet)
  async redeemPackage(userId: string, dto: RedeemPackageDto) {
    return this.prisma.$transaction(
      async (tx) => {
        const pkg = await tx.nutritionPackage.findUnique({
          where: { id: dto.packageId },
        });

        if (!pkg) {
          throw new NotFoundException({
            errorCode: 'ERR_RESOURCE_NOT_FOUND',
            message: 'Paket gizi tidak ditemukan.',
          });
        }

        if (pkg.stockCount <= 0) {
          throw new ConflictException({
            errorCode: 'ERR_STOCK_DEPLETED',
            message: 'Stok paket pangan bergizi di pekon ini telah habis.',
          });
        }

        const wallet = await tx.wallet.findUnique({
          where: { userId },
        });

        if (!wallet) {
          throw new NotFoundException({
            errorCode: 'ERR_RESOURCE_NOT_FOUND',
            message: 'Dompet pengguna tidak ditemukan.',
          });
        }

        if (wallet.pointsBalance.lessThan(pkg.pointsCost)) {
          throw new BadRequestException({
            errorCode: 'ERR_INSUFFICIENT_POINTS',
            message: `Poin tidak mencukupi. Anda memerlukan ${pkg.pointsCost} poin, saldo Anda ${wallet.pointsBalance} poin.`,
          });
        }

        // 1. Kurangi stok paket gizi
        await tx.nutritionPackage.update({
          where: { id: dto.packageId },
          data: { stockCount: { decrement: 1 } },
        });

        // 2. Buat UnifiedTransaction untuk audit ledger
        const txId = uuidv4();
        const txToken = this.cryptoService.generateTxToken(
          txId,
          userId,
          pkg.pekonId,
        );

        const unifiedTx = await tx.unifiedTransaction.create({
          data: {
            id: txId,
            idempotencyKey: uuidv4(),
            transactionToken: txToken,
            type: 'NUTRITION_REDEEM',
            referenceEntityId: pkg.id,
            initiatorId: userId,
            counterpartyId: userId,
            grossAmount: pkg.pointsCost,
            status: 'VERIFIED_COMPLETED',
            completedAt: new Date(),
          },
        });

        // 3. Potong poin dompet melalui double-entry ledger
        const updatedWallet = await this.usersWalletService.mutateWallet(
          tx,
          wallet.id,
          unifiedTx.id,
          {
            pointsDelta: pkg.pointsCost.negated(),
          },
        );

        // 4. Rekam data penukaran
        const redemption = await tx.nutritionRedemption.create({
          data: {
            userId,
            packageId: dto.packageId,
            pointsSpent: pkg.pointsCost,
            status: 'CLAIMED',
          },
        });

        return {
          redemptionId: redemption.id,
          packageName: pkg.packageName,
          pointsSpent: pkg.pointsCost,
          remainingPoints: updatedWallet.pointsBalance,
          message:
            'Paket pangan bergizi lokal berhasil ditukarkan. Silakan ambil paket di BUMDes/Posyandu Pekon.',
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  // 4. Tambah Stok Paket Gizi oleh BUMDes
  async restockPackage(packageId: string, dto: RestockPackageDto) {
    const pkg = await this.prisma.nutritionPackage.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Paket gizi tidak ditemukan.',
      });
    }

    const updated = await this.prisma.nutritionPackage.update({
      where: { id: packageId },
      data: {
        stockCount: {
          increment: dto.additionalStock,
        },
      },
    });

    return {
      success: true,
      packageId: updated.id,
      packageName: updated.packageName,
      newStockCount: updated.stockCount,
      message: `Berhasil menambahkan ${dto.additionalStock} stok paket gizi.`,
    };
  }

  // 5. Antrean Penukaran Paket Gizi per Pekon (Otoritas BUMDes)
  async getRedemptionsByPekon(pekonId: string) {
    return this.prisma.nutritionRedemption.findMany({
      where: {
        package: {
          pekonId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            isNikVerified: true,
            vulnerabilityFlags: true,
            hasToddler: true,
          },
        },
        package: {
          select: {
            id: true,
            packageName: true,
            pointsCost: true,
            stockCount: true,
          },
        },
      },
      orderBy: { redeemedAt: 'desc' },
    });
  }

  // 6. Konfirmasi Serah Terima Fisik Paket Gizi oleh BUMDes
  async completeRedemption(redemptionId: string) {
    const redemption = await this.prisma.nutritionRedemption.findUnique({
      where: { id: redemptionId },
      include: { package: true, user: true },
    });

    if (!redemption) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Data penukaran tidak ditemukan.',
      });
    }

    if (redemption.status === 'COMPLETED') {
      return {
        success: true,
        redemptionId: redemption.id,
        status: 'COMPLETED',
        message: 'Paket telah diserahterimakan sebelumnya.',
      };
    }

    const updated = await this.prisma.nutritionRedemption.update({
      where: { id: redemptionId },
      data: { status: 'COMPLETED' },
    });

    return {
      success: true,
      redemptionId: updated.id,
      status: updated.status,
      message: 'Paket pangan bergizi sukses diserahterimakan kepada warga.',
    };
  }
}
