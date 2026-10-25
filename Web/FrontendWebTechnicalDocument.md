# Technical Specification & Architecture Document (TSD)
# Frontend Web — JEJARING-SEWU (SINERGI-PEKON)

> **Status dokumen:** Acuan pengembangan frontend web bertahap  
> **Versi:** 3.0.0  
> **Tanggal pembaruan:** 2026-10-23  
> **Produk:** Inovasi Kompas Iptek Pringsewu  
> **Subproject:** `Web/`

---

## 1. Tujuan dan Posisi Produk

JEJARING-SEWU adalah platform ekonomi sirkular berbasis Pekon yang menghubungkan aktivitas warga, BUMDes, dan pemerintah daerah melalui:

1. Bursa hasil bumi dan referral pengepul jujur.
2. Nebeng-Jastip searah berbasis rute.
3. Bursa Mini-Job inklusif dengan prinsip zero-discrimination.
4. Transaksi terpadu dan Selfie Proof-of-Work (PoW).
5. Skor kredit alternatif AHP-TOPSIS (`S_kredit`) dan rekomendasi modal BUMDes.
6. Penukaran poin untuk paket gizi lokal/stunting.

Backend NestJS telah menjadi sumber kebenaran untuk identitas, role, status transaksi, saldo, bukti PoW, skor, dan aturan bisnis. Frontend web menyediakan presentasi, navigasi, input, visualisasi, dan pengalaman kerja yang aman; frontend tidak boleh menjadi sumber kebenaran domain.

### 1.1 Fokus pengembangan saat ini

Prioritas saat ini adalah **dashboard web authority**:

- `ADMIN_BUMDES`: operasi dan keputusan di tingkat Pekon.
- `ADMIN_BAPPERIDA`: pemantauan dan analitik lintas Pekon.
- `SUPER_ADMIN`: administrasi dan audit terbatas.

Portal warga/PWA disiapkan sebagai fase lanjutan. Aplikasi mobile tetap menjadi client utama untuk pengalaman kamera, geolocation, dan offline-first yang lebih lengkap.

### 1.2 Status implementasi

| Area | Status saat ini | Target acuan |
|---|---|---|
| Next.js App Router, TypeScript, Tailwind | Berjalan | Dipertahankan |
| Landing page dan login | Berjalan | Selaraskan dengan auth API produksi |
| Dashboard layout, sidebar, topbar | Berjalan | Tambahkan role/permission yang konsisten |
| Peta Pekon | Berjalan dengan data/mock | Sambungkan endpoint agregasi dan layer resmi |
| Data dashboard | Sebagian mock | Migrasi bertahap ke API NestJS |
| Auth | Login API + demo fallback; token masih localStorage | Access token memory dan refresh HttpOnly cookie |
| React Query/Zustand/RHF/Zod/shadcn | Direncanakan, belum seluruhnya terpasang | Tambahkan hanya saat kebutuhan nyata muncul |
| Portal warga/PWA | Belum menjadi fokus | Fase berikutnya |
| Selfie PoW web | Belum menjadi fitur produksi | Hanya setelah kontrak upload/verifikasi backend final |

Status ini penting agar agent tidak menganggap rancangan target sebagai fitur yang sudah tersedia.

---

## 2. Tech Stack dan Prinsip Arsitektur

| Layer | Teknologi | Aturan |
|---|---|---|
| Framework | Next.js 14 App Router | Server Components sebagai default |
| Bahasa | TypeScript strict | Tipe response harus mengikuti kontrak backend |
| UI | Tailwind CSS 3, komponen reusable | Token visual berasal dari `DesignToken.md` |
| Ikon | `lucide-react` | Ikon dekoratif diberi label bila interaktif |
| HTTP | Axios melalui `src/lib/api-client.ts` | `withCredentials: true`, envelope terpusat |
| Peta | Leaflet/React-Leaflet | Client-only bila membutuhkan `window` |
| Grafik | Recharts | Sediakan ringkasan data non-grafis |
| Form | Native/utility saat ini; React Hook Form + Zod sebagai target | Jangan menambah dependency tanpa kebutuhan |
| State | Context saat ini; query cache sebagai target | Hindari global state untuk state lokal halaman |
| Backend | NestJS `/api/v1` | Frontend mengikuti DTO, role, status, error code |

### 2.1 API base URL

```ts
const API_BASE_URL =
default: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
```

Nilai production wajib berasal dari environment deployment. Jangan menaruh URL internal, secret, atau credential di source code.

### 2.2 Standard response envelope

Backend mengembalikan:

```ts
export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
}
```

API client boleh meng-unbox `data`, tetapi tipe dan error mapping harus tetap mempertahankan `statusCode`, `message`, dan `errorCode` bila tersedia. Semua halaman harus memiliki state `loading`, `empty`, `error`, `retry`, dan `success`.

---

## 3. Struktur Direktori Frontend

```text
Web/
├── public/
│   ├── icons/                         # Ikon PWA/brand
│   └── markers/                       # Marker peta bila dibutuhkan
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root metadata, AuthProvider, global CSS
│   │   ├── page.tsx                   # Landing page
│   │   ├── login/page.tsx              # Login authority
│   │   ├── (authority)/                # Target route group dashboard
│   │   │   ├── bumdes/
│   │   │   └── bapperida/
│   │   ├── (citizen)/                  # Target portal warga/PWA
│   │   └── api/                        # BFF hanya bila ada kebutuhan keamanan/SSR
│   ├── components/
│   │   ├── ui/                        # Button, Card, Input, Dialog, Table, Badge
│   │   ├── layout/                    # DashboardLayout, Sidebar, Topbar
│   │   ├── map/                       # PekonMap dan layer geospasial
│   │   └── shared/                    # Error, loading, empty, accessibility
│   ├── context/                       # Auth lifecycle dan context minimal
│   ├── features/                      # Modul domain frontend per fitur
│   │   ├── auth/
│   │   ├── users-wallet/
│   │   ├── harvest-bursa/
│   │   ├── commuter-jastip/
│   │   ├── mini-job/
│   │   ├── transaction-pow/
│   │   ├── credit-scoring/
│   │   └── nutrition-stunting/
│   ├── hooks/                         # Hook data, geolocation, responsive, session
│   ├── lib/
│   │   ├── api-client.ts              # Axios, credentials, refresh, error mapping
│   │   ├── utils.ts                   # cn dan formatter umum
│   │   └── geo-watermark.ts            # Target: watermark sebelum upload PoW
│   └── types/                          # User, role, DTO response, enum status
├── AGENTS.md
├── FrontendWebTechnicalDocument.md
├── DesignToken.md
├── package.json
└── tailwind.config.js
```

Feature baru tidak boleh langsung menumpuk di `components/` atau `page.tsx`. Komponen generik masuk `components/ui`/`shared`; komponen domain masuk `features/<feature>`.

---

## 4. Persona, Role, dan Ruang Lingkup Halaman

### 4.1 Dashboard BUMDes

- Overview Pekon: transaksi, aktivitas warga, hasil bumi, mini-job, dan indikator gizi.
- Credit scoring: daftar rekomendasi Grade A/B/C, detail lima komponen skor, dan status review.
- Disbursement: proses persetujuan/pencairan sesuai role dan API backend.
- Stunting packages: stok, paket, penukaran, dan audit.
- Wallet/ledger: tampilan read-only atau operasi yang memang disediakan endpoint.

### 4.2 Dashboard BAPPERIDA

- Peta agregasi lintas Pekon.
- Tren hasil bumi, jastip, mini-job, inklusi, dan stunting.
- Perbandingan Pekon dan ringkasan program.
- Audit aktivitas tanpa menampilkan PII yang tidak dibutuhkan.

### 4.3 Portal warga/PWA (fase lanjutan)

- Informasi dan status bursa.
- Status order dan transaksi.
- Mini-job inklusif dengan badge vulnerability yang aman.
- Profil skor dan poin.
- PoW web hanya jika device capability, permission, dan endpoint backend mendukung.

### 4.4 Role enforcement

Role yang digunakan mengikuti backend:

```ts
type UserRole =
  | "WARGA"
  | "PENGUMPUL_JUJUR"
  | "UMKM"
  | "ADMIN_BUMDES"
  | "ADMIN_BAPPERIDA"
  | "SUPER_ADMIN";
```

Role-aware navigation meningkatkan UX, tetapi bukan kontrol keamanan. Backend tetap memvalidasi JWT, role, ownership, Pekon scope, dan permission setiap request.

---

## 5. Authentication dan Zero-Trust Session

### 5.1 Kontrak login

Login menerima identifier nomor HP/WhatsApp atau email, password, dan `deviceId`. Response berisi access token, informasi expiry, dan user profile sesuai kontrak backend.

Refresh token backend:

- Opaque token.
- Cookie HttpOnly bernama `jejaring_pringsewu`.
- `sameSite=strict`, `secure` saat production, path `/api/v1/auth`.
- Rotasi dan reuse detection dilakukan backend melalui `UserSession`.

### 5.2 Aturan implementasi frontend

1. Simpan access token hanya di memory untuk target production.
2. Selalu kirim `withCredentials: true` agar cookie refresh dikirim browser.
3. Saat menerima `401`, lakukan satu refresh request, ulangi request idempoten yang gagal, lalu arahkan ke login jika refresh gagal.
4. Jangan refresh secara rekursif dan jangan retry mutasi finansial tanpa idempotency.
5. Hapus token memory dan data user saat logout/session invalid.
6. Mock login hanya untuk development/demo terkontrol; jangan aktif di production.

> **Technical debt saat ini:** `src/context/auth-context.tsx` dan `src/lib/api-client.ts` masih membaca access token dari `localStorage`. Ini harus dimigrasikan sebelum deployment production karena localStorage dapat terbaca oleh JavaScript yang terkena XSS.

### 5.3 Error auth yang harus dipetakan

- `ERR_AUTH_INVALID_CREDENTIALS` → pesan kredensial tidak valid.
- `ERR_AUTH_TOKEN_EXPIRED` → jalankan refresh satu kali.
- `ERR_FORBIDDEN_ROLE_ACCESS` → halaman akses ditolak, bukan login ulang.
- `ERR_RATE_LIMIT_EXCEEDED` → tampilkan cooldown, jangan retry agresif.
- `ERR_OTP_INVALID_OR_EXPIRED` → ulangi alur OTP sesuai endpoint backend.

---

## 6. API Client, Middleware, dan Error Boundary

### 6.1 API client

`src/lib/api-client.ts` bertanggung jawab atas:

- Base URL dan header umum.
- Credentials cookie.
- Authorization dari access token memory.
- Unboxing envelope atau normalisasi response.
- Refresh satu kali saat access token expired.
- Mapping error ke `statusCode`, `errorCode`, dan `message`.

API client tidak boleh:

- Mengubah status bisnis backend.
- Menyimpan refresh token.
- Menyembunyikan error concurrency, validation, atau permission.
- Mencetak response yang berisi PII/token ke console.

### 6.2 Middleware boundary

Backend menerapkan Helmet, strict CORS, global `ValidationPipe`, throttling, JWT guard, RolesGuard, IdempotencyGuard, transform interceptor, dan `AllExceptionsFilter`. Frontend harus menghormati kontrak tersebut.

Next.js middleware, bila diperlukan, hanya menangani routing ringan dan UX. Ia tidak menggantikan guard backend atau menjadi satu-satunya validasi JWT.

### 6.3 Error UI

| Error | UX yang diharapkan |
|---|---|
| 400 validation | Tandai field/parameter yang salah |
| 401 auth | Refresh satu kali; jika gagal, minta login |
| 403 role | Tampilkan akses ditolak dan navigasi aman |
| 404 | Empty/not found state |
| 409 concurrency/duplicate | Minta refresh data; jangan mengulang mutasi otomatis |
| 422 PoW/NIK | Jelaskan syarat verifikasi tanpa membocorkan detail sensitif |
| 429 rate limit | Cooldown dan retry manual/terjadwal |
| 5xx/network | Retry aman untuk query dan tampilkan status layanan |

---

## 7. Modul Domain dan Kebutuhan UI

### 7.1 Users & Wallet

- Tampilkan saldo dan riwayat hanya dari API.
- Jangan menghitung saldo sebagai sumber kebenaran di client.
- Setiap mutasi wallet backend bersifat atomic dan memiliki ledger; UI menampilkan status pending/success/failure.
- PII/NIK ditampilkan masked dan hanya untuk role yang berwenang.

### 7.2 Harvest Bursa

- Listing, detail, bid/referral, status, dan ringkasan penyerapan.
- Filter Pekon, status, komoditas, dan periode.
- Jangan menampilkan data collector atau kontak di luar scope permission.

### 7.3 Commuter/Jastip

- Rute searah dan order dipresentasikan di peta/tabel alternatif.
- Koordinat harus diminimalkan sesuai kebutuhan; jangan menampilkan lokasi presisi kepada role yang tidak berwenang.
- Status order mengikuti enum backend, bukan string buatan UI.

### 7.4 Mini-Job inklusif

- Feed tugas, detail, status claim, dan vulnerability badge.
- Untuk `isDisabilityFriendly`, UI harus menjelaskan prioritas inklusi tanpa membuka PII.
- Auto-accept lock adalah keputusan backend. Client tidak boleh menyediakan kontrol penolakan yang bertentangan dengan status `LOCKED_BY_PRIORITY`.
- Konflik claim (`ERR_CONCURRENCY_LOCK`) harus meminta user memuat ulang data.

### 7.5 Transaction dan Selfie PoW

- Web camera memakai `navigator.mediaDevices` hanya dari secure context dan setelah consent.
- Foto diambil dari kamera langsung, bukan galeri, sesuai kebijakan backend.
- Watermark berisi koordinat, nama Pekon, waktu server/transaction context, dan ID transaksi sesuai kontrak; watermark client tidak menggantikan verifikasi server.
- Hash SHA-256 dihitung terhadap binary final setelah watermark.
- Backend tetap memeriksa `X-Image-Hash`, `isCameraDirect`, radius GPS, token transaksi, dan status transaksi.
- Berikan fallback yang jelas ke mobile ketika browser/device tidak memenuhi capability.

### 7.6 Credit scoring dan loan

Gunakan hasil backend untuk menampilkan:

```text
S_kredit = (0.20 × N_jastip)
         + (0.25 × N_minijob)
         + (0.20 × N_hasilbumi)
         + (0.20 × V_selfie)
         + (0.15 × I_inklusi)
```

Grade:

- `GRADE_A_LAYAK_MODAL` jika skor ≥ 85; rekomendasi plafon Rp1.500.000 tanpa agunan, menunggu BUMDes.
- `GRADE_B_PEMBINAAN` jika 70 ≤ skor < 85.
- `GRADE_C_AWAL` jika skor < 70.

UI tidak menghitung atau mengubah skor final. Chart harus memiliki tabel/teks alternatif dan label yang mudah dipahami.

### 7.7 Nutrition/Stunting

- Tampilkan paket, poin cost, stok, penukaran, dan status.
- Redemption adalah mutasi poin dan stok atomic di backend.
- Setelah conflict/stock depleted, refresh data dan tampilkan `ERR_STOCK_DEPLETED`.

---

## 8. Accessibility, Performance, dan Design Rules

### 8.1 Accessibility

- Target WCAG 2.1 AA.
- Keyboard navigation dan visible focus wajib.
- Semua tombol icon-only memiliki `aria-label`.
- Setiap form control memiliki label.
- Modal mengelola focus dan dapat ditutup dengan Escape.
- Status tidak hanya dibedakan melalui warna.
- Chart, map, dan data visual memiliki ringkasan non-visual.

### 8.2 Performance dan low bandwidth

- Server-render data yang tidak interaktif bila aman.
- Lazy-load peta, chart, kamera, dan modul berat.
- Hindari fetch berulang ketika data dapat di-cache.
- Kompres foto sebelum upload; batasi ukuran dan tampilkan