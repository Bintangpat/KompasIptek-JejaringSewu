import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/database/prisma.service';
import { ApproveLoanDto } from './dto/credit-scoring.dto';

@Injectable()
export class CreditScoringService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Skor Kredit Terkini Saya
  async getMyCreditScore(userId: string) {
    const latestSnapshot = await this.prisma.creditScoreSnapshot.findFirst({
      where: { userId },
      orderBy: { calculatedAt: 'desc' },
    });

    const activeRecommendation =
      await this.prisma.loanRecommendation.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

    return {
      currentScore: latestSnapshot ? latestSnapshot.totalSkredit : 50,
      grade: latestSnapshot ? latestSnapshot.grade : 'GRADE_C_AWAL',
      breakdown: latestSnapshot
        ? {
            jastipScore: latestSnapshot.nJastipScore,
            minijobScore: latestSnapshot.nMinijobScore,
            hasilbumiScore: latestSnapshot.nHasilbumiScore,
            selfieScore: latestSnapshot.vSelfieScore,
            inklusiScore: latestSnapshot.iInklusiScore,
            calculatedAt: latestSnapshot.calculatedAt,
          }
        : null,
      loanRecommendation: activeRecommendation
        ? {
            id: activeRecommendation.id,
            recommendedPlafond: activeRecommendation.recommendedPlafond,
            status: activeRecommendation.status,
            createdAt: activeRecommendation.createdAt,
            approvedAt: activeRecommendation.approvedAt,
          }
        : null,
    };
  }

  // 2. Daftar Skor Warga per Pekon (BUMDes / BAPPERIDA)
  async getPekonScores(pekonId: string) {
    return this.prisma.user.findMany({
      where: { pekonId },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        vulnerabilityFlags: true,
        employerInclusionCount: true,
        creditScores: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
        },
        loanRecommendations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  // 3. Daftar Calon Penerima Modal yang Layak (Eligible Loans)
  async getEligibleLoans(pekonId?: string) {
    return this.prisma.loanRecommendation.findMany({
      where: {
        status: 'ELIGIBLE_WAITING_BUMDES',
        user: pekonId ? { pekonId } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            vulnerabilityFlags: true,
            pekon: {
              select: {
                id: true,
                namaPekon: true,
                kecamatan: true,
              },
            },
          },
        },
      },
      orderBy: { scoreAtApproval: 'desc' },
    });
  }

  // 4. Persetujuan Pencairan Modal oleh BUMDes
  async approveLoan(
    adminId: string,
    loanId: string,
    dto: ApproveLoanDto,
  ) {
    const loan = await this.prisma.loanRecommendation.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Rekomendasi pinjaman tidak ditemukan.',
      });
    }

    if (loan.status !== 'ELIGIBLE_WAITING_BUMDES') {
      throw new ConflictException({
        errorCode: 'ERR_CONFLICT_STATE',
        message: 'Pinjaman ini telah diproses atau disetujui sebelumnya.',
      });
    }

    const updatedLoan = await this.prisma.loanRecommendation.update({
      where: { id: loanId },
      data: {
        status: 'APPROVED',
        approvedByBumdesId: adminId,
        approvedAt: new Date(),
        recommendedPlafond: dto.approvedPlafond
          ? new Prisma.Decimal(dto.approvedPlafond)
          : loan.recommendedPlafond,
      },
    });

    // Buat event notifikasi persetujuan di OutboxEvent
    await this.prisma.outboxEvent.create({
      data: {
        eventType: 'FCM_PUSH',
        payload: {
          userId: loan.userId,
          title: 'Pengajuan Modal BUMDes Disetujui!',
          body: `Selamat! BUMDes telah menyetujui modal kerja sebesar Rp ${Number(updatedLoan.recommendedPlafond).toLocaleString('id-ID')}. Silakan datang ke kantor BUMDes untuk pencairan.`,
        },
      },
    });

    return {
      loanId: updatedLoan.id,
      status: updatedLoan.status,
      approvedPlafond: updatedLoan.recommendedPlafond,
      message: 'Pinjaman modal tanpa agunan BUMDes berhasil disetujui.',
    };
  }

  // 5. Daftar Pinjaman Aktif & Pencairan (BUMDes & BAPPERIDA)
  async getActiveLoans(pekonId?: string, status?: string) {
    const where: Prisma.LoanRecommendationWhereInput = {};
    if (status) {
      where.status = status;
    } else {
      where.status = { in: ['APPROVED', 'DISBURSED', 'REPAID'] };
    }
    if (pekonId) {
      where.user = { pekonId };
    }
    return this.prisma.loanRecommendation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            isNikVerified: true,
            vulnerabilityFlags: true,
            pekon: {
              select: {
                id: true,
                namaPekon: true,
                kecamatan: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 6. Pencairan Modal Kerja BUMDes
  async disburseLoan(loanId: string, adminId: string) {
    const loan = await this.prisma.loanRecommendation.findUnique({
      where: { id: loanId },
    });
    if (!loan) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Rekomendasi pinjaman tidak ditemukan.',
      });
    }
    if (loan.status !== 'APPROVED') {
      throw new ConflictException({
        errorCode: 'ERR_CONFLICT_STATE',
        message: 'Hanya pinjaman berstatus APPROVED yang dapat dicairkan.',
      });
    }
    const updatedLoan = await this.prisma.loanRecommendation.update({
      where: { id: loanId },
      data: {
        status: 'DISBURSED',
      },
    });
    return {
      loanId: updatedLoan.id,
      status: updatedLoan.status,
      message: 'Modal kerja BUMDes berhasil dicairkan kepada warga.',
    };
  }

  // 7. Pencatatan Pelunasan Pinjaman BUMDes
  async repayLoan(loanId: string, adminId: string) {
    const loan = await this.prisma.loanRecommendation.findUnique({
      where: { id: loanId },
    });
    if (!loan) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Rekomendasi pinjaman tidak ditemukan.',
      });
    }
    if (loan.status !== 'DISBURSED') {
      throw new ConflictException({
        errorCode: 'ERR_CONFLICT_STATE',
        message:
          'Hanya pinjaman yang telah dicairkan (DISBURSED) yang dapat dicatat pelunasannya.',
      });
    }
    const updatedLoan = await this.prisma.loanRecommendation.update({
      where: { id: loanId },
      data: {
        status: 'REPAID',
      },
    });
    return {
      loanId: updatedLoan.id,
      status: updatedLoan.status,
      message: 'Pelunasan pinjaman modal BUMDes berhasil dicatat.',
    };
  }
}
