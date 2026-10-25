import { PrismaClient, Role, VulnerabilityStatus, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

const NIK_KEY = Buffer.from(
  process.env.NIK_ENCRYPTION_KEY ||
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  'hex',
);
const NIK_SECRET = process.env.NIK_HMAC_SECRET || 'nik-hmac-default-secret';

function hashNik(nik: string): string {
  return crypto.createHmac('sha256', NIK_SECRET).update(nik.trim()).digest('hex');
}

function encryptNik(nik: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', NIK_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(nik.trim(), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

async function main() {
  console.log('Seeding data awal JEJARING-SEWU (Kabupaten Pringsewu)...');

  // 1. Seed Pekon (Sample Wilayah Kabupaten Pringsewu)
  const pekonList = [
    {
      kodeKemendagri: '18.10.02.2001',
      namaPekon: 'Pekon Pagelaran',
      kecamatan: 'Pagelaran',
      namaBumdes: 'BUMDes Mandiri Sejahtera Pagelaran',
      latitude: new Prisma.Decimal(-5.3421),
      longitude: new Prisma.Decimal(104.9452),
    },
    {
      kodeKemendagri: '18.10.01.1001',
      namaPekon: 'Pringsewu Barat',
      kecamatan: 'Pringsewu',
      namaBumdes: 'BUMDes Karya Bersama Barat',
      latitude: new Prisma.Decimal(-5.3587),
      longitude: new Prisma.Decimal(104.9741),
    },
    {
      kodeKemendagri: '18.10.03.2001',
      namaPekon: 'Pekon Gading Rejo',
      kecamatan: 'Gading Rejo',
      namaBumdes: 'BUMDes Berkah Gading Rejo',
      latitude: new Prisma.Decimal(-5.3612),
      longitude: new Prisma.Decimal(105.0234),
    },
    {
      kodeKemendagri: '18.10.04.2001',
      namaPekon: 'Pekon Sukoharjo',
      kecamatan: 'Sukoharjo',
      namaBumdes: 'BUMDes Sukoharjo Maju',
      latitude: new Prisma.Decimal(-5.2981),
      longitude: new Prisma.Decimal(104.9912),
    },
    {
      kodeKemendagri: '18.10.05.2001',
      namaPekon: 'Pekon Ambarawa',
      kecamatan: 'Ambarawa',
      namaBumdes: 'BUMDes Makmur Ambarawa',
      latitude: new Prisma.Decimal(-5.4123),
      longitude: new Prisma.Decimal(104.9621),
    },
  ];

  const createdPekons = [];
  for (const pekon of pekonList) {
    const p = await prisma.pekon.upsert({
      where: { kodeKemendagri: pekon.kodeKemendagri },
      update: {},
      create: pekon,
    });
    createdPekons.push(p);
  }
  console.log(`Berhasil membuat ${createdPekons.length} master Pekon Pringsewu.`);

  const mainPekon = createdPekons[0];

  // 2. Seed Users & Wallets
  const passwordAdminBumdes = await argon2.hash('AdminBumdes123!');
  const passwordBapperida = await argon2.hash('AdminBapperida123!');
  const passwordWarga = await argon2.hash('WargaSlamet123!');

  const usersData = [
    {
      nik: '1801050101900001',
      fullName: 'Ahmad Fauzi (Admin BUMDes Pagelaran)',
      phoneNumber: '081234567891',
      email: 'bumdes.pagelaran@pringsewu.go.id',
      role: Role.ADMIN_BUMDES,
      passwordHash: passwordAdminBumdes,
      isNikVerified: true,
      referralCode: 'BUMDES-01',
      pekonId: mainPekon.id,
      vulnerabilityFlags: [VulnerabilityStatus.NONE],
    },
    {
      nik: '1801050101900002',
      fullName: 'BAPPERIDA Kabupaten Pringsewu',
      phoneNumber: '081234567892',
      email: 'bapperida@pringsewukab.go.id',
      role: Role.ADMIN_BAPPERIDA,
      passwordHash: passwordBapperida,
      isNikVerified: true,
      referralCode: 'BAPPERIDA-01',
      pekonId: mainPekon.id,
      vulnerabilityFlags: [VulnerabilityStatus.NONE],
    },
    {
      nik: '1801050101900003',
      fullName: 'H. Suratno (Pengepul Hasil Bumi Terpercaya)',
      phoneNumber: '081234567893',
      role: Role.PENGEPUL,
      passwordHash: passwordWarga,
      isNikVerified: true,
      isTrustedCollector: true,
      referralCode: 'JUJUR-SURATNO',
      pekonId: mainPekon.id,
      vulnerabilityFlags: [VulnerabilityStatus.NONE],
    },
    {
      nik: '1801050101900004',
      fullName: 'Pak Slamet (Petani Singkong)',
      phoneNumber: '081234567894',
      role: Role.WARGA,
      passwordHash: passwordWarga,
      isNikVerified: true,
      referralCode: 'SLAMET-001',
      pekonId: mainPekon.id,
      vulnerabilityFlags: [VulnerabilityStatus.NONE],
    },
    {
      nik: '1801050101900005',
      fullName: 'Mbak Yanti (Pekerja Mini-Job Prioritas)',
      phoneNumber: '081234567895',
      role: Role.WARGA,
      passwordHash: passwordWarga,
      isNikVerified: true,
      referralCode: 'YANTI-001',
      pekonId: mainPekon.id,
      vulnerabilityFlags: [VulnerabilityStatus.DISABILITAS_FISIK],
    },
  ];

  for (const u of usersData) {
    const nikH = hashNik(u.nik);
    const nikE = encryptNik(u.nik);

    const user = await prisma.user.upsert({
      where: { phoneNumber: u.phoneNumber },
      update: {},
      create: {
        nikHash: nikH,
        nikEncrypted: nikE,
        fullName: u.fullName,
        phoneNumber: u.phoneNumber,
        email: u.email || null,
        role: u.role,
        passwordHash: u.passwordHash,
        isNikVerified: u.isNikVerified,
        isTrustedCollector: u.isTrustedCollector || false,
        referralCode: u.referralCode,
        pekonId: u.pekonId,
        vulnerabilityFlags: u.vulnerabilityFlags,
      },
    });

    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        pointsBalance: new Prisma.Decimal(50),
        cashBalance: new Prisma.Decimal(25000),
      },
    });
  }
  console.log(`Berhasil membuat ${usersData.length} pengguna sample dengan dompet aktif.`);

  // 3. Seed Paket Gizi Intervensi Stunting
  const nutritionPackages = [
    {
      pekonId: mainPekon.id,
      packageName: 'Paket Gizi Stunting A: Telur Bebek Lokal (10 Butir) + Lele Segar (1 Kg)',
      pointsCost: new Prisma.Decimal(25),
      stockCount: 50,
    },
    {
      pekonId: mainPekon.id,
      packageName: 'Paket Gizi Stunting B: Ikan Nila Segar (1 Kg) + Sayuran Organik Pekon',
      pointsCost: new Prisma.Decimal(30),
      stockCount: 40,
    },
    {
      pekonId: mainPekon.id,
      packageName: 'Paket Gizi Stunting C: Kacang Hijau + Gula Aren Murni Pringsewu',
      pointsCost: new Prisma.Decimal(20),
      stockCount: 35,
    },
  ];

  for (const pack of nutritionPackages) {
    await prisma.nutritionPackage.create({
      data: pack,
    });
  }
  console.log(`Berhasil membuat ${nutritionPackages.length} paket gizi lokal.`);

  console.log('Seeding selesai 100%!');
}

main()
  .catch((e) => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
