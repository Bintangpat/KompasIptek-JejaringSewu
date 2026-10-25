import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/database/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import {
  UpdateProfileDto,
  VerifyNikDto,
  UpdateFcmTokenDto,
} from './dto/users.dto';

@Injectable()
export class UsersWalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  // 1. Profil Pengguna Saya
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        pekon: true,
        wallet: true,
      },
    });

    if (!user) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Pengguna tidak ditemukan.',
      });
    }

    return {
      id: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      isNikVerified: user.isNikVerified,
      vulnerabilityFlags: user.vulnerabilityFlags,
      hasToddler: user.hasToddler,
      referralCode: user.referralCode,
      isTrustedCollector: user.isTrustedCollector,
      pekon: {
        id: user.pekon.id,
        namaPekon: user.pekon.namaPekon,
        kecamatan: user.pekon.kecamatan,
      },
      wallet: {
        pointsBalance: user.wallet?.pointsBalance || 0,
        cashBalance: user.wallet?.cashBalance || 0,
      },
      createdAt: user.createdAt,
    };
  }

  // 2. Perbarui Profil Pengguna
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName,
        email: dto.email,
        vulnerabilityFlags: dto.vulnerabilityFlags,
        hasToddler: dto.hasToddler,
      },
      include: {
        pekon: true,
        wallet: true,
      },
    });

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      phoneNumber: updatedUser.phoneNumber,
      email: updatedUser.email,
      vulnerabilityFlags: updatedUser.vulnerabilityFlags,
      hasToddler: updatedUser.hasToddler,
      message: 'Profil berhasil diperbarui.',
    };
  }

  // 3. Verifikasi NIK oleh Admin BUMDes
  async verifyNikByAdmin(adminId: string, dto: VerifyNikDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Warga yang akan diverifikasi tidak ditemukan.',
      });
    }

    const inputNikHash = this.cryptoService.hashNik(dto.nikInput);

    if (inputNikHash !== user.nikHash) {
      throw new UnprocessableEntityException({
        errorCode: 'ERR_NIK_VERIFICATION_FAILED',
        message:
          'NIK fisik tidak cocok dengan data pendaftaran warga di sistem.',
      });
    }

    await this.prisma.user.update({
      where: { id: dto.userId },
      data: { isNikVerified: true },
    });

    return {
      success: true,
      userId: user.id,
      isNikVerified: true,
      message: 'Identitas NIK warga berhasil diverifikasi oleh Admin BUMDes.',
    };
  }

  // 4. Update Token FCM
  async updateFcmToken(userId: string, dto: UpdateFcmTokenDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { fcmToken: dto.fcmToken },
    });

    return { success: true, message: 'FCM Token berhasil diperbarui.' };
  }

  // 5. Saldo & Mutasi Dompet Buku Besar
  async getWalletWithLedger(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        ledgerEntries: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Dompet pengguna tidak ditemukan.',
      });
    }

    // Verifikasi tanda tangan integritas pada setiap entri buku besar
    const verifiedEntries = wallet.ledgerEntries.map((entry) => {
      const calculatedSignature = this.cryptoService.generateLedgerSignature({
        walletId: entry.walletId,
        transactionId: entry.transactionId,
        entryType: entry.entryType,
        currency: entry.currency,
        amount: entry.amount.toString(),
        balanceBefore: entry.balanceBefore.toString(),
        balanceAfter: entry.balanceAfter.toString(),
      });

      const isTampered = calculatedSignature !== entry.integritySignature;

      return {
        id: entry.id,
        transactionId: entry.transactionId,
        entryType: entry.entryType,
        currency: entry.currency,
        amount: entry.amount,
        balanceBefore: entry.balanceBefore,
        balanceAfter: entry.balanceAfter,
        createdAt: entry.createdAt,
        isIntegrityValid: !isTampered,
      };
    });

    return {
      walletId: wallet.id,
      pointsBalance: wallet.pointsBalance,
      cashBalance: wallet.cashBalance,
      recentLedgerEntries: verifiedEntries,
    };
  }

  // 6. Mutasi Dompet Atomik (Double-Entry Ledger + OCC)
  async mutateWallet(
    tx: Prisma.TransactionClient,
    walletId: string,
    transactionId: string,
    deltas: {
      pointsDelta?: Prisma.Decimal | number;
      cashDelta?: Prisma.Decimal | number;
    },
  ) {
    const wallet = await tx.wallet.findUniqueOrThrow({
      where: { id: walletId },
    });

    const entries: Prisma.LedgerEntryCreateManyInput[] = [];
    const pointsD = deltas.pointsDelta
      ? new Prisma.Decimal(deltas.pointsDelta)
      : new Prisma.Decimal(0);
    const cashD = deltas.cashDelta
      ? new Prisma.Decimal(deltas.cashDelta)
      : new Prisma.Decimal(0);

    let newPointsBalance = wallet.pointsBalance;
    let newCashBalance = wallet.cashBalance;

    if (!pointsD.isZero()) {
      const balanceBefore = wallet.pointsBalance;
      newPointsBalance = balanceBefore.plus(pointsD);

      if (newPointsBalance.isNegative()) {
        throw new BadRequestException({
          errorCode: 'ERR_INSUFFICIENT_POINTS',
          message: 'Saldo poin reputasi tidak mencukupi untuk transaksi ini.',
        });
      }

      const sig = this.cryptoService.generateLedgerSignature({
        walletId,
        transactionId,
        entryType: pointsD.greaterThan(0) ? 'CREDIT' : 'DEBIT',
        currency: 'POINTS',
        amount: pointsD.abs().toString(),
        balanceBefore: balanceBefore.toString(),
        balanceAfter: newPointsBalance.toString(),
      });

      entries.push({
        walletId,
        transactionId,
        entryType: pointsD.greaterThan(0) ? 'CREDIT' : 'DEBIT',
        currency: 'POINTS',
        amount: pointsD.abs(),
        balanceBefore,
        balanceAfter: newPointsBalance,
        integritySignature: sig,
      });
    }

    if (!cashD.isZero()) {
      const balanceBefore = wallet.cashBalance;
      newCashBalance = balanceBefore.plus(cashD);

      if (newCashBalance.isNegative()) {
        throw new BadRequestException({
          errorCode: 'ERR_INSUFFICIENT_FUNDS',
          message: 'Saldo kas mikro tidak mencukupi untuk penarikan ini.',
        });
      }

      const sig = this.cryptoService.generateLedgerSignature({
        walletId,
        transactionId,
        entryType: cashD.greaterThan(0) ? 'CREDIT' : 'DEBIT',
        currency: 'IDR',
        amount: cashD.abs().toString(),
        balanceBefore: balanceBefore.toString(),
        balanceAfter: newCashBalance.toString(),
      });

      entries.push({
        walletId,
        transactionId,
        entryType: cashD.greaterThan(0) ? 'CREDIT' : 'DEBIT',
        currency: 'IDR',
        amount: cashD.abs(),
        balanceBefore,
        balanceAfter: newCashBalance,
        integritySignature: sig,
      });
    }

    // OCC: Update saldo dengan version check
    await tx.wallet.update({
      where: {
        id: walletId,
        version: wallet.version,
      },
      data: {
        pointsBalance: newPointsBalance,
        cashBalance: newCashBalance,
        version: { increment: 1 },
      },
    });

    if (entries.length > 0) {
      await tx.ledgerEntry.createMany({
        data: entries,
      });
    }

    return {
      pointsBalance: newPointsBalance,
      cashBalance: newCashBalance,
    };
  }
}
