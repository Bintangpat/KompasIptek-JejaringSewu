# AGENTS.md — Frontend Web Agent Guidelines

## 1. Project Context

**Project:** JEJARING-SEWU (SINERGI-PEKON) / KompasIptek Pringsewu  
**Subproject:** `Web/` — dashboard web authority dan portal PWA ringan  
**Status development:** Backend NestJS sudah menjadi sumber kontrak API utama. Frontend web sedang dibangun bertahap, dimulai dari dashboard BUMDes dan BAPPERIDA dengan data mock yang kemudian diganti integrasi API.

Frontend tidak menggantikan aplikasi mobile. Web digunakan untuk:

- Dashboard operasional BUMDes: verifikasi warga, pemantauan transaksi, rekomendasi kredit, pencairan modal, dan stok paket gizi.
- Dashboard analitik BAPPERIDA: agregasi lintas Pekon, peta, indikator ekonomi sirkular, inklusi, dan stunting.
- Portal/PWA warga secara bertahap: akses informasi, status transaksi, bursa hasil bumi/mini-job, dan alur Selfie Proof-of-Work jika kemampuan browser mendukung.

### Sumber kebenaran

Urutan rujukan ketika terjadi perbedaan:

1. Kontrak endpoint dan response backend aktual.
2. `Backend/BackendTechnicalDocument.md`.
3. `ArchitectureTechnicalDocument.md`.
4. `Web/FrontendWebTechnicalDocument.md`.
5. `Web/DesignToken.md`.
6. Implementasi aktual di `Web/src/`.

Jika implementasi berbeda dari dokumen, jangan menebak. Catat gap tersebut dan selaraskan dokumen atau kode secara eksplisit.

## 2. Directory Structure

```text
Web/
├── public/                         # Manifest, ikon, aset publik, marker peta
├── src/
│   ├── app/                        # Next.js App Router, route, layout, globals.css
│   │   ├── login/                  # Login authority
│   │   ├── (authority)/            # Route group dashboard BUMDes/BAPPERIDA (target)
│   │   ├── (citizen)/              # Route group portal warga/PWA (target)
│   │   └── api/                    # BFF/Route Handler hanya jika diperlukan
│   ├── components/
│   │   ├── ui/                     # Komponen primitif reusable
│   │   ├── layout/                 # Sidebar, topbar, dashboard shell
│   │   ├── map/                    # Komponen peta dan layer Pekon
│   │   └── shared/                 # Empty state, loading, error, accessibility
│   ├── context/                    # Context lintas halaman; minimalkan global state
│   ├── features/                   # Modul bisnis frontend (target)
│   │   ├── auth/
│   │   ├── users-wallet/
│   │   ├── harvest-bursa/
│   │   ├── commuter-jastip/
│   │   ├── mini-job/
│   │   ├── transaction-pow/
│   │   ├── credit-scoring/
│   │   └── nutrition-stunting/
│   ├── hooks/                      # Hook geolocation, query, session, responsive UI
│   ├── lib/                        # API client, formatter, watermark, utility
│   └── types/                      # Tipe kontrak API dan model tampilan
├── AGENTS.md
├── FrontendWebTechnicalDocument.md
├── DesignToken.md
├── package.json
└── tailwind.config.js
```

### Aturan isolasi

- Pekerjaan frontend hanya dilakukan di `Web/`, kecuali perubahan kontrak lintas subproject memang diperlukan.
- Jangan membaca atau mengubah `node_modules/`, `.next/`, `coverage/`, `dist/`, `.expo/`, atau `package-lock.json` untuk pekerjaan biasa.
- Untuk satu fitur, fokus pada `src/features/<feature>/`, route terkait, komponen yang dipakai, `src/lib`, dan `src/types` yang relevan.
- Jangan memindahkan atau mengganti struktur route yang sudah berjalan tanpa memeriksa call site dan navigasi.

## 3. Coding Pattern

### 3.1 Next.js dan React

- Gunakan Next.js App Router dan TypeScript strict.
- Default-kan komponen menjadi Server Component. Tambahkan `'use client'` hanya untuk state, event handler, browser API, kamera, peta, atau context.
- Pisahkan komponen presentasi dari orkestrasi data dan mutasi.
- Gunakan komponen kecil yang composable; jangan menaruh seluruh logika halaman di `page.tsx`.
- Gunakan route group/layout untuk guard dan shell, tetapi otorisasi final tetap berada di backend.
- Hindari menyimpan data domain yang dapat diambil ulang di banyak state global.

### 3.2 Feature-driven design

Setiap fitur baru sebaiknya mengikuti pola:

```text
src/features/<feature>/
├── components/       # UI khusus fitur
├── hooks/            # Query/mutation dan state lokal fitur
├── schemas/          # Zod schema request/form, jika dependency sudah tersedia
├── constants.ts
└── types.ts
```

API call tetap melalui `src/lib/api-client.ts`. Jangan memanggil Axios langsung dari komponen bila dapat dibuat melalui hook/service fitur.

### 3.3 Kontrak API

Backend menggunakan envelope standar:

```ts
interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
}
```

- Normalisasi envelope dilakukan satu kali di API client.
- Jangan menganggap `response.data` selalu berupa model domain; pastikan tipe response sesuai endpoint.
- Tampilkan `message` backend secara aman dan gunakan `errorCode` untuk state UI yang dapat dipetakan.
- Jangan membuat endpoint frontend yang mengubah aturan bisnis backend.
- Default API URL: `NEXT_PUBLIC_API_URL`, fallback dokumentasi: `http://localhost:3000/api/v1`.

### 3.4 Form, loading, dan error

- Semua input penting memiliki label, pesan validasi, state disabled saat submit, dan feedback sukses/gagal.
- Validasi UX boleh dilakukan di frontend, tetapi backend selalu menjadi validator final.
- Setiap halaman data memiliki loading, empty, error, dan retry state.
- Mutasi yang dapat diklik dua kali harus disabled selama request dan, untuk operasi backend yang mendukungnya, mengirim `Idempotency-Key`.
- Format angka Rupiah, tanggal, status transaksi, dan grade kredit menggunakan formatter terpusat.

### 3.5 Accessibility dan responsive UI

- Target minimum WCAG 2.1 AA.
- Gunakan elemen semantik HTML sebelum ARIA.
- Semua tombol ikon memiliki `aria-label`; semua input memiliki label yang terhubung.
- Fokus keyboard harus terlihat. Jangan mengandalkan warna saja untuk status.
- Gunakan `aria-live` untuk pengumuman async yang penting.
- Dashboard authority harus usable pada desktop dan tablet; portal warga harus mobile-first dan low-bandwidth.
- Peta, chart, dan tabel harus menyediakan ringkasan teks atau tabel alternatif.

## 4. Security Standard

### 4.1 Zero-trust frontend

Frontend tidak dipercaya sebagai sumber identitas, role, lokasi, jumlah uang, skor, status transaksi, atau bukti kerja. Semua nilai tersebut diverifikasi ulang oleh backend.

- Jangan menganggap route guard frontend sebagai proteksi keamanan.
- Jangan mengirim NIK, token, atau PII ke log, analytics, URL, atau error tracker.
- Jangan menampilkan data yang tidak diperlukan oleh role pengguna.
- Jangan mengizinkan client menentukan `userId`, `approvedBy`, `grossAmount`, `creditScore`, atau status final pada operasi mutasi.
- Jangan menggunakan `dangerouslySetInnerHTML` tanpa sanitasi dan alasan yang terdokumentasi.
- Jangan menaruh secret, private key, atau service credential dalam `NEXT_PUBLIC_*`.

### 4.2 Session dan token

Kontrak backend saat ini:

- Access token JWT diterima dari response login dan idealnya hanya disimpan di memory.
- Refresh token opaque disimpan backend melalui HttpOnly cookie `jejaring_pringsewu` dengan `sameSite=strict`, `secure` pada production, dan path `/api/v1/auth`.
- Request API memakai `credentials: include`/`withCredentials: true`.
- Refresh token tidak boleh dibaca JavaScript atau disimpan di localStorage.

Implementasi aktual yang masih menggunakan localStorage adalah technical debt prioritas. Saat mengerjakan auth, migrasikan token dari localStorage ke memory tanpa menghapus dukungan demo secara tidak sengaja. Demo/mock mode harus terisolasi, diberi indikator jelas, tidak aktif pada production, dan tidak diperlakukan sebagai autentikasi nyata.

### 4.3 Data sensitif dan upload

- Jangan menyimpan NIK mentah pada browser storage.
- Selfie PoW hanya dikirim dari kamera langsung ketika capability browser dan kebijakan backend terpenuhi; galeri tidak dianggap bukti kamera.
- Watermark client adalah bukti tampilan, bukan sumber kebenaran. Backend memvalidasi hash, radius GPS, timestamp server, dan transaction token.
- Jangan membuat preview atau cache foto bukti lebih lama dari kebutuhan.
- Validasi MIME, ukuran, dan tipe file di client untuk UX; backend tetap melakukan validasi keamanan.

## 5. Middleware, Interceptor, dan Boundary

### Frontend boundary

- `src/lib/api-client.ts`: base URL, credentials, Authorization dari memory, envelope normalization, refresh sekali, dan mapping error.
- `src/context/auth-context.tsx`: lifecycle sesi dan user profile; jangan menjadi tempat semua business state.
- `DashboardLayout`/route layout: UX redirect dan role-aware navigation saja.
- `ErrorBoundary` dan route error: fallback UI tanpa membocorkan stack trace.
- Next.js middleware, bila ditambahkan, hanya untuk pemeriksaan ringan berbasis cookie/routing; tidak memverifikasi JWT atau menggantikan guard backend.

### Backend middleware yang harus dihormati frontend

Backend memiliki CORS strict, Helmet, global `ValidationPipe`, throttling multi-tier, JWT guard, role guard, idempotency guard, standard transform interceptor, dan `AllExceptionsFilter`. Frontend harus:

- Mengirim origin dan credentials sesuai konfigurasi CORS.
- Menghormati status `401`, `403`, `409`, `422`, dan `429` tanpa mengubah maknanya.
- Tidak melakukan retry otomatis untuk mutasi finansial atau error concurrency.
- Menampilkan error `ERR_CONCURRENCY_LOCK`, `ERR_RATE_LIMIT_EXCEEDED`, `ERR_SELFIE_INTEGRITY_MISMATCH`, dan error domain lain secara terarah.

## 6. Role dan Batas Akses

| Role backend | Akses web utama |
|---|---|
| `ADMIN_BUMDES` | Operasional Pekon, calon kredit, pencairan, paket gizi, audit wilayahnya |
| `ADMIN_BAPPERIDA` | Analitik lintas Pekon, agregasi, monitoring program |
| `SUPER_ADMIN` | Administrasi platform terbatas dan audit global |
| `WARGA` / `UMKM` / `PENGUMPUL_JUJUR` | Portal warga/fitur domain sesuai izin backend |

Role berasal dari session backend. Sidebar boleh menyembunyikan menu yang tidak relevan, tetapi setiap endpoint dan halaman sensitif harus tetap ditolak oleh backend.

## 7. Agent Workflow

1. **Plan:** tulis tujuan, persona, route, endpoint, role, state loading/error, dan risiko keamanan.
2. **Locate:** cari route, feature, komponen, hook, API client, dan type yang benar. Jangan scan seluruh repository.
3. **Contract check:** cocokkan endpoint, DTO, envelope, error code, enum, dan role dengan dokumen backend/schema.
4. **Implement:** buat tipe dan API hook, lalu UI; gunakan token desain dan komponen reusable.
5. **Secure:** periksa PII, token storage, role boundary, XSS, CSRF/credentials, idempotency, dan kebocoran error.
6. **Accessible:** keyboard, focus, label, screen reader, contrast, responsive, dan reduced motion.
7. **Validate:** jalankan pemeriksaan TypeScript/build/lint yang tersedia dan uji route utama secara manual bila memungkinkan.
8. **Document:** perbarui dokumen teknis bila kontrak, status implementasi, atau keputusan desain berubah.

## 8. Definition of Done

- Tidak ada TypeScript error pada area yang diubah.
- API envelope dan error code backend ditangani.
- Tidak ada secret/PII/token yang disimpan atau dilog secara tidak aman.
- Loading, empty, error, retry, dan success state tersedia.
- Role, accessibility, responsive, dan low-bandwidth behavior diperiksa.
- Test/build/lint yang relevan dijalankan atau alasan kegagalannya dicatat.
- Perubahan dokumentasi dan technical debt yang relevan diperbarui.

## 9. Cross-reference

- `FrontendWebTechnicalDocument.md` — acuan kebutuhan, arsitektur, roadmap, dan kontrak UI.
- `DesignToken.md` — sumber kebenaran visual.
- `../Backend/BackendTechnicalDocument.md` — endpoint, DTO, error, middleware, dan auth.
- `../ArchitectureTechnicalDocument.md` — model domain, zero-trust, transaksi atomic, dan skoring.
- `../AGENTS.md` — aturan monorepo tingkat root.
