import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, CreditGrade } from '@prisma/client';
import { PrismaService } from '../../core/database/prisma.service';
import { UsersWalletService } from '../users-wallet/users-wallet.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { SelfiePoWDto } from './dto/transaction.dto';

@Injectable()
export class TransactionPowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersWalletService: UsersWalletService,
    private readonly cryptoService: CryptoService,
  ) {}

  // 1. Riwayat Transaksi Saya
  async getMyTransactions(userId: string, type?: string, status?: string) {
    return this.prisma.unifiedTransaction.findMany({
      where: {
        OR: [{ initiatorId: userId }, { counterpartyId: userId }],
        type: type ? (type as any) : undefined,
        status: status ? (status as any) : undefined,
      },
      include: {
        initiator: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            role: true,
          },
        },
        counterparty: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            role: true,
          },
        },
        selfieProof: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 2. Token Transaksi 1x Pakai
  async getTransactionToken(txId: string, userId: string) {
    const tx = await this.prisma.unifiedTransaction.findUnique({
      where: { id: txId },
    });

    if (!tx) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Transaksi tidak ditemukan.',
      });
    }

    if (tx.initiatorId !== userId && tx.counterpartyId !== userId) {
      throw new ForbiddenException({
        errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
        message: 'Anda tidak memiliki hak akses terhadap transaksi ini.',
      });
    }

    return {
      transactionId: tx.id,
      transactionToken: tx.transactionToken,
      status: tx.status,
      type: tx.type,
      grossAmount: tx.grossAmount,
    };
  }

  // 3. Verifikasi Selfie Proof-of-Work (5 Proses Atomik dalam 1 Transaksi)
  async verifySelfiePoW(
    txId: string,
    uploaderUserId: string,
    dto: SelfiePoWDto,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const unifiedTx = await tx.unifiedTransaction.findUnique({
          where: { id: txId },
          include: {
            initiator: { include: { wallet: true } },
            counterparty: { include: { wallet: true } },
            collectorReferral: { include: { referrer: { include: { wallet: true } } } },
          },
        });

        if (!unifiedTx) {
          throw new NotFoundException({
            errorCode: 'ERR_RESOURCE_NOT_FOUND',
            message: 'Transaksi tidak ditemukan.',
          });
        }

        if (
          unifiedTx.initiatorId !== uploaderUserId &&
          unifiedTx.counterpartyId !== uploaderUserId
        ) {
          throw new ForbiddenException({
            errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
            message: 'Hanya pihak terkait transaksi yang berhak mengunggah bukti kerja.',
          });
        }

        if (unifiedTx.status === 'VERIFIED_COMPLETED') {
          throw new ConflictException({
            errorCode: 'ERR_CONFLICT_STATE',
            message: 'Transaksi ini telah diverifikasi dan selesai.',
          });
        }

        // Validasi Selfie Direct Camera
        if (!dto.isCameraDirect) {
          throw new UnprocessableEntityException({
            errorCode: 'ERR_SELFIE_INTEGRITY_MISMATCH',
            message:
              'Foto bukti kerja harus diambil langsung melalui kamera aplikasi (bukan unggahan galeri).',
          });
        }

        // 1️⃣ Simpan Rekam Bukti SelfieProofOfWork
        const validityScore = dto.gpsAccuracyMeters <= 50 ? 100 : 85;

        await tx.selfieProofOfWork.create({
          data: {
            transactionId: unifiedTx.id,
            imageStorageUrl: dto.imageStorageUrl,
            imageSha256Hash: dto.imageSha256Hash,
            gpsLatitude: new Prisma.Decimal(dto.gpsLatitude),
            gpsLongitude: new Prisma.Decimal(dto.gpsLongitude),
            gpsAccuracyMeters: new Prisma.Decimal(dto.gpsAccuracyMeters),
            pekonNameOverlay: dto.pekonNameOverlay,
            isCameraDirect: true,
            validityScore: new Prisma.Decimal(validityScore),
          },
        });

        // 2️⃣ Perbarui Status Transaksi menjadi VERIFIED_COMPLETED (OCC increment)
        await tx.unifiedTransaction.update({
          where: {
            id: unifiedTx.id,
            version: unifiedTx.version,
          },
          data: {
            status: 'VERIFIED_COMPLETED',
            completedAt: new Date(),
            version: { increment: 1 },
          },
        });

        // 3️⃣ Mutasi Dompet Buku Besar (Double-Entry Bookkeeping)
        await this.distributeRewards(tx, unifiedTx);

        // 4️⃣ Hitung Skor Kredit Alternatif SPK AHP-TOPSIS untuk Counterparty
        const targetUserId =
          unifiedTx.type === 'MINI_JOB'
            ? unifiedTx.counterpartyId // Pekerja mini-job
            : unifiedTx.initiatorId; // Petani / pemesan

        const creditScore = await this.calculateCreditScore(
          tx,
          targetUserId,
          unifiedTx.id,
          validityScore,
        );

        // 5️⃣ Jika Skredit >= 85 -> Terbitkan Rekomendasi Modal BUMDes Tanpa Agunan
        let loanRecommendation: any = null;
        if (creditScore.totalSkredit.greaterThanOrEqualTo(85)) {
          loanRecommendation = await tx.loanRecommendation.create({
            data: {
              userId: targetUserId,
              scoreAtApproval: creditScore.totalSkredit,
              recommendedPlafond: new Prisma.Decimal(1500000), // Rp 1.500.000
              status: 'ELIGIBLE_WAITING_BUMDES',
            },
          });

          // Antrekan notifikasi ucapan selamat via FCM di OutboxEvent
          await tx.outboxEvent.create({
            data: {
              eventType: 'LOAN_ELIGIBLE',
              payload: {
                userId: targetUserId,
                creditScore: creditScore.totalSkredit.toNumber(),
                plafond: 1500000,
                message:
                  'Selamat! Skor kredit Anda mencapai Grade A. Anda memenuhi syarat modal kerja Rp 1.500.000 dari BUMDes.',
              },
            },
          });
        }

        return {
          transactionId: unifiedTx.id,
          status: 'VERIFIED_COMPLETED',
          creditScore: {
            totalSkredit: creditScore.totalSkredit,
            grade: creditScore.grade,
          },
          loanRecommendation: loanRecommendation
            ? {
                id: loanRecommendation.id,
                plafond: loanRecommendation.recommendedPlafond,
                status: loanRecommendation.status,
              }
            : null,
          message:
            'Verifikasi Selfie PoW berhasil. Saldo dompet dan skor kredit telah diperbarui.',
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  // --- Helper: Distribusi Upah & Poin ---
  private async distributeRewards(
    tx: Prisma.TransactionClient,
    unifiedTx: any,
  ) {
    if (unifiedTx.type === 'MINI_JOB') {
      const workerWallet = unifiedTx.counterparty.wallet;
      if (workerWallet) {
        await this.usersWalletService.mutateWallet(
          tx,
          workerWallet.id,
          unifiedTx.id,
          {
            cashDelta: unifiedTx.grossAmount,
            pointsDelta: 10, // 10 reputasi poin
          },
        );
      }
    } else if (unifiedTx.type === 'NEBENG_JASTIP') {
      const commuterWallet = unifiedTx.counterparty.wallet;
      if (commuterWallet) {
        await this.usersWalletService.mutateWallet(
          tx,
          commuterWallet.id,
          unifiedTx.id,
          {
            cashDelta: unifiedTx.grossAmount,
            pointsDelta: 5,
          },
        );
      }
    } else if (unifiedTx.type === 'HARVEST_DEAL') {
      const farmerWallet = unifiedTx.initiator.wallet;
      if (farmerWallet) {
        await this.usersWalletService.mutateWallet(
          tx,
          farmerWallet.id,
          unifiedTx.id,
          {
            pointsDelta: 15,
          },
        );
      }

      // Referral Pengepul Jujur jika ada
      if (unifiedTx.collectorReferral && unifiedTx.collectorReferral.referrer?.wallet) {
        await this.usersWalletService.mutateWallet(
          tx,
          unifiedTx.collectorReferral.referrer.wallet.id,
          unifiedTx.id,
          {
            cashDelta: unifiedTx.collectorReferral.microCommission,
            pointsDelta: unifiedTx.collectorReferral.reputationPoints,
          },
        );
      }
    }
  }

  // --- Helper: Mesin SPK AHP-TOPSIS Credit Scoring ---
  private async calculateCreditScore(
    tx: Prisma.TransactionClient,
    userId: string,
    triggerTxId: string,
    currentValidityScore: number,
  ) {
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });

    // Ambil semua transaksi sukses pengguna
    const completedTx = await tx.unifiedTransaction.findMany({
      where: {
        OR: [{ initiatorId: userId }, { counterpartyId: userId }],
        status: 'VERIFIED_COMPLETED',
      },
    });

    const jastipCount = completedTx.filter((t) => t.type === 'NEBENG_JASTIP').length;
    const miniJobCount = completedTx.filter((t) => t.type === 'MINI_JOB').length;
    const harvestCount = completedTx.filter((t) => t.type === 'HARVEST_DEAL').length;

    // Normalisasi (0 - 100)
    const nJastip = Math.min(100, jastipCount * 10);
    const nMinijob = Math.min(100, miniJobCount * 10);
    const nHasilbumi = Math.min(100, harvestCount * 10);
    const vSelfie = currentValidityScore;

    // Indeks Inklusi (I_inklusi)
    let iInklusi = 50;
    const hasVulnerability = user.vulnerabilityFlags.some((f) => f !== 'NONE');
    if (hasVulnerability) {
      iInklusi = 100;
    } else if (user.employerInclusionCount > 0) {
      iInklusi = Math.min(100, 50 + user.employerInclusionCount * 10);
    }

    // Rumus SPK AHP-TOPSIS
    const rawSkredit =
      0.2 * nJastip +
      0.25 * nMinijob +
      0.2 * nHasilbumi +
      0.2 * vSelfie +
      0.15 * iInklusi;

    const totalSkredit = Math.round(rawSkredit * 100) / 100;

    let grade: CreditGrade = CreditGrade.GRADE_C_AWAL;
    if (totalSkredit >= 85) {
      grade = CreditGrade.GRADE_A_LAYAK_MODAL;
    } else if (totalSkredit >= 70) {
      grade = CreditGrade.GRADE_B_PEMBINAAN;
    }

    return tx.creditScoreSnapshot.create({
      data: {
        userId,
        triggerTxId,
        nJastipScore: new Prisma.Decimal(nJastip),
        nMinijobScore: new Prisma.Decimal(nMinijob),
        nHasilbumiScore: new Prisma.Decimal(nHasilbumi),
        vSelfieScore: new Prisma.Decimal(vSelfie),
        iInklusiScore: new Prisma.Decimal(iInklusi),
        totalSkredit: new Prisma.Decimal(totalSkredit),
        grade,
      },
    });
  }
}
