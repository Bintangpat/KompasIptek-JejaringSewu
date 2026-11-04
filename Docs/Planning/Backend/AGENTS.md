# AGENTS.md — AI Coding Agent Guidelines (Antigravity CLI)

## 1. Project Context & Identity
- **Project Name:** JEJARING-SEWU (SINERGI-PEKON) — Enterprise Circular Economy Engine
- **Domain:** Crowd-shipping (`Nebeng-Jastip`), Inclusive Mini-Job (`Zero-Discrimination`), Harvest Bursa, Selfie Proof-of-Work (`PoW`), AHP-TOPSIS Alternative Credit Scoring ($S_{kredit}$), & Stunting Nutrition Intervention.
- **Architecture:** Feature-Centered Design (NestJS Modular Monolith), Double-Entry Immutable Ledger, Zero-Trust Security.
- **Tech Stack:**
  - **Backend:** Node.js, NestJS (`/api/v1`), TypeScript, Prisma ORM, PostgreSQL 16 (`postgis`, `pgcrypto`), Redis, BullMQ, `firebase-admin` (FCM), `argon2`, `class-validator`.
  - **Mobile Client:** React Native (Expo SDK), TypeScript, `expo-camera`, `expo-location`, `expo-image-manipulator`, `expo-task-manager`, `expo-sqlite` (Offline-First), OpenStreetMap.
  - **Web Dashboard & PWA:** Next.js, Tailwind CSS, `shadcn/ui`, `React-Leaflet`.

---

## 2. Token-Saving & Context Efficiency Rules (CRITICAL FOR AI AGENT)
Untuk menghemat pemakaian token dan mempercepat eksekusi di Antigravity CLI, patuhi aturan berikut secara mutlak:
1. **Strict Module Isolation (Jangan Baca Seluruh Repo):**
   - Proyek menggunakan *Feature-Centered Design*. Jika tugas hanya menyentuh satu fitur (misal: `mini-job`), **HANYA** baca file di dalam `src/features/mini-job/` dan `prisma/schema.prisma`.
   - **DILARANG** melakukan *full-directory scan* atau membaca modul fitur lain kecuali diminta secara eksplisit.
2. **Surgical Edits Over Full Rewrites:**
   - Gunakan *diff/patch* atau edit spesifik pada fungsi yang diubah. Jangan menulis ulang keseluruhan isi file jika hanya menambahkan 1 *endpoint* atau memperbaiki 1 *method*.
3. **No Redundant Boilerplate Explanations:**
   - Langsung eksekusi kode tanpa memberikan penjelasan panjang lebar mengenai cara kerja NestJS, Prisma, atau React Native. Berikan ringkasan perubahan maksimal 3-5 poin di akhir.
4. **Targeted Testing Only:**
   - Saat memverifikasi kode, jalankan *unit test* spesifik pada file yang sedang dikerjakan: `npx jest src/features/<feature-name>/<feature-name>.service.spec.ts`. Jangan menjalankan seluruh *test suite* kecuali diminta.
5. **Ignore Non-Code Artifacts:**
   - Jangan pernah membaca `node_modules/`, `dist/`, `.next/`, `.expo/`, `coverage/`, atau `package-lock.json`.

---

## 3. Directory Structure Map (Backend NestJS)
Gunakan peta ini untuk langsung menuju ke lokasi file tanpa melakukan pencarian buta:
```text
src/
├── main.ts                          # Bootstrap, Helmet, Strict CORS, CookieParser, Global ValidationPipe
├── app.module.ts                    # Root Module, ThrottlerModule (short, medium, otp_strict), ConfigModule
├── core/                            # Cross-Cutting Infrastructure (JANGAN UBAH KECUALI DIMINTA)
│   ├── database/                    # PrismaService & PrismaModule
│   ├── redis/                       # RedisService (Cache, OTP TTL 300s, Idempotency, Distributed Lock)
│   ├── filters/all-exceptions.filter.ts # Global Error Handler & Prisma Error Mapper
│   ├── guards/                      # jwt-auth.guard.ts, roles.guard.ts, idempotency.guard.ts
│   ├── interceptors/                # transform.interceptor.ts (Standard JSON Envelope)
│   └── decorators/                  # @CurrentUser(), @Roles(), @Public()
└── features/                        # FEATURE-CENTERED MODULES (Lokasi Kerja Utama)
    ├── auth/                        # Login HP/Email, Google OAuth2, OTP FCM, Forgot Pass, Cookie Refresh (`jejaring_pringsewu`)
    ├── users-wallet/                # Profil Warga, Enkripsi NIK (AES-256-GCM & SHA-256), Double-Entry Wallet
    ├── harvest-bursa/               # Modul 1: Bursa Hasil Bumi (`/harvests`) & Referral Pengepul Jujur
    ├── commuter-jastip/             # Modul 2: Nebeng-Jastip Searah (`/commuters`) & PostGIS Geo-Routing
    ├── mini-job/                    # Modul 3: Bursa Mini-Job (`/mini-jobs`) & Atomic Auto-Accept Lock
    ├── transaction-pow/             # Modul 4: Unified Transaction (`/transactions`) & Selfie PoW
    ├── credit-scoring/              # Modul 5: Mesin SPK AHP-TOPSIS (`/credit-scoring`) & Loan BUMDes
    ├── nutrition-stunting/          # Modul 6: Penukaran Poin ke Paket Gizi Lokal (`/nutrition`)
    └── notifications/               # Modul 7: FCM Push Notification & WhatsApp Bot Webhook (BullMQ Outbox)
```

---

## 4. Non-Negotiable Coding & Security Standards

### A. Database, Concurrency & Anti-SQL Injection (Prisma)
- **Zero Raw SQL Unsafe:** DILARANG KERAS menggunakan `$queryRawUnsafe` atau `$executeRawUnsafe`. Gunakan Prisma Client API atau Tagged Template `tx.$queryRaw` / `Prisma.sql` (otomatis parameterized `$1`, `$2`).
- **Atomic Interactive Transactions:** Semua operasi mutasi dompet (`Wallet` & `LedgerEntry`), klaim Mini-Job, dan verifikasi Selfie PoW WAJIB dibungkus dalam `this.prisma.$transaction(async (tx) => { ... }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })`.
- **Row-Level Locking & OCC:**
  - Gunakan `SELECT * FROM "MiniJob" WHERE id = ${jobId}::uuid AND status = 'OPEN' FOR UPDATE NOWAIT` untuk mencegah race condition pada klaim tugas.
  - Selalu validasi dan increment kolom `version: { increment: 1 }` pada model `User`, `Wallet`, `MiniJob`, dan `UnifiedTransaction`.
- **Double-Entry Bookkeeping:** Setiap perubahan `pointsBalance` atau `cashBalance` di `Wallet` wajib menulis catatan baru di `LedgerEntry` lengkap dengan `balanceBefore`, `balanceAfter`, dan `integritySignature` (HMAC-SHA256).

> **Detail implementasi kode:** Lihat [BackendTechnicalDocument.md](./BackendTechnicalDocument.md) Section 2C (Anti-SQL Injection).

### B. Authentication, PII & Request Validation
- **Login Identifier:** Login menerima nomor HP/WhatsApp (utama) atau email (alternatif) sebagai identifier.
- **Registrasi Wajib:** NIK + phoneNumber (WhatsApp) + password + pekonId. Email bersifat opsional. Nomor WhatsApp wajib disimpan untuk keperluan kontak antarpengguna.
- **OTP Channel:** OTP 6 digit dikirim melalui FCM (Firebase Cloud Messaging) Push Notification ke perangkat user.
- **Token Architecture:**
  - Access Token: JWT HS256 (15 menit) dikirim via JSON body.
  - Refresh Token: Opaque Token (30 hari) WAJIB disimpan di Cookie `jejaring_pringsewu` dengan flag `httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/v1/auth'`. Di database (`UserSession`), simpan hash SHA-256-nya beserta `tokenFamily` untuk Reuse Detection.
- **PII Protection (NIK & Password):**
  - Password wajib di-hash dengan `argon2`.
  - NIK: `nikHash` (SHA-256) + `nikEncrypted` (AES-256-GCM). Validasi NIK fase awal via Admin BUMDes (Dukcapil/NIA planned) → flag `isNikVerified`.
- **Strict DTO Validation:** Semua input request (`@Body()`, `@Query()`, `@Param()`) wajib menggunakan DTO dengan dekorator `class-validator` (`@IsString()`, `@IsUUID('4')`, `@IsEmail()`, `@Matches()`, dll.).
- **Rate Limiting:** Gunakan `@Throttle({ otp_strict: { limit: 3, ttl: 300000 } })` pada endpoint pengiriman OTP dan pemulihan kata sandi.

> **Detail implementasi DTO & Controller:** Lihat [BackendTechnicalDocument.md](./BackendTechnicalDocument.md) Section 4.

### C. Standard Error Handling
Jangan membuat format respons error sendiri. Lempar `HttpException` bawaan NestJS dengan menyertakan `errorCode` standar agar ditangkap oleh `AllExceptionsFilter`:
- `ERR_VALIDATION_FAILED` (400)
- `ERR_INSUFFICIENT_POINTS` (400)
- `ERR_OTP_INVALID_OR_EXPIRED` (400)
- `ERR_AUTH_INVALID_CREDENTIALS` (401)
- `ERR_AUTH_TOKEN_EXPIRED` (401)
- `ERR_FORBIDDEN_ROLE_ACCESS` (403)
- `ERR_RESOURCE_NOT_FOUND` (404 - Prisma P2025)
- `ERR_DUPLICATE_ENTRY` (409 - Prisma P2002)
- `ERR_CONCURRENCY_LOCK` (409 - Prisma P2034 / PG 55P03)
- `ERR_STOCK_DEPLETED` (409)
- `ERR_NIK_VERIFICATION_FAILED` (422)
- `ERR_SELFIE_INTEGRITY_MISMATCH` (422)
- `ERR_RATE_LIMIT_EXCEEDED` (429)

---

## 5. Core Domain Business Logic Reference (Cheat Sheet)
Gunakan rumus dan aturan bisnis ini secara langsung tanpa perlu mencari ulang di dokumen spesifikasi:
- **Zero-Discrimination Auto-Accept Lock (Modul 3 - Mini-Job):**
  - Jika `job.isDisabilityFriendly === true`, hanya pengguna dengan `vulnerabilityFlags` selain `NONE` yang dapat mengklaim.
  - Saat diklaim oleh pekerja prioritas, set `status = 'LOCKED_BY_PRIORITY'` dan `autoAcceptLock = true`. Pemberi kerja tidak memiliki endpoint atau opsi untuk menolak pekerja tersebut.
- **Selfie Proof-of-Work (Modul 4):**
  - Hanya menerima tangkapan kamera langsung (`isCameraDirect: true`, bukan unggahan galeri).
  - Verifikasi `X-Image-Hash` (SHA-256 checksum gambar setelah ditempel watermark Koordinat GPS, Nama Pekon, Waktu Server, dan ID Transaksi) serta kecocokan radius GPS.
- **Rumus SPK AHP-TOPSIS Credit Scoring (Modul 5):**
  Dihitung secara atomik setiap kali `UnifiedTransaction` berstatus `VERIFIED_COMPLETED`:
  $$S_{kredit} = (0.20 \cdot N_{jastip}) + (0.25 \cdot N_{minijob}) + (0.20 \cdot N_{hasilbumi}) + (0.20 \cdot V_{selfie}) + (0.15 \cdot I_{inklusi})$$

  **Klasifikasi Grade:**
  - `GRADE_A_LAYAK_MODAL`: $S_{kredit} \ge 85$ (Otomatis buat `LoanRecommendation` plafon Rp1.500.000 tanpa agunan dengan status `ELIGIBLE_WAITING_BUMDES`).
  - `GRADE_B_PEMBINAAN`: $70 \le S_{kredit} < 85$.
  - `GRADE_C_AWAL`: $S_{kredit} < 70$.
- **Frontend Mobile Rules (Expo React Native):**
  - Terapkan 4 Tab Utama: (1) Peta Searah & Jastip, (2) Bursa Panen & Mini-Job, (3) Kamera Validasi Selfie, (4) Dashboard Skor Kredit & Poin.
  - Wajib Aksesibilitas: Semua komponen interaktif/tombol wajib memiliki `accessible={true}` dan `accessibilityLabel` yang jelas untuk kompatibilitas penuh dengan Android TalkBack.
  - Low-Bandwidth & Offline-First: Kompresi foto di sisi klien dengan `expo-image-manipulator` sebelum upload, dan simpan antrean transaksi di `expo-sqlite` saat blank-spot sinyal.

---

## 6. Agent Execution Workflow (Step-by-Step)
Setiap kali pengguna memberikan instruksi pembuatan atau perbaikan fitur di Antigravity CLI, ikuti urutan kerja ini:
1. **Locate:** Identifikasi modul target di `src/features/<module>/`. Periksa hanya file di dalam folder tersebut.
2. **Schema Check:** Jika butuh referensi tabel/kolom, baca `prisma/schema.prisma` (jangan menebak nama kolom).
3. **Implement DTO & Validation:** Buat atau perbarui `dto/*.dto.ts` dengan dekorator `class-validator`.
4. **Implement Service (Atomic & Secure):** Tulis logika bisnis di `*.service.ts` menggunakan `PrismaService` dan `RedisService`. Pastikan transaksi menggunakan `$transaction` dan error menggunakan `errorCode` standar.
5. **Implement Controller:** Hubungkan ke `*.controller.ts` dengan Guard (`JwtAuthGuard`, `RolesGuard`, `IdempotencyGuard`) dan dekorator `@Throttle` jika relevan.
6. **Verify via Unit Test:** Buat atau perbarui `*.service.spec.ts` dengan melakukan mocking pada `PrismaService` dan `RedisService`, lalu jalankan Jest khusus pada file tersebut.

---

## 7. Cross-Reference ke Dokumen Teknis
- **Schema Prisma lengkap & Arsitektur Keamanan:** Lihat [ArchitectureTechnicalDocument.md](./ArchitectureTechnicalDocument.md)
- **Kode implementasi NestJS, DTO, Controller, Unit Test, & API Catalog:** Lihat [BackendTechnicalDocument.md](./BackendTechnicalDocument.md)
- Jangan menduplikasi konten detail dari dokumen di atas ke dalam file ini.
