# AGENTS.md — AI Coding Agent Guidelines (Antigravity CLI)

## 1. Project Context & Identity
- **Project Name:** JEJARING-SEWU (SINERGI-PEKON) / KompasIptek
- **Domain:** Crowd-shipping (`Nebeng-Jastip`), Inclusive Mini-Job (`Zero-Discrimination`), Harvest Bursa, Selfie Proof-of-Work (`PoW`), AHP-TOPSIS Alternative Credit Scoring ($S_{kredit}$), & Stunting Nutrition Intervention.
- **Repository Architecture:** Monorepo terstruktur:
  - `/Backend`: Node.js, NestJS (`/api/v1`), TypeScript, Prisma ORM, PostgreSQL 16 (`postgis`, `pgcrypto`), Redis, BullMQ, `firebase-admin` (FCM).
  - `/Web`: Next.js 14/15, React, Tailwind CSS, `shadcn/ui`, TypeScript (Dashboard Admin Pekon / BUMDes / BAPPERIDA).
  - `/Mobile`: React Native (Expo SDK), TypeScript, `expo-camera`, `expo-sqlite`, `expo-location`.

---

## 2. Directory Structure Map (Monorepo)

```text
KompasIptek/
├── Backend/                             # NestJS API Server & Database ORM
│   ├── src/                             # Feature-Centered Modules
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── core/                        # PrismaService, Redis, Filters, Guards, Interceptors
│   │   └── features/                    # Auth, Users-Wallet, Harvest, Commuter, Mini-Job, Transaction-PoW, Credit-Scoring
│   ├── prisma/                          # schema.prisma & migrations
│   ├── package.json
│   ├── docker-compose.yml
│   └── .env
│
├── Web/                                 # Next.js Web Dashboard & Hybrid PWA
│   ├── src/
│   │   ├── app/                         # App Router Pages & Layouts
│   │   └── components/                  # UI Components (shadcn/ui, Tailwind)
│   ├── tailwind.config.js
│   ├── package.json
│   └── .env.local
│
├── Mobile/                              # React Native Expo Mobile Application
│   └── README.md                        # Panduan implementasi Expo SDK, kamera PoW & SQLite
│
├── ArchitectureTechnicalDocument.md     # Dokumen Arsitektur Teknis Lengkap
├── APIDocumentation.md                  # Spesifikasi Lengkap API Endpoint
└── README.md                            # Panduan umum monorepo
```

---

## 3. Token-Saving & Context Efficiency Rules (CRITICAL FOR AI AGENT)
Untuk menghemat pemakaian token dan mempercepat eksekusi di Antigravity CLI:
1. **Strict Subproject Isolation:**
   - Jika instruksi berkaitan dengan backend (API, database, schema), **HANYA** bekerja di dalam folder `Backend/`.
   - Jika instruksi berkaitan dengan dashboard web atau antarmuka frontend, **HANYA** bekerja di dalam folder `Web/`.
   - Jangan pernah membaca file di subproject lain kecuali dibutuhkan integrasi API secara langsung.
2. **Feature-Centered Sub-Isolation (Backend):**
   - Dalam `Backend/`, jika tugas hanya menyentuh satu fitur (misal: `mini-job`), hanya baca file di `Backend/src/features/mini-job/` dan `Backend/prisma/schema.prisma`.
3. **Surgical Edits Over Full Rewrites:**
   - Gunakan diff/patch atau edit spesifik pada fungsi yang diubah.
4. **Ignore Non-Code Artifacts:**
   - Dilarang membaca folder `node_modules/`, `dist/`, `.next/`, `.expo/`, `coverage/`, atau file `package-lock.json`.

---

## 4. Coding & Security Standards (Backend)
- **Zero Raw SQL Unsafe:** Dilarang keras menggunakan `$queryRawUnsafe`. Gunakan Prisma Client API atau parameterized `tx.$queryRaw`.
- **Atomic Interactive Transactions:** Semua mutasi dompet (`Wallet` & `LedgerEntry`), klaim Mini-Job, dan verifikasi Selfie PoW WAJIB dibungkus dalam `this.prisma.$transaction(...)`.
- **Double-Entry Bookkeeping:** Setiap mutasi saldo wajib tercatat di `LedgerEntry` lengkap dengan `balanceBefore`, `balanceAfter`, dan `integritySignature` (HMAC-SHA256).
- **Strict DTO Validation:** Input request wajib divalidasi dengan `class-validator`.
- **Standar Respons Error:** Gunakan `HttpException` dengan `errorCode` standar yang ditangkap oleh `AllExceptionsFilter`.

---

## 5. Web Frontend Standards (`Web/`)
- Gunakan Next.js App Router dengan Tailwind CSS.
- Konsumsi backend NestJS melalui environment variable `NEXT_PUBLIC_API_URL` (default: `http://localhost:3000/api/v1`).
- Semua panggilan API wajib menangani format standar JSON Envelope: `{ success: boolean, statusCode: number, data: any, message: string }`.
