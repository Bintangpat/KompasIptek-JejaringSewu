import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, MiniJob } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../core/database/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { CreateMiniJobDto, MiniJobQueryDto } from './dto/mini-job.dto';

@Injectable()
export class MiniJobService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  // 1. Pasang Lowongan Mini-Job
  async createJob(employerId: string, dto: CreateMiniJobDto) {
    return this.prisma.miniJob.create({
      data: {
        employerId,
        title: dto.title.trim(),
        description: dto.description.trim(),
        wageAmount: new Prisma.Decimal(dto.wageAmount),
        isDisabilityFriendly: !!dto.isDisabilityFriendly,
        autoAcceptLock: false,
        status: 'OPEN',
      },
    });
  }

  // 2. Daftar Lowongan Mini-Job Aktif
  async getJobs(query: MiniJobQueryDto) {
    return this.prisma.miniJob.findMany({
      where: {
        status: query.status || 'OPEN',
        isDisabilityFriendly: query.isDisabilityFriendly,
      },
      include: {
        employer: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            employerInclusionCount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Klaim Mini-Job secara Atomik (Zero-Discrimination Auto-Accept Lock)
  async claimDisabilityMiniJob(
    jobId: string,
    workerId: string,
    idempotencyKey?: string,
  ) {
    const safeKey = idempotencyKey || uuidv4();

    return this.prisma.$transaction(
      async (tx) => {
        // 1. Row-Level Pessimistic Locking (FOR UPDATE NOWAIT)
        let jobs: MiniJob[];
        try {
          jobs = await tx.$queryRaw<MiniJob[]>`
            SELECT * FROM "MiniJob" 
            WHERE id = ${jobId}::uuid AND status = 'OPEN' 
            FOR UPDATE NOWAIT
          `;
        } catch (error: any) {
          // Tangkap PostgreSQL Error 55P03 (lock_not_available)
          if (error.code === '55P03' || error.message?.includes('could not obtain lock')) {
            throw new ConflictException({
              errorCode: 'ERR_CONCURRENCY_LOCK',
              message:
                'Tugas ini sedang diklaim secara bersamaan oleh pekerja lain. Silakan coba tugas lain.',
            });
          }
          throw error;
        }

        if (!jobs || jobs.length === 0) {
          throw new ConflictException({
            errorCode: 'ERR_CONCURRENCY_LOCK',
            message:
              'Tugas telah dikunci oleh pekerja lain atau tidak lagi berstatus terbuka.',
          });
        }

        const job = jobs[0];

        // Pencegahan klaim tugas sendiri
        if (job.employerId === workerId) {
          throw new ForbiddenException({
            errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
            message: 'Pemberi kerja tidak dapat mengklaim tugas yang dipasang sendiri.',
          });
        }

        // 2. Validasi Inklusi untuk Tugas Ramah Disabilitas / Rentan
        const worker = await tx.user.findUniqueOrThrow({
          where: { id: workerId },
        });

        if (job.isDisabilityFriendly) {
          const hasVulnerability = worker.vulnerabilityFlags.some(
            (flag) => flag !== 'NONE',
          );

          if (!hasVulnerability) {
            throw new ForbiddenException({
              errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
              message:
                'Tugas ramah disabilitas hanya dapat diklaim oleh pekerja prioritas inklusi (disabilitas/lansia/keluarga pra-sejahtera).',
            });
          }
        }

        // 3. Kunci Status Tugas secara Atomik (OCC + Auto-Accept Lock)
        const updatedJob = await tx.miniJob.update({
          where: {
            id: jobId,
            version: job.version,
          },
          data: {
            workerId: worker.id,
            status: 'LOCKED_BY_PRIORITY',
            autoAcceptLock: true,
            lockedAt: new Date(),
            version: { increment: 1 },
          },
        });

        // 4. Update Akumulasi Serap Tenaga Kerja Disabilitas Pemberi Kerja (FR-3.3)
        if (job.isDisabilityFriendly) {
          await tx.user.update({
            where: { id: job.employerId },
            data: {
              employerInclusionCount: { increment: 1 },
            },
          });
        }

        // 5. Buat Entitas UnifiedTransaction secara Atomik
        const txId = uuidv4();
        const transactionToken = this.cryptoService.generateTxToken(
          txId,
          job.employerId,
          worker.id,
        );

        const unifiedTx = await tx.unifiedTransaction.create({
          data: {
            id: txId,
            idempotencyKey: safeKey,
            transactionToken,
            type: 'MINI_JOB',
            referenceEntityId: job.id,
            initiatorId: job.employerId,
            counterpartyId: worker.id,
            grossAmount: job.wageAmount,
            status: 'LOCKED_ASSIGNED',
          },
        });

        return {
          job: updatedJob,
          transactionId: unifiedTx.id,
          transactionToken: unifiedTx.transactionToken,
          status: unifiedTx.status,
          message:
            'Tugas mini-job berhasil diklaim secara otomatis (Auto-Accept Lock aktif).',
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }
}
