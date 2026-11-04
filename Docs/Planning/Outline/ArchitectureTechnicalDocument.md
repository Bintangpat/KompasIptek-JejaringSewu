# Technical Architecture Document (TAD)

> **Proyek:** JEJARING-SEWU (SINERGI-PEKON) — Enterprise Circular Economy Engine 
> **Database & ORM:** PostgreSQL 16 (PostGIS) + Prisma ORM 
> **Backend:** Node.js (NestJS) + Redis + BullMQ 
> **Standar:** Modular Monolith, Zero-Trust Security, Double-Entry Ledger

Dokumen ini merupakan Technical Architecture Document (TAD) berstandar Enterprise untuk aplikasi JEJARING-SEWU (SINERGI-PEKON). Dokumen ini dirancang menggunakan PostgreSQL dan Prisma ORM, dilengkapi dengan arsitektur keamanan berlapis (Tokenized Auth & Transaction), jaminan mutlak integritas data (ACID & Database Atomic), serta strategi High Availability & Disaster Recovery (Backup).

## 1. Arsitektur Tingkat Tinggi (High-Level Enterprise Architecture)

Meskipun dirancang hemat biaya operasional (Cost-Benefit C3, dengan budget Rp50.000-300.000/bulan pada fase awal), arsitektur menggunakan pola Modular Monolith siap scale, deployed di VPS self-hosted yang memisahkan beban kerja transaksional, komputasi SPK, dan penyimpanan bukti fisik:

1. **Client Layer:**
   - **Mobile App:** React Native (Expo SDK) dengan accessible UI (TalkBack), Offline-First SQLite queue, kompresi gambar klien (`expo-image-manipulator`), dan pelacakan rute latar belakang (`expo-task-manager`).
   - **Web Dashboard & Hybrid PWA:** Next.js + Tailwind CSS + shadcn/ui (untuk Otoritas BUMDes/BAPPERIDA dan warga pengguna HP spesifikasi rendah) + WhatsApp Webhook Gateway.
2. **API Gateway & Security Layer:**
   - **Reverse Proxy / WAF:** Cloudflare + Nginx (Rate Limiting, DDoS Protection, TLS 1.3 Termination).
   - **Auth & Tokenization Middleware:** Validasi JWT Simetris (HS256), Device Fingerprint Binding, dan Idempotency-Key Interceptor.
3. **Core Application Layer (Node.js Backend):**
   - **Transactional Services:** Mengelola Bursa Panen, Nebeng-Jastip, dan Mini-Job dengan penguncian baris database (*Row-Level Locking*).
   - **SPK AHP-TOPSIS Engine:** Mesin kalkulasi Alternative Credit Scoring (Skredit) secara *event-driven*.
   - **Notification Engine:** `firebase-admin` SDK untuk Push Notification (FCM) ke perangkat Android dan antrean pesan WhatsApp.
4. **Data & Persistence Layer:**
   - **Primary Database:** PostgreSQL 16 dengan ekstensi `postgis` (kueri radius geospasial) dan `pgcrypto` (enkripsi kolom sensitif).
   - **In-Memory Cache & Distributed Lock:** Redis (menyimpan *geo-fencing* rute kurir aktif, *blacklist* token, dan *distributed lock* untuk Auto-Accept Mini-Job).
   - **Immutable Object Storage:** S3-Compatible Storage (Cloudflare R2) dengan fitur Object Lock (WORM - *Write Once Read Many*) khusus untuk menyimpan foto Selfie Proof-of-Work ber-*watermark*.

## 2. Desain Skema Database & Keterhubungan Tabel (schema.prisma)

Keterhubungan antar tabel dirancang dengan prinsip 3NF (Third Normal Form) untuk data master dan Immutable Audit Ledger untuk seluruh mutasi poin/komisi dan riwayat skor kredit.

### A. Diagram Relasi Entitas Konseptual (ERD Summary)

- **Pekon (Desa) 1 ─── N User:** Setiap warga terikat pada satu pekon untuk agregasi data BUMDes/BAPPERIDA.
- **User 1 ─── N UserSession:** Manajemen sesi multi-perangkat dan Refresh Token Rotation.
- **User 1 ─── 1 Wallet 1 ─── N LedgerEntry:** Sistem buku besar berpasangan (*Double-Entry Bookkeeping*) untuk poin gizi dan saldo komisi mikro.
- **User 1 ─── N HarvestListing / CommuterRoute / MiniJob:** Tiga pilar aktivitas ekonomi utama.
- **UnifiedTransaction (Tabel Polimorfik/Jembatan Inti):** Menyatukan penyelesaian transaksi dari modul Hasil Bumi, Nebeng-Jastip, maupun Mini-Job.
- **UnifiedTransaction 1 ─── 1 SelfieProofOfWork:** Setiap transaksi wajib memiliki tepat satu bukti foto selfie ber-*geotag* yang terverifikasi sebelum memicu kalkulasi skor kredit.
- **User 1 ─── N CreditScoreHistory & LoanRecommendation:** Jejak historis perhitungan SPK (Skredit) dan status pencairan modal tanpa agunan di BUMDes.

### B. Implementasi Lengkap schema.prisma

```prisma
// datasource & generator
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions", "views"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgcrypto, postgis]
}

// ==========================================
// ENUMS
// ==========================================
enum Role {
  WARGA
  PENGEPUL
  UMKM
  ADMIN_BUMDES
  ADMIN_BAPPERIDA
  SUPER_ADMIN
}

enum VulnerabilityStatus {
  NONE
  DISABILITAS_FISIK
  DISABILITAS_SENSORIK_NETRA
  DISABILITAS_RUNGU_WICARA
  LANSIA
  PEKKA_IBU_RUMAH_TANGGA
  KELUARGA_RISIKO_STUNTING
}

enum TransactionType {
  HARVEST_DEAL
  NEBENG_JASTIP
  MINI_JOB
  NUTRITION_REDEEM
}

enum TransactionStatus {
  INITIATED
  LOCKED_ASSIGNED
  IN_PROGRESS
  AWAITING_SELFIE_POW
  VERIFIED_COMPLETED
  DISPUTED
  CANCELLED
}

enum CreditGrade {
  GRADE_A_LAYAK_MODAL // >= 85
  GRADE_B_PEMBINAAN   // 70 - 84.99
  GRADE_C_AWAL        // < 70
}

// ==========================================
// 1. MASTER WILAYAH & PENGGUNA (IDENTITY)
// ==========================================
model Pekon {
  id              String             @id @default(uuid()) @db.Uuid
  kodeKemendagri  String             @unique
  namaPekon       String
  kecamatan       String
  namaBumdes      String?
  latitude        Decimal            @db.Decimal(10, 8)
  longitude       Decimal            @db.Decimal(11, 8)
  users           User[]
  harvestListings HarvestListing[]
  nutritionPacks  NutritionPackage[]
  createdAt       DateTime           @default(now())
}

model User {
  id                     String                @id @default(uuid()) @db.Uuid
  nikHash                String                @unique // SHA-256 Hash untuk pencarian cepat tanpa ekspos NIK
  nikEncrypted           String                // Dienkripsi AES-256-GCM (pgcrypto)
  isNikVerified          Boolean               @default(false) // Tervalidasi via Admin BUMDes (Dukcapil/NIA planned)
  fullName               String
  phoneNumber            String                @unique // Nomor telepon / WhatsApp warga (disimpan untuk kontak antarpengguna/darurat). Login identifier.
  email                  String?               @unique
  isEmailVerified        Boolean               @default(false)
  googleId               String?               @unique
  passwordHash           String?               // Argon2id (nullable untuk pengguna Google OAuth)
  role                   Role                  @default(WARGA)
  vulnerabilityFlags     VulnerabilityStatus[] // Mendukung multi-status untuk bobot I_inklusi (15%)
  hasToddler             Boolean               @default(false) // Filter penukaran Paket Gizi Stunting
  fcmToken               String?               // Token Firebase Cloud Messaging
  referralCode           String                @unique // Kode unik untuk bagi referral pengepul
  isTrustedCollector     Boolean               @default(false) // Lencana "Mitra Terpercaya Pekon"
  employerInclusionCount Int                   @default(0)     // Frekuensi serap naker disabilitas (FR-3.3)
  
  pekonId                String                @db.Uuid
  pekon                  Pekon                 @relation(fields: [pekonId], references: [id])

  // Relasi Auth & Keamanan
  sessions               UserSession[]
  wallet                 Wallet?

  // Relasi Modul 1: Hasil Bumi
  harvestsPosted         HarvestListing[]      @relation("FarmerHarvests")
  bidsPlaced             HarvestBid[]          @relation("CollectorBids")
  referralsGiven         CollectorReferral[]   @relation("ReferrerUser")
  referralsReceived      CollectorReferral[]   @relation("ReferredCollector")

  // Relasi Modul 2: Nebeng-Jastip
  commuterRoutes         CommuterRoute[]
  jastipOrders           JastipOrder[]         @relation("JastipRequester")

  // Relasi Modul 3: Mini-Job
  jobsPosted             MiniJob[]             @relation("JobEmployer")
  jobsTaken              MiniJob[]             @relation("JobWorker")

  // Relasi Modul 4, 5, 6: Transaksi, SPK, Gizi
  initiatedTx            UnifiedTransaction[]  @relation("TxInitiator")
  counterpartyTx         UnifiedTransaction[]  @relation("TxCounterparty")
  creditScores           CreditScoreSnapshot[]
  loanRecommendations    LoanRecommendation[]
  nutritionRedeems       NutritionRedemption[]

  version                Int                   @default(1) // Optimistic Concurrency Control (OCC)
  createdAt              DateTime              @default(now())
  updatedAt              DateTime              @updatedAt

  @@index([pekonId, role])
  @@index([phoneNumber])
}

model UserSession {
  id               String   @id @default(uuid()) @db.Uuid
  userId           String   @db.Uuid
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshTokenHash String   @unique // Token di-hash dengan SHA-256
  tokenFamily      String   @db.Uuid // Deteksi pencurian token (Reuse Detection)
  deviceId         String
  ipAddress        String?
  isRevoked        Boolean  @default(false)
  expiresAt        DateTime
  createdAt        DateTime @default(now())

  @@index([userId, isRevoked])
}

// ==========================================
// 2. DOUBLE-ENTRY WALLET & IMMUTABLE LEDGER
// ==========================================
model Wallet {
  id             String        @id @default(uuid()) @db.Uuid
  userId         String        @unique @db.Uuid
  user           User          @relation(fields: [userId], references: [id])
  pointsBalance  Decimal       @default(0) @db.Decimal(18, 2) // Poin reputasi / gizi
  cashBalance    Decimal       @default(0) @db.Decimal(18, 2) // Komisi mikro / upah
  version        Int           @default(1) // OCC Lock mencegah Race Condition saldo
  updatedAt      DateTime      @updatedAt
  ledgerEntries  LedgerEntry[]
}

model LedgerEntry {
  id                 String             @id @default(uuid()) @db.Uuid
  walletId           String             @db.Uuid
  wallet             Wallet             @relation(fields: [walletId], references: [id])
  transactionId      String             @db.Uuid
  transaction        UnifiedTransaction @relation(fields: [transactionId], references: [id])
  entryType          String             // DEBIT / CREDIT
  currency           String             // POINTS / IDR
  amount             Decimal            @db.Decimal(18, 2)
  balanceBefore      Decimal            @db.Decimal(18, 2)
  balanceAfter       Decimal            @db.Decimal(18, 2)
  integritySignature String             // HMAC-SHA256 dari baris ini untuk anti-tampering DB
  createdAt          DateTime           @default(now())

  @@index([walletId, createdAt])
}

// ==========================================
// 3. MODUL 1: BURSA HASIL BUMI & REFERRAL
// ==========================================
model HarvestListing {
  id            String       @id @default(uuid()) @db.Uuid
  farmerId      String       @db.Uuid
  farmer        User         @relation("FarmerHarvests", fields: [farmerId], references: [id])
  pekonId       String       @db.Uuid
  pekon         Pekon        @relation(fields: [pekonId], references: [id])
  commodityName String       // Singkong, Kakao, Kelapa, Pisang, Ikan, dll.
  estimatedKg   Decimal      @db.Decimal(10, 2)
  minPricePerKg Decimal      @db.Decimal(12, 2)
  status        String       @default("OPEN_BIDDING") // OPEN_BIDDING, DEAL_LOCKED, COMPLETED
  bids          HarvestBid[]
  createdAt     DateTime     @default(now())

  @@index([pekonId, status, commodityName])
}

model HarvestBid {
  id                String         @id @default(uuid()) @db.Uuid
  listingId         String         @db.Uuid
  listing           HarvestListing @relation(fields: [listingId], references: [id])
  collectorId       String         @db.Uuid
  collector         User           @relation("CollectorBids", fields: [collectorId], references: [id])
  offeredPricePerKg Decimal        @db.Decimal(12, 2)
  isAccepted        Boolean        @default(false)
  referralUsedCode  String?        // Jika petani memakai kode referral pengepul jujur
  createdAt         DateTime       @default(now())
}

model CollectorReferral {
  id               String             @id @default(uuid()) @db.Uuid
  referrerId       String             @db.Uuid
  referrer         User               @relation("ReferrerUser", fields: [referrerId], references: [id])
  collectorId      String             @db.Uuid
  collector        User               @relation("ReferredCollector", fields: [collectorId], references: [id])
  transactionId    String             @unique @db.Uuid
  transaction      UnifiedTransaction @relation(fields: [transactionId], references: [id])
  microCommission  Decimal            @db.Decimal(12, 2)
  reputationPoints Decimal            @db.Decimal(10, 2)
  createdAt        DateTime           @default(now())
}

// ==========================================
// 4. MODUL 2: NEBENG-JASTIP SEARAH (KOMUTER)
// ==========================================
model CommuterRoute {
  id              String        @id @default(uuid()) @db.Uuid
  commuterId      String        @db.Uuid
  commuter        User          @relation(fields: [commuterId], references: [id])
  originName      String        // Misal: Pekon Pagelaran Utara
  destinationName String        // Misal: Pasar Induk Pringsewu
  originLat       Decimal       @db.Decimal(10, 8)
  originLng       Decimal       @db.Decimal(11, 8)
  destLat         Decimal       @db.Decimal(10, 8)
  destLng         Decimal       @db.Decimal(11, 8)
  currentLat      Decimal?      @db.Decimal(10, 8)
  currentLng      Decimal?      @db.Decimal(11, 8)
  isActive        Boolean       @default(true)
  orders          JastipOrder[]
  startedAt       DateTime      @default(now())
  endedAt         DateTime?

  @@index([isActive, originLat, originLng])
}

model JastipOrder {
  id              String        @id @default(uuid()) @db.Uuid
  routeId         String        @db.Uuid
  route           CommuterRoute @relation(fields: [routeId], references: [id])
  requesterId     String        @db.Uuid
  requester       User          @relation("JastipRequester", fields: [requesterId], references: [id])
  itemDescription String
  fuelShareCost   Decimal       @db.Decimal(12, 2) // Ongkos patungan bensin
  pickupLat       Decimal       @db.Decimal(10, 8)
  pickupLng       Decimal       @db.Decimal(11, 8)
  status          String        @default("REQUESTED")
  createdAt       DateTime      @default(now())
}

// ==========================================
// 5. MODUL 3: BURSA MINI-JOB (ZERO-DISCRIMINATION)
// ==========================================
model MiniJob {
  id                   String    @id @default(uuid()) @db.Uuid
  employerId           String    @db.Uuid
  employer             User      @relation("JobEmployer", fields: [employerId], references: [id])
  workerId             String?   @db.Uuid
  worker               User?     @relation("JobWorker", fields: [workerId], references: [id])
  title                String    // Misal: Kupas Singkong, Kemas Gula Aren
  description          String
  wageAmount           Decimal   @db.Decimal(12, 2)
  isDisabilityFriendly Boolean   @default(false) // Penanda Ramah Disabilitas/Lansia
  autoAcceptLock       Boolean   @default(false) // FR-3.2: Terkunci otomatis tanpa tombol Tolak
  status               String    @default("OPEN") // OPEN, LOCKED_BY_PRIORITY, COMPLETED
  version              Int       @default(1) // Mencegah 2 pekerja mengunci tugas di milidetik yang sama
  createdAt            DateTime  @default(now())
  lockedAt             DateTime?

  @@index([status, isDisabilityFriendly])
}

// ==========================================
// 6. MODUL 4: TRANSAKSI TERPADU & SELFIE PoW
// ==========================================
model UnifiedTransaction {
  id                String             @id @default(uuid()) @db.Uuid
  idempotencyKey    String             @unique // Mencegah transaksi ganda saat sinyal lemah
  transactionToken  String             @unique // Token kriptografi 1x pakai untuk klaim transaksi
  type              TransactionType
  referenceEntityId String             @db.Uuid // ID dari HarvestBid / JastipOrder / MiniJob
  initiatorId       String             @db.Uuid
  initiator         User               @relation("TxInitiator", fields: [initiatorId], references: [id])
  counterpartyId    String             @db.Uuid
  counterparty      User               @relation("TxCounterparty", fields: [counterpartyId], references: [id])
  grossAmount       Decimal            @db.Decimal(18, 2)
  status            TransactionStatus  @default(INITIATED)
  
  selfieProof       SelfieProofOfWork?
  ledgerEntries     LedgerEntry[]
  collectorReferral CollectorReferral?
  
  version           Int                @default(1)
  createdAt         DateTime           @default(now())
  completedAt       DateTime?

  @@index([initiatorId, status])
  @@index([counterpartyId, status])
}

model SelfieProofOfWork {
  id                String             @id @default(uuid()) @db.Uuid
  transactionId     String             @unique @db.Uuid
  transaction       UnifiedTransaction @relation(fields: [transactionId], references: [id])
  imageStorageUrl   String             // URL di Object Storage (WORM)
  imageSha256Hash   String             // Hash file gambar setelah di-watermark
  gpsLatitude       Decimal            @db.Decimal(10, 8)
  gpsLongitude      Decimal            @db.Decimal(11, 8)
  gpsAccuracyMeters Decimal            @db.Decimal(6, 2)
  pekonNameOverlay  String
  serverTimestamp   DateTime           @default(now())
  isCameraDirect    Boolean            @default(true) // Validasi bukan dari galeri
  validityScore     Decimal            @db.Decimal(5, 2) // Bobot V_selfie (0 - 100)
}

// ==========================================
// 7. MODUL 5 & 6: SPK CREDIT SCORING & GIZI
// ==========================================
model CreditScoreSnapshot {
  id              String      @id @default(uuid()) @db.Uuid
  userId          String      @db.Uuid
  user            User        @relation(fields: [userId], references: [id])
  triggerTxId     String      @db.Uuid
  nJastipScore    Decimal     @db.Decimal(5, 2) // Bobot 0.20
  nMinijobScore   Decimal     @db.Decimal(5, 2) // Bobot 0.25
  nHasilbumiScore Decimal     @db.Decimal(5, 2) // Bobot 0.20
  vSelfieScore    Decimal     @db.Decimal(5, 2) // Bobot 0.20
  iInklusiScore   Decimal     @db.Decimal(5, 2) // Bobot 0.15
  totalSkredit    Decimal     @db.Decimal(5, 2) // Hasil Rumus SPK AHP-TOPSIS (0 - 100)
  grade           CreditGrade
  calculatedAt    DateTime    @default(now())

  @@index([userId, calculatedAt(sort: Desc)])
}

model LoanRecommendation {
  id                 String    @id @default(uuid()) @db.Uuid
  userId             String    @db.Uuid
  user               User      @relation(fields: [userId], references: [id])
  scoreAtApproval    Decimal   @db.Decimal(5, 2)
  recommendedPlafond Decimal   @default(1500000) @db.Decimal(15, 2) // Default Rp 1.500.000 Tanpa Agunan
  status             String    @default("ELIGIBLE_WAITING_BUMDES") // ELIGIBLE_WAITING_BUMDES, APPROVED, DISBURSED
  approvedByBumdesId String?   @db.Uuid
  createdAt          DateTime  @default(now())
  approvedAt         DateTime?
}

model NutritionPackage {
  id          String                @id @default(uuid()) @db.Uuid
  pekonId     String                @db.Uuid
  pekon       Pekon                 @relation(fields: [pekonId], references: [id])
  packageName String                // Misal: Paket Stunting Telur & Ikan Nila Lokal
  pointsCost  Decimal               @db.Decimal(10, 2)
  stockCount  Int
  redemptions NutritionRedemption[]
}

model NutritionRedemption {
  id          String           @id @default(uuid()) @db.Uuid
  userId      String           @db.Uuid
  user        User             @relation(fields: [userId], references: [id])
  packageId   String           @db.Uuid
  package     NutritionPackage @relation(fields: [packageId], references: [id])
  pointsSpent Decimal          @db.Decimal(10, 2)
  status      String           @default("CLAIMED")
  redeemedAt  DateTime         @default(now())
}
```

## 3. Arsitektur Tokenized Authentication (Zero-Trust Identity)

Untuk melindungi masyarakat desa dari pengambilalihan akun (*Account Takeover*) sekaligus ramah terhadap perangkat berspesifikasi rendah dan sinyal lemah:

### A. Dual-Token Architecture (Access + Refresh Token)

- **Access Token (Stateless JWT - HS256):** Berumur pendek (15 menit). Ditandatangani dengan secret key simetris (minimal 256-bit). Dipilih HS256 karena arsitektur single-server monolith; tidak memerlukan distribusi public key antar microservices. Payload hanya memuat klaim terenkripsi/ter-tokenisasi (`sub: userId`, `pekonId`, `role`, `vulFlags`, `jti`).
- **Refresh Token (Opaque Crypto Token):** Berumur panjang (30 hari) agar petani/lansia tidak perlu berulang kali login di area susah sinyal. Pada aplikasi mobile disimpan di `expo-secure-store` (Keystore/Keychain perangkat), sedangkan pada Web Dashboard disimpan di HTTP-only secure cookie `jejaring_pringsewu`. Token di-hash dengan SHA-256 di tabel `UserSession`.
- **Mekanisme Login Utama & OTP:** Otentikasi utama menggunakan nomor telepon genggam (`phoneNumber`) atau email dengan OTP 6 digit yang dikirim melalui Push Notification Firebase Cloud Messaging (FCM) ke perangkat pengguna. Nomor WhatsApp (`phoneNumber`) tetap tersimpan di database untuk kebutuhan komunikasi langsung antarpengguna (misal kurir jastip dengan pemesan atau pengepul dengan petani). Pengguna juga dapat menautkan akun Google (OAuth 2.0).

### B. Refresh Token Rotation & Reuse Detection

- Setiap kali Access Token kedaluwarsa, aplikasi menukar Refresh Token lama dengan yang baru dalam satu `tokenFamily`.
- Jika Refresh Token yang sudah pernah dipakai digunakan kembali oleh pihak ketiga (indikasi pencurian token), sistem langsung membatalkan (*revoke*) seluruh sesi dalam `tokenFamily` tersebut secara otomatis.

### C. Tokenisasi Data Pribadi (PII Vaulting)

- Nomor Induk Kependudukan (NIK) tidak pernah disimpan dalam bentuk teks biasa (*plaintext*). Sistem membuat `nikHash` (HMAC-SHA256) untuk indeks pencarian unik dan `nikEncrypted` (AES-256-GCM) untuk validasi pencairan modal BUMDes.

#### Validasi NIK via Integrasi Dukcapil/NIA (Planned)

- Untuk fase awal/MVP, validasi NIK dilakukan secara manual oleh Admin BUMDes melalui Web Dashboard berdasarkan data sukarelawan tester.
- Di masa depan, endpoint internal `POST /api/v1/users/verify-nik` akan memvalidasi NIK warga terhadap data kependudukan Nasional (NIA/Dukcapil API).
- Data respons Dukcapil tidak disimpan secara permanen — hanya flag `isNikVerified: Boolean` yang dicatat di model User.

### D. WhatsApp Bot Webhook Tokenization (FR-7.4)

- Untuk petani lansia yang berinteraksi lewat Bot WhatsApp, nomor telepon dipetakan ke Short-Lived Session Token di Redis yang diverifikasi melalui tanda tangan kriptografi `X-Hub-Signature-256` dari WhatsApp Cloud API.

## 4. Arsitektur Tokenized Transaction & Anti-Tampering

Karena aplikasi menangani uang komisi, klaim pekerjaan tanpa tolak (Auto-Accept Lock), serta bukti Selfie Proof-of-Work yang menentukan pencairan pinjaman Rp1.500.000 tanpa agunan, seluruh alur transaksi menggunakan Cryptographic Transaction Tokenization:

1. **Idempotency Token (Idempotency-Key):**
   - Mengingat kondisi jaringan di pekon yang sering putus-nyambung, aplikasi klien menghasilkan UUID v4 sebagai `Idempotency-Key` sebelum mengirim *request* Ambil Mini-Job, Order Jastip, atau Upload Selfie.
   - Redis dan kolom `UnifiedTransaction.idempotencyKey` akan menahan *request* duplikat. Jika pengguna menekan tombol berkali-kali saat sinyal lambat, transaksi dijamin hanya dieksekusi satu kali.
2. **Signed Ephemeral Transaction Token (QR / Proximity Handshake):**
   - Saat kurir Nebeng-Jastip bertemu warga, atau pekerja Mini-Job menyelesaikan tugas, server menerbitkan `transactionToken` berumur 5 menit yang ditandatangani dengan HMAC-SHA256:

```text
Token = Base64(Payload) + "." + HMAC_SHA256(Payload, ServerSecret)
```

   - Payload berisi: `txId` + `initiatorId` + `counterpartyId` + `roundedGpsLat` + `roundedGpsLng` + `timestampWindow`.
3. **Cryptographic Watermark & Selfie Proof-of-Work Tokenization (FR-4.1 & FR-4.2):**
   - Kamera (`expo-camera`) mengunci mode *Direct Capture Only* (tanpa akses galeri perangkat).
   - Sebelum foto diunggah, aplikasi menempelkan *watermark* (Koordinat GPS, Nama Pekon, Waktu Server, ID Transaksi), mengompresi gambar (`expo-image-manipulator`), lalu menghitung SHA-256 Checksum dari biner gambar di perangkat klien.
   - Hash tersebut dikirim di dalam *header* yang ditandatangani. Server memverifikasi bahwa biner foto yang diterima cocok 100% dengan *hash* dari klien dan koordinat GPS berada dalam batas toleransi radius transaksi.

## 5. Database Atomic, Concurrency Control & ACID Pattern

Seluruh operasi kritikal di Prisma ORM wajib dibungkus dalam Interactive Transactions (`prisma.$transaction`) dengan level isolasi tinggi dan penguncian baris eksplisit.

### A. Atomic Auto-Accept Lock pada Mini-Job Disabilitas (FR-3.2)

Untuk mencegah Race Condition ketika 2 pekerja menekan tombol "Ambil Tugas" pada milidetik yang sama, sistem menggunakan Optimistic Concurrency Control (OCC) yang dikombinasikan dengan Serializable / Row-Level Locking:

```typescript
// Implementasi Atomic Auto-Accept Lock di NestJS + Prisma
async claimDisabilityMiniJob(jobId: string, workerId: string, idempotencyKey: string) {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Pessimistic Row-Level Lock (SELECT ... FOR UPDATE NOWAIT)
    // Memastikan baris pekerjaan dikunci di level engine PostgreSQL
    const [job] = await tx.$queryRaw<MiniJob[]>`
      SELECT * FROM "MiniJob" 
      WHERE id = ${jobId}::uuid AND status = 'OPEN' 
      FOR UPDATE NOWAIT
    `;

    if (!job) {
      throw new ConflictException('Tugas mikro sudah diambil oleh pekerja lain.');
    }

    // 2. Verifikasi status kerentanan pekerja (Zero-Discrimination Priority)
    const worker = await tx.user.findUniqueOrThrow({ where: { id: workerId } });
    const isPriorityWorker = worker.vulnerabilityFlags.some(flag => flag !== 'NONE');

    if (job.isDisabilityFriendly && !isPriorityWorker) {
      throw new ForbiddenException('Tugas ini diprioritaskan khusus untuk penyandang disabilitas/lansia.');
    }

    // 3. Kunci Pekerjaan secara Atomik (Tanpa Opsi Tolak dari Pemberi Kerja - FR-3.2)
    const updatedJob = await tx.miniJob.update({
      where: { id: job.id, version: job.version },
      data: {
        workerId: worker.id,
        status: 'LOCKED_BY_PRIORITY',
        autoAcceptLock: true,
        lockedAt: new Date(),
        version: { increment: 1 }
      }
    });

    // 4. Buat Entitas UnifiedTransaction secara Atomik dalam transaksi DB yang sama
    const unifiedTx = await tx.unifiedTransaction.create({
      data: {
        idempotencyKey,
        transactionToken: this.cryptoService.generateTxToken(job.id, job.employerId, worker.id),
        type: 'MINI_JOB',
        referenceEntityId: job.id,
        initiatorId: job.employerId,
        counterpartyId: worker.id,
        grossAmount: job.wageAmount,
        status: 'LOCKED_ASSIGNED'
      }
    });

    return { updatedJob, unifiedTx };
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Level isolasi tertinggi
    maxWait: 5000,
    timeout: 10000
  });
}
```

### B. Atomic Verification Selfie PoW, Mutasi Buku Besar, & Kalkulasi SPK (Skredit) (FR-4 & FR-5)

Saat foto selfie berhasil diunggah, 5 proses database dieksekusi secara 100% Atomik (jika satu gagal, seluruhnya *rollback*):

1. Menyimpan metadata `SelfieProofOfWork`.
2. Mengubah status `UnifiedTransaction` menjadi `VERIFIED_COMPLETED`.
3. Mencatat mutasi poin/komisi ke `LedgerEntry` dan memperbarui `Wallet` dengan pengecekan `version` (OCC) serta `integritySignature`.
4. Menghitung ulang rumus SPK AHP-TOPSIS:

```text
Skredit = (0.20 * Njastip) + (0.25 * Nminijob) + (0.20 * Nhasilbumi) + (0.20 * Vselfie) + (0.15 * Iinklusi)
```

   dan menyimpan hasilnya ke `CreditScoreSnapshot`.
5. Jika $\text{Skredit} \ge 85$ dan pengguna belum memiliki rekomendasi aktif, otomatis menerbitkan baris `LoanRecommendation` (Plafon Rp1.500.000 Tanpa Agunan) untuk *dashboard* BUMDes serta memicu Transactional Outbox Event untuk mengirim notifikasi FCM.

## 6. Strategi Data Backup, Disaster Recovery & High Availability

Untuk menjamin keamanan data keuangan BUMDes dan rekam jejak reputasi warga dengan tetap menjaga efisiensi biaya server (budget Rp50.000-300.000/bulan pada fase awal melalui VPS self-hosted), sistem menerapkan strategi 3-2-1 Enterprise Backup:

1. **Continuous WAL Archiving & Point-in-Time Recovery (PITR):**
   - PostgreSQL dikonfigurasi dengan `wal_level = replica` dan menggunakan pgBackRest atau WAL-G. Setiap segmen Write-Ahead Log (WAL) dikompresi (Zstandard) dan dienkripsi menggunakan AES-256 sebelum dikirim secara *streaming* ke Off-site Object Storage (Cloudflare R2 / Backblaze B2 yang memiliki *free tier* besar dan biaya per GB sangat murah).
   - **Target Pemulihan:** RPO (*Recovery Point Objective*) < 5 menit (data maksimal hilang hanya dalam hitungan detik/menit jika server utama rusak total) dan RTO (*Recovery Time Objective*) < 30 menit.
2. **Automated Multi-Tier Snapshot Schedule:**
   - **Hourly Incremental Backup:** Setiap 1 jam untuk perubahan blok database.
   - **Daily Full Logical + Physical Backup:** Setiap pukul 02.00 WIB menggunakan `pg_dump` (format *custom* `-Fc`) dan *snapshot* fisik.
   - **Retensi Berjenjang (GFS - Grandfather-Father-Son):** Simpan 7 *backup* harian, 4 *backup* mingguan, dan 12 *backup* bulanan.
3. **Immutable Storage untuk Bukti Selfie Proof-of-Work:**
   - Bucket penyimpanan foto selfie ber-*geotag* dikonfigurasi dengan kebijakan Object Lock (*Governance/Compliance Mode*) sehingga foto bukti transaksi tidak dapat dihapus atau dimodifikasi bahkan oleh administrator server sekalipun selama masa audit kredit BUMDes.
4. **Automated Restore Drill (Verifikasi Backup Otomatis):**
   - *Cron job* mingguan secara otomatis memulihkan (*restore*) *backup* terbaru ke *container* PostgreSQL sementara (*ephemeral container*) dan menjalankan kueri verifikasi *checksum* `LedgerEntry` untuk memastikan berkas *backup* tidak korup (*Zero Silent Data Corruption*).

## 7. Praktik Terbaik Enterprise Lainnya (Enterprise Best Practices)

1. **Connection Pooling (PgBouncer / Prisma Accelerate):**
   - Mencegah kehabisan koneksi PostgreSQL (*connection exhaustion*) saat terjadi lonjakan warga yang membuka notifikasi *Geo-Fenced* Nebeng atau *Price Alert* secara bersamaan. PgBouncer dijalankan dalam mode *transaction pooling*.
2. **Transactional Outbox Pattern untuk FCM Notifikasi & OTP:**
   - Pengiriman Push Notification (`firebase-admin`), pengiriman kode OTP via FCM, serta notifikasi sistem tidak dipanggil langsung di dalam blok transaksi database agar tidak memperlambat kueri. Sistem menulis *event* ke tabel `OutboxEvent` secara atomik, lalu *worker* BullMQ (Redis) memproses pengiriman secara asinkron dengan mekanisme *Exponential Backoff Retry*.
3. **Offline-First & Low-Bandwidth Resilience (NFR-2):**
   - Semua respons REST API dikompresi dengan Brotli/Gzip.
   - Di sisi aplikasi React Native (Expo), jika warga mengambil foto Selfie Proof-of-Work di kebun/pekon yang sedang *blank-spot* sinyal, foto yang sudah di-*watermark* dan ditandatangani secara kriptografi disimpan di antrean terenkripsi lokal (`expo-sqlite` + `expo-file-system`), lalu diunggah otomatis di latar belakang (`expo-task-manager`) begitu perangkat menangkap sinyal.
4. **Observability & Audit Trail (BAPPERIDA Ready):**
   - Setiap perubahan status rekomendasi modal di *dashboard* BUMDes dicatat dalam Audit Log yang memuat `actorId`, `ipAddress`, `oldValue`, dan `newValue`.
   - Pemantauan kesehatan sistem menggunakan Prometheus + Grafana (atau *lightweight healthcheck endpoint*) untuk memantau latensi kalkulasi SPK, rasio keberhasilan pengiriman FCM, dan kapasitas penyimpanan server VPS.
