import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, Role, VulnerabilityStatus } from '@prisma/client';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { PrismaService } from '../../core/database/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import {
  UpdateProfileDto,
  VerifyNikDto,
  UpdateFcmTokenDto,
  AdminUpdateUserDto,
  AdminQueryUsersDto,
  ImportUserRowDto,
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

  // 3b. Daftar Warga Pekon (untuk Otoritas BUMDes / BAPPERIDA)
  async getUsersByPekon(pekonId: string, isNikVerified?: boolean) {
    const where: Prisma.UserWhereInput = { pekonId };
    if (typeof isNikVerified === 'boolean') {
      where.isNikVerified = isNikVerified;
    }
    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        role: true,
        isNikVerified: true,
        vulnerabilityFlags: true,
        hasToddler: true,
        referralCode: true,
        isTrustedCollector: true,
        createdAt: true,
        pekonId: true,
        wallet: {
          select: {
            pointsBalance: true,
            cashBalance: true,
          },
        },
        pekon: {
          select: {
            id: true,
            namaPekon: true,
            kecamatan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3c. Daftar Warga Belum Verifikasi NIK
  async getUnverifiedUsers(pekonId?: string) {
    const where: Prisma.UserWhereInput = { isNikVerified: false };
    if (pekonId) {
      where.pekonId = pekonId;
    }
    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        role: true,
        isNikVerified: true,
        vulnerabilityFlags: true,
        hasToddler: true,
        createdAt: true,
        pekonId: true,
        pekon: {
          select: {
            id: true,
            namaPekon: true,
            kecamatan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
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

  // ==========================================
  // 7. SUPER ADMIN: MANAJEMEN PENGGUNA ENTERPRISE
  // ==========================================

  // 7.1 Daftar Seluruh Pengguna (Dengan Pagination, Filter & Pencarian)
  async getAdminUsers(query: AdminQueryUsersDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 15));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (query.isDeleted !== undefined && query.isDeleted !== 'all') {
      where.isDeleted = query.isDeleted === 'true';
    }

    if (query.role) {
      where.role = query.role;
    }

    if (query.pekonId) {
      where.pekonId = query.pekonId;
    }

    if (query.isNikVerified !== undefined) {
      where.isNikVerified = query.isNikVerified === 'true';
    }

    if (query.search && query.search.trim().length > 0) {
      const q = query.search.trim();
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { phoneNumber: { contains: q } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          pekon: {
            select: {
              id: true,
              namaPekon: true,
              kecamatan: true,
            },
          },
          wallet: {
            select: {
              pointsBalance: true,
              cashBalance: true,
            },
          },
        },
      }),
    ]);

    return {
      data: users.map((u) => ({
        id: u.id,
        fullName: u.fullName,
        phoneNumber: u.phoneNumber,
        email: u.email,
        role: u.role,
        isNikVerified: u.isNikVerified,
        vulnerabilityFlags: u.vulnerabilityFlags,
        hasToddler: u.hasToddler,
        referralCode: u.referralCode,
        isTrustedCollector: u.isTrustedCollector,
        isDeleted: u.isDeleted,
        deletedAt: u.deletedAt,
        pekon: u.pekon,
        wallet: {
          pointsBalance: u.wallet?.pointsBalance || 0,
          cashBalance: u.wallet?.cashBalance || 0,
        },
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 7.2 Update Data Pengguna Esensial oleh Super Admin
  async adminUpdateUser(userId: string, dto: AdminUpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Pengguna tidak ditemukan.',
      });
    }

    // Jika pekonId diubah, pastikan pekon baru ada
    if (dto.pekonId && dto.pekonId !== user.pekonId) {
      const pekonExists = await this.prisma.pekon.findUnique({
        where: { id: dto.pekonId },
      });
      if (!pekonExists) {
        throw new BadRequestException({
          errorCode: 'ERR_PEKON_NOT_FOUND',
          message: 'Pekon tujuan tidak terdaftar dalam sistem.',
        });
      }
    }

    // Handle soft delete logic
    const isNowDeleted =
      dto.isDeleted !== undefined ? dto.isDeleted : user.isDeleted;
    const deletedAt =
      dto.isDeleted === true
        ? user.deletedAt || new Date()
        : dto.isDeleted === false
          ? null
          : user.deletedAt;

    // Jika akun dinonaktifkan, cabut semua sesi aktif
    if (dto.isDeleted === true && !user.isDeleted) {
      await this.prisma.userSession.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.email !== undefined && { email: dto.email || null }),
        ...(dto.role !== undefined && { role: dto.role }),
        ...(dto.pekonId !== undefined && { pekonId: dto.pekonId }),
        ...(dto.isNikVerified !== undefined && {
          isNikVerified: dto.isNikVerified,
        }),
        ...(dto.vulnerabilityFlags !== undefined && {
          vulnerabilityFlags: dto.vulnerabilityFlags,
        }),
        ...(dto.hasToddler !== undefined && { hasToddler: dto.hasToddler }),
        ...(dto.isTrustedCollector !== undefined && {
          isTrustedCollector: dto.isTrustedCollector,
        }),
        isDeleted: isNowDeleted,
        deletedAt,
      },
      include: {
        pekon: true,
        wallet: true,
      },
    });

    return {
      success: true,
      data: updated,
      message: 'Data pengguna berhasil diperbarui oleh Super Admin.',
    };
  }

  // 7.3 Soft Delete Pengguna oleh Super Admin
  async adminDeleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException({
        errorCode: 'ERR_RESOURCE_NOT_FOUND',
        message: 'Pengguna tidak ditemukan.',
      });
    }

    // Cabut seluruh sesi aktif dan tandai terhapus (Soft Delete)
    await this.prisma.$transaction(async (tx) => {
      await tx.userSession.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    });

    return {
      success: true,
      message: `Pengguna ${user.fullName} berhasil dinonaktifkan (Soft Delete). Seluruh sesi telah dicabut.`,
    };
  }

  // 7.4 Import Pengguna Baru dengan Try-Catch Skip Duplikasi & Pop-up Summary
  async adminImportUsers(rows: ImportUserRowDto[]) {
    if (!rows || rows.length === 0) {
      throw new BadRequestException({
        errorCode: 'ERR_EMPTY_IMPORT_DATA',
        message: 'Data impor pengguna tidak boleh kosong.',
      });
    }

    // Dapatkan pekon default jika ada row tanpa pekonId
    const defaultPekon = await this.prisma.pekon.findFirst();
    if (!defaultPekon) {
      throw new BadRequestException({
        errorCode: 'ERR_PEKON_NOT_FOUND',
        message: 'Master pekon belum tersedia dalam basis data.',
      });
    }

    const defaultPasswordHash = await argon2.hash('SinergiPekon123!');
    let successCount = 0;
    const skippedDetails: Array<{
      row: number;
      name: string;
      identifier: string;
      reason: string;
    }> = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 1;

      try {
        // Validasi NIK 16 digit
        if (!row.nik || !/^[0-9]{16}$/.test(row.nik.trim())) {
          skippedDetails.push({
            row: rowNumber,
            name: row.fullName || 'Tanpa Nama',
            identifier: row.nik || 'NIK Kosong',
            reason: 'Format NIK tidak valid (harus 16 digit angka)',
          });
          continue;
        }

        // Validasi format nomor WhatsApp
        const phone = row.phoneNumber ? row.phoneNumber.trim() : '';
        if (!phone || !/^08[0-9]{8,12}$/.test(phone)) {
          skippedDetails.push({
            row: rowNumber,
            name: row.fullName || 'Tanpa Nama',
            identifier: phone || 'HP Kosong',
            reason: 'Format nomor WhatsApp tidak valid (contoh: 081234567890)',
          });
          continue;
        }

        const nikHash = this.cryptoService.hashNik(row.nik.trim());
        const email = row.email && row.email.trim() ? row.email.trim() : null;

        // Cek duplikasi di basis data
        const duplicate = await this.prisma.user.findFirst({
          where: {
            OR: [
              { nikHash },
              { phoneNumber: phone },
              ...(email ? [{ email }] : []),
            ],
          },
        });

        if (duplicate) {
          let conflictField = 'Data pengguna';
          if (duplicate.nikHash === nikHash) conflictField = `NIK (${row.nik})`;
          else if (duplicate.phoneNumber === phone) conflictField = `Nomor HP (${phone})`;
          else if (duplicate.email === email) conflictField = `Email (${email})`;

          skippedDetails.push({
            row: rowNumber,
            name: row.fullName,
            identifier: phone,
            reason: `Duplikat terdeteksi di database: ${conflictField} sudah terdaftar.`,
          });
          continue;
        }

        const nikEncrypted = this.cryptoService.encryptNik(row.nik.trim());
        const referralCode = `JS-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
        const targetPekonId = row.pekonId || defaultPekon.id;

        // Buat user dan wallet di dalam transaksi atomik
        await this.prisma.$transaction(async (tx) => {
          const newUser = await tx.user.create({
            data: {
              nikHash,
              nikEncrypted,
              fullName: row.fullName.trim(),
              phoneNumber: phone,
              email,
              passwordHash: defaultPasswordHash,
              role: row.role || Role.WARGA,
              pekonId: targetPekonId,
              isNikVerified: row.isNikVerified || false,
              vulnerabilityFlags: row.vulnerabilityFlags || [VulnerabilityStatus.NONE],
              hasToddler: row.hasToddler || false,
              referralCode,
            },
          });

          await tx.wallet.create({
            data: {
              userId: newUser.id,
              pointsBalance: new Prisma.Decimal(0),
              cashBalance: new Prisma.Decimal(0),
            },
          });
        });

        successCount++;
      } catch (err: any) {
        skippedDetails.push({
          row: rowNumber,
          name: row.fullName || 'Tanpa Nama',
          identifier: row.phoneNumber || 'N/A',
          reason: `Kesalahan transaksi: ${err.message || 'Gagal memproses baris'}`,
        });
      }
    }

    return {
      totalProcessed: rows.length,
      successCount,
      skippedCount: skippedDetails.length,
      skippedDetails,
      message: `Proses impor selesai: ${successCount} pengguna berhasil dibuat, ${skippedDetails.length} baris dilewati.`,
    };
  }

  // 7.5 Ekspor Data Pengguna
  async adminExportUsers(query?: AdminQueryUsersDto) {
    const where: Prisma.UserWhereInput = {};

    if (query?.isDeleted !== undefined && query.isDeleted !== 'all') {
      where.isDeleted = query.isDeleted === 'true';
    }
    if (query?.role) {
      where.role = query.role;
    }
    if (query?.pekonId) {
      where.pekonId = query.pekonId;
    }

    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        pekon: {
          select: {
            namaPekon: true,
            kecamatan: true,
          },
        },
        wallet: {
          select: {
            pointsBalance: true,
            cashBalance: true,
          },
        },
      },
    });

    return users.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      phoneNumber: u.phoneNumber,
      email: u.email || '-',
      role: u.role,
      isNikVerified: u.isNikVerified ? 'YA' : 'TIDAK',
      vulnerabilityFlags: u.vulnerabilityFlags.join(', '),
      hasToddler: u.hasToddler ? 'YA' : 'TIDAK',
      pekon: u.pekon?.namaPekon || '-',
      kecamatan: u.pekon?.kecamatan || '-',
      saldoPoin: u.wallet?.pointsBalance ? u.wallet.pointsBalance.toString() : '0',
      saldoKas: u.wallet?.cashBalance ? u.wallet.cashBalance.toString() : '0',
      status: u.isDeleted ? 'NONAKTIF' : 'AKTIF',
      createdAt: u.createdAt.toISOString(),
    }));
  }

  // 7.6 Backup Snapshot Data Pengguna (Disaster Recovery)
  async adminBackupData() {
    const [users, pekons, totalWallets] = await Promise.all([
      this.prisma.user.findMany({
        include: {
          pekon: true,
          wallet: true,
        },
      }),
      this.prisma.pekon.findMany(),
      this.prisma.wallet.count(),
    ]);

    const backupPayload = {
      system: 'JEJARING-SEWU (SINERGI-PEKON)',
      version: '1.0.0-enterprise',
      snapshotAt: new Date().toISOString(),
      metadata: {
        totalUsers: users.length,
        totalPekons: pekons.length,
        totalWallets,
      },
      pekons,
      users: users.map((u) => ({
        id: u.id,
        nikHash: u.nikHash,
        nikEncrypted: u.nikEncrypted,
        fullName: u.fullName,
        phoneNumber: u.phoneNumber,
        email: u.email,
        role: u.role,
        isNikVerified: u.isNikVerified,
        vulnerabilityFlags: u.vulnerabilityFlags,
        hasToddler: u.hasToddler,
        referralCode: u.referralCode,
        isTrustedCollector: u.isTrustedCollector,
        pekonId: u.pekonId,
        isDeleted: u.isDeleted,
        deletedAt: u.deletedAt,
        wallet: u.wallet
          ? {
              pointsBalance: u.wallet.pointsBalance.toString(),
              cashBalance: u.wallet.cashBalance.toString(),
            }
          : null,
        createdAt: u.createdAt,
      })),
    };

    // Buat SHA-256 Checksum dari payload
    const checksum = crypto
      .createHash('sha256')
      .update(JSON.stringify(backupPayload))
      .digest('hex');

    return {
      checksum,
      backupPayload,
    };
  }
}
