# KompasIptek — JEJARING-SEWU (SINERGI-PEKON)
> **Enterprise Circular Economy Engine & Inclusive Village Ecosystem**

Repositori monorepo ini menyatukan seluruh komponen sistem:
- **`Backend/`**: Node.js (NestJS) + PostgreSQL 16 (PostGIS) + Redis + Prisma ORM
- **`Web/`**: Next.js + Tailwind CSS + shadcn/ui (Web Dashboard & Hybrid PWA)
- **`Mobile/`**: React Native (Expo SDK) Mobile Client (Warga, Kurir Jastip, & Pekerja Mini-Job)

---

## Struktur Folder

```text
KompasIptek/
├── Backend/                 # NestJS REST API Server & Prisma Database
├── Web/                     # Next.js Web Dashboard & Admin Pekon
├── Mobile/                  # React Native Expo Mobile App
├── ArchitectureTechnicalDocument.md  # Dokumen Arsitektur Teknis Lengkap
├── APIDocumentation.md      # Katalog & Dokumentasi API Endpoint
└── AGENTS.md                # Panduan AI Coding Agent (Antigravity CLI)
```

---

## Panduan Menjalankan Layanan

### 1. Backend (`/Backend`)
```bash
cd Backend
npm install
# Konfigurasi environment
cp .env.example .env
# Jalankan PostgreSQL & Redis via Docker
docker-compose up -d
# Sinkronkan schema database
npx prisma migrate dev
# Jalankan server pengembangan
npm run start:dev
```
Server berjalan di: `http://localhost:3000` (API Base: `/api/v1`)

---

### 2. Web Frontend (`/Web`)
```bash
cd Web
npm install
# Jalankan development server
npm run dev
```
Web dashboard berjalan di: `http://localhost:3001` (atau `http://localhost:3000` jika backend di port berbeda).

---

### 3. Mobile App (`/Mobile`)
Panduan inisialisasi dan konfigurasi Expo terdapat pada [Mobile/README.md](./Mobile/README.md).
