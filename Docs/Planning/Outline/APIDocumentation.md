# Dokumentasi Lengkap REST API JEJARING-SEWU (SINERGI-PEKON)
**Versi API:** `v1`  
**Basis URL:** `http://localhost:4000/api/v1` (Development) / `https://api.jejaringsewu.pringsewukab.go.id/api/v1` (Production)  
**Arsitektur:** NestJS Modular Monolith, PostgreSQL 16 (PostGIS), Redis 7, Zero-Trust Security.

---

## 1. Standar Global & Protokol Komunikasi

### A. Format Standard Response Envelope (Sukses)
Semua respons sukses dari server dibungkus dalam format standar seragam:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-10-21T06:15:03.741Z",
  "path": "/api/v1/nutrition/redeem"
}
```

### B. Format Standard Error Envelope (Gagal)
Semua kegagalan HTTP dan validasi ditangkap oleh `AllExceptionsFilter` dan mengembalikan format:
```json
{
  "success": false,
  "errorCode": "ERR_VALIDATION_FAILED",
  "message": "NIK wajib berupa 16 digit angka",
  "timestamp": "2026-10-21T06:03:25.256Z",
  "path": "/api/v1/auth/register"
}
```

### C. Katalog Kode Error Aplikasi (`errorCode`)
| Kode Error | HTTP Status | Penjelasan |
|---|---|---|
| `ERR_VALIDATION_FAILED` | `400` Bad Request | Masukan request tidak lolos aturan DTO `class-validator`. |
| `ERR_INSUFFICIENT_POINTS` | `400` Bad Request | Poin reputasi warga tidak mencukupi untuk penukaran paket gizi. |
| `ERR_INSUFFICIENT_FUNDS` | `400` Bad Request | Saldo kas mikro warga tidak mencukupi untuk penarikan/transaksi. |
| `ERR_OTP_INVALID_OR_EXPIRED`| `400` Bad Request | Kode OTP 6 digit salah, tidak ditemukan, atau kedaluwarsa (>5 menit). |
| `ERR_AUTH_INVALID_CREDENTIALS` | `401` Unauthorized | Nomor WhatsApp/Email atau kata sandi tidak cocok. |
| `ERR_AUTH_TOKEN_EXPIRED` | `401` Unauthorized | Access Token kedaluwarsa atau Refresh Token tidak valid / *Reuse Detected*. |
| `ERR_FORBIDDEN_ROLE_ACCESS` | `403` Forbidden | Peran (*Role*) pengguna tidak memiliki hak akses ke endpoint ini. |
| `ERR_RESOURCE_NOT_FOUND` | `404` Not Found | Data (User, Pekon, Job, Listing, Transaksi) tidak ditemukan di database. |
| `ERR_DUPLICATE_ENTRY` | `409` Conflict | Data unik (NIK, No WhatsApp, Email, Referral Code) sudah terdaftar. |
| `ERR_CONCURRENCY_LOCK` | `409` Conflict | Terjadi perebutan kunci baris (*Row Lock*) pada tugas atau transaksi. |
| `ERR_CONFLICT_STATE` | `409` Conflict | Status entitas tidak valid untuk aksi ini (misal bid pada listing terkunci). |
| `ERR_STOCK_DEPLETED` | `409` Conflict | Stok paket pangan bergizi di pekon telah habis (0). |
| `ERR_NIK_VERIFICATION_FAILED` | `422` Unprocessable | NIK fisik yang diinput BUMDes tidak cocok dengan hash NIK pendaftaran. |
| `ERR_SELFIE_INTEGRITY_MISMATCH`| `422` Unprocessable | Foto Selfie PoW bukan tangkapan kamera langsung (*isCameraDirect: false*). |
| `ERR_RATE_LIMIT_EXCEEDED` | `429` Too Many Requests| Melampaui batas rate limit (Anti-Spam OTP maks 3x/5 menit). |
| `ERR_INTERNAL_SERVER` | `500` Internal Server | Terjadi kesalahan fatal tak terduga pada server backend. |

### D. Header Global yang Didukung
- `Authorization: Bearer <accessToken>`: Wajib untuk semua endpoint non-public.
- `Cookie: jejaring_pringsewu=<refreshToken>`: HttpOnly Cookie untuk rotasi refresh token.
- `X-Idempotency-Key: <UUID>`: Wajib pada endpoint mutasi pembayaran / klaim agar kebal *network timeout*.
- `Content-Type: application/json`: Tipe konten payload standar.

---

## 2. Modul Autentikasi & Sesi Pengguna (`/api/v1/auth`)

### 2.1. Registrasi Akun Warga / Pengepul / UMKM
- **Endpoint:** `POST /api/v1/auth/register`
- **Autentikasi:** Public
- **Otorisasi:** Terbuka untuk umum
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `nik` | `string` | Wajib, Regex `^[0-9]{16}$` | NIK KTP warga (16 digit angka). |
  | `fullName` | `string` | Wajib, Min 3 karakter | Nama lengkap sesuai identitas. |
  | `phoneNumber`| `string` | Wajib, Regex format HP Indo | Nomor WhatsApp aktif warga. |
  | `email` | `string` | Opsional, Valid email format | Alamat email (opsional). |
  | `password` | `string` | Wajib, 8-64 char, huruf besar, kecil, angka/simbol | Kata sandi akun. |
  | `pekonId` | `string` | Wajib, UUID v4 | ID Pekon domisili warga. |
  | `vulnerabilityFlags` | `string[]`| Opsional, Enum `VulnerabilityStatus` | Nilai: `NONE`, `DISABILITAS_FISIK`, `LANSIA`, `PEKKA_IBU_RUMAH_TANGGA`, dll. |
- **Data yang Diambil / Response (201 Created):**
  ```json
  {
    "userId": "uuid-warga",
    "fullName": "Pak Slamet (Petani Singkong)",
    "phoneNumber": "081234567894",
    "message": "Registrasi berhasil. Kode OTP verifikasi dikirimkan ke perangkat Anda."
  }
  ```

---

### 2.2. Login Akun (Nomor WhatsApp / Email)
- **Endpoint:** `POST /api/v1/auth/login`
- **Autentikasi:** Public
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `identifier` | `string` | Wajib, string tidak kosong | Nomor WhatsApp atau Email terdaftar. |
  | `password` | `string` | Wajib, Min 8 karakter | Kata sandi akun. |
  | `deviceId` | `string` | Wajib, string | Identifier unik perangkat (Expo Device ID). |
- **Headers / Cookie Response:**
  - Mengeset Cookie `jejaring_pringsewu` (HttpOnly, Secure, SameSite=Strict, Path=/api/v1/auth, MaxAge=30 Hari).
- **Data yang Diambil / Response (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-warga",
      "fullName": "Pak Slamet (Petani Singkong)",
      "phoneNumber": "081234567894",
      "email": null,
      "role": "WARGA",
      "pekonId": "uuid-pekon",
      "vulnerabilityFlags": ["NONE"],
      "pointsBalance": "50",
      "cashBalance": "25000"
    }
  }
  ```

---

### 2.3. Login / Pendaftaran Instan Google OAuth2
- **Endpoint:** `POST /api/v1/auth/google`
- **Autentikasi:** Public
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `idToken` | `string` | Wajib, string | Token JWT dari Google Sign-In SDK. |
  | `deviceId` | `string` | Wajib, string | ID perangkat pengguna. |
  | `pekonId` | `string` | Wajib, UUID v4 | ID Pekon untuk pendaftaran baru. |
- **Data yang Diambil / Response (200 OK):** Mengembalikan `accessToken` dan objek `user` sama seperti login standar.

---

### 2.4. Kirim Ulang OTP via FCM Push
- **Endpoint:** `POST /api/v1/auth/otp/send`
- **Autentikasi:** Public
- **Rate Limit:** `@Throttle({ otp_strict: { limit: 3, ttl: 300000 } })` (Maks 3 req / 5 menit)
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `identifier` | `string` | Wajib, string | Nomor WhatsApp atau Email. |
  | `purpose` | `string` | Wajib, In: `['REGISTRATION', 'FORGOT_PASSWORD', 'VERIFY_ACTION']` | Tujuan pengiriman OTP. |
- **Response (200 OK):**
  ```json
  {
    "message": "Kode OTP telah berhasil dikirimkan via FCM Push Notification."
  }
  ```

---

### 2.5. Validasi Kode OTP
- **Endpoint:** `POST /api/v1/auth/otp/verify`
- **Autentikasi:** Public
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `identifier` | `string` | Wajib, string | Nomor WhatsApp atau Email pengguna. |
  | `otpCode` | `string` | Wajib, Regex `^[0-9]{6}$` | 6 digit angka kode OTP. |
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Verifikasi kode OTP berhasil."
  }
  ```

---

### 2.6. Permintaan Lupa Kata Sandi
- **Endpoint:** `POST /api/v1/auth/password/forgot`
- **Autentikasi:** Public
- **Rate Limit:** 3 request per 5 menit
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `identifier` | `string` | Wajib | Nomor WhatsApp atau Email akun yang lupa sandi. |
- **Response (200 OK):** Mengirimkan kode OTP ke perangkat dan mengembalikan notifikasi sukses.

---

### 2.7. Atur Ulang Kata Sandi dengan OTP
- **Endpoint:** `POST /api/v1/auth/password/reset`
- **Autentikasi:** Public
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `identifier` | `string` | Wajib | Nomor WhatsApp atau Email. |
  | `otpCode` | `string` | Wajib, 6 digit angka | Kode OTP pemulihan kata sandi. |
  | `newPassword`| `string` | Wajib, 8-64 char, kombinasi lengkap | Kata sandi baru. |
- **Response (200 OK):**
  ```json
  {
    "message": "Kata sandi berhasil diatur ulang. Semua sesi lama telah dicabut."
  }
  ```

---

### 2.8. Refresh Token Rotation
- **Endpoint:** `POST /api/v1/auth/refresh`
- **Autentikasi:** Membutuhkan Cookie `jejaring_pringsewu`
- **Fitur Khusus:** Deteksi Pencurian Token (*Reuse Detection*). Jika token lama terdeteksi dipakai ulang, seluruh sesi dalam `tokenFamily` langsung dibatalkan otomatis.
- **Response (200 OK):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### 2.9. Logout Pengguna
- **Endpoint:** `POST /api/v1/auth/logout`
- **Autentikasi:** Public (Membaca Cookie `jejaring_pringsewu` jika ada)
- **Response (200 OK):** Menghapus cookie `jejaring_pringsewu` di klien dan mencabut sesi di database.

---

## 3. Modul Profil Warga & Dompet Buku Besar (`/api/v1/users` & `/api/v1/wallets`)

### 3.1. Profil Pengguna Saya
- **Endpoint:** `GET /api/v1/users/me`
- **Autentikasi:** `Bearer <accessToken>`
- **Otorisasi:** Semua peran yang terautentikasi
- **Data yang Diambil / Response (200 OK):**
  ```json
  {
    "id": "uuid-warga",
    "fullName": "Pak Slamet (Petani Singkong)",
    "phoneNumber": "081234567894",
    "email": null,
    "role": "WARGA",
    "isNikVerified": true,
    "vulnerabilityFlags": ["NONE"],
    "hasToddler": false,
    "referralCode": "SLAMET-001",
    "isTrustedCollector": false,
    "pekon": {
      "id": "uuid-pekon",
      "namaPekon": "Pekon Pagelaran",
      "kecamatan": "Pagelaran"
    },
    "wallet": {
      "pointsBalance": "50",
      "cashBalance": "25000"
    },
    "createdAt": "2026-10-21T05:45:13.558Z"
  }
  ```

---

### 3.2. Perbarui Data Profil
- **Endpoint:** `PATCH /api/v1/users/me`
- **Autentikasi:** `Bearer <accessToken>`
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `fullName` | `string` | Opsional, Min 3 char | Nama lengkap baru. |
  | `email` | `string` | Opsional, format email | Alamat email baru. |
  | `vulnerabilityFlags` | `string[]`| Opsional, Enum array | Status kerentanan terkini. |
  | `hasToddler` | `boolean`| Opsional, boolean | Status memiliki anak balita (filter gizi). |
- **Response (200 OK):** Mengembalikan data profil yang telah diperbarui.

---

### 3.3. Verifikasi NIK Warga oleh Admin BUMDes
- **Endpoint:** `POST /api/v1/users/verify-nik`
- **Autentikasi:** `Bearer <accessToken>`
- **Otorisasi:** Hanya `ADMIN_BUMDES` dan `SUPER_ADMIN` (`@Roles`)
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `userId` | `string` | Wajib, UUID v4 | ID pengguna warga yang akan diverifikasi. |
  | `nikInput`| `string` | Wajib, Regex `^[0-9]{16}$` | NIK fisik KTP asli yang diperiksa admin. |
  | `notes` | `string` | Opsional, string | Catatan verifikasi fisik BUMDes. |
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "userId": "uuid-warga",
    "isNikVerified": true,
    "message": "Identitas NIK warga berhasil diverifikasi oleh Admin BUMDes."
  }
  ```

---

### 3.4. Pembaruan Token FCM Perangkat
- **Endpoint:** `PATCH /api/v1/users/me/fcm-token`
- **Autentikasi:** `Bearer <accessToken>`
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `fcmToken` | `string` | Wajib, string | Token registrasi FCM dari perangkat Android. |
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "FCM Token berhasil diperbarui."
  }
  ```

---

### 3.5. Saldo & 20 Riwayat Mutasi Buku Besar Terkini
- **Endpoint:** `GET /api/v1/wallets/me`
- **Autentikasi:** `Bearer <accessToken>`
- **Data yang Diambil / Response (200 OK):**
  ```json
  {
    "walletId": "uuid-wallet",
    "pointsBalance": "30",
    "cashBalance": "25000",
    "recentLedgerEntries": [
      {
        "id": "uuid-ledger-entry",
        "transactionId": "uuid-unified-tx",
        "entryType": "DEBIT",
        "currency": "POINTS",
        "amount": "20",
        "balanceBefore": "50",
        "balanceAfter": "30",
        "createdAt": "2026-10-21T06:15:03.729Z",
        "isIntegrityValid": true
      }
    ]
  }
  ```
  *(Catatan: `isIntegrityValid` bernilai `true` jika tanda tangan kriptografi HMAC-SHA256 pada baris buku besar valid dan tidak mengalami manipulasi).*

---

## 4. Modul Bursa Hasil Bumi & Referral Pengepul (`/api/v1/harvests`)

### 4.1. Petani Memasang Komoditas Panen
- **Endpoint:** `POST /api/v1/harvests/listings`
- **Autentikasi:** `Bearer <accessToken>`
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `commodityName` | `string` | Wajib, string | Nama komoditas (Singkong, Kakao, Pisang, dll.). |
  | `estimatedKg` | `number` | Wajib, Min 1 | Estimasi berat panen (dalam satuan Kg). |
  | `minPricePerKg`| `number` | Wajib, Min 100 | Harga penawaran minimal per Kg (Rupiah). |
- **Response (201 Created):** Mengembalikan entitas `HarvestListing` dengan status `OPEN_BIDDING`.

---

### 4.2. Katalog Komoditas Panen Terbuka
- **Endpoint:** `GET /api/v1/harvests/listings`
- **Autentikasi:** `Bearer <accessToken>`
- **Query Parameters:**
  - `pekonId` (opsional): Filter berdasarkan wilayah Pekon.
  - `commodityName` (opsional): Pencarian nama komoditas (case-insensitive).
  - `status` (opsional, default: `OPEN_BIDDING`).
- **Data yang Diambil / Response (200 OK):** Daftar hasil panen lengkap beserta identitas petani pemilik dan 5 penawaran harga tertinggi dari pengepul.

---

### 4.3. Pengepul Mengajukan Penawaran Harga
- **Endpoint:** `POST /api/v1/harvests/listings/:id/bids`
- **Autentikasi:** `Bearer <accessToken>`
- **URL Parameter:** `id` (UUID Listing Panen)
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `offeredPricePerKg` | `number` | Wajib, Min 100 | Harga yang ditawarkan per Kg (Rupiah). |
  | `referralUsedCode` | `string` | Opsional, string | Kode referral pengepul jujur (jika ada). |
- **Response (201 Created):** Rekam data `HarvestBid`.

---

### 4.4. Petani Menyetujui Tawaran Pengepul (Deal Lock)
- **Endpoint:** `POST /api/v1/harvests/bids/:bidId/accept`
- **Autentikasi:** `Bearer <accessToken>`
- **Headers:** `X-Idempotency-Key: <UUID>` (Opsional/Disarankan)
- **URL Parameter:** `bidId` (UUID Penawaran)
- **Karakteristik Keamanan:** Transaksi Serializable atomik. Mengunci listing menjadi `DEAL_LOCKED` dan menerbitkan `UnifiedTransaction` (`AWAITING_SELFIE_POW`).
- **Response (200 OK):**
  ```json
  {
    "transactionId": "uuid-tx",
    "transactionToken": "txId.nonce.hmacSignature",
    "status": "AWAITING_SELFIE_POW",
    "grossAmount": "2500000",
    "message": "Kesepakatan harga berhasil dikunci. Silakan lanjutkan verifikasi fisik timbangan & Selfie PoW."
  }
  ```

---

### 4.5. Direktori Pengepul Jujur Terpercaya Pekon
- **Endpoint:** `GET /api/v1/harvests/collectors/trusted`
- **Autentikasi:** `Bearer <accessToken>`
- **Query Parameters:** `pekonId` (opsional)
- **Data yang Diambil / Response (200 OK):** Daftar profil pengepul dengan badge `isTrustedCollector: true` beserta jumlah akumulasi transaksi panen sukses.

---

## 5. Modul Nebeng-Jastip Searah (`/api/v1/commuters`)

### 5.1. Komuter Memulai Rute Perjalanan
- **Endpoint:** `POST /api/v1/commuters/routes/start`
- **Autentikasi:** `Bearer <accessToken>`
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `originName` | `string` | Wajib | Nama lokasi asal (misal: Pekon Pagelaran Utara). |
  | `destinationName`| `string` | Wajib | Nama lokasi tujuan (misal: Pasar Pringsewu). |
  | `originLat` | `number` | Wajib, -90 s.d 90 | Koordinat Latitude Asal. |
  | `originLng` | `number` | Wajib, -180 s.d 180 | Koordinat Longitude Asal. |
  | `destLat` | `number` | Wajib, -90 s.d 90 | Koordinat Latitude Tujuan. |
  | `destLng` | `number` | Wajib, -180 s.d 180 | Koordinat Longitude Tujuan. |
- **Response (201 Created):** Entitas `CommuterRoute` aktif (`isActive = true`).

---

### 5.2. Ping Koordinat GPS Terkini Komuter
- **Endpoint:** `PATCH /api/v1/commuters/routes/:id/ping`
- **Autentikasi:** `Bearer <accessToken>`
- **URL Parameter:** `id` (UUID Rute Komuter)
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `currentLat` | `number` | Wajib, -90 s.d 90 | Posisi Latitude real-time kurir/komuter. |
  | `currentLng` | `number` | Wajib, -180 s.d 180 | Posisi Longitude real-time kurir/komuter. |
- **Response (200 OK):** Memperbarui `currentLat` dan `currentLng` rute.

---

### 5.3. Pencarian Rute Komuter Terdekat (Spatial PostGIS)
- **Endpoint:** `GET /api/v1/commuters/routes/nearby`
- **Autentikasi:** `Bearer <accessToken>`
- **Query Parameters:**
  | Parameter | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `lat` | `number` | Wajib, -90 s.d 90 | Posisi Latitude warga pencari nebeng. |
  | `lng` | `number` | Wajib, -180 s.d 180 | Posisi Longitude warga pencari nebeng. |
  | `radiusKm` | `number` | Opsional, 0.5 s.d 50 (default: 5) | Radius pencarian dalam satuan Kilometer. |
- **Karakteristik Query:** Menggunakan kueri PostGIS berkecepatan tinggi `ST_DWithin` dan `ST_Distance` (SRID 4326).
- **Data yang Diambil / Response (200 OK):** Array rute komuter aktif yang sedang melintas dalam radius tersebut lengkap dengan jarak (`distance_meters`).

---

### 5.4. Warga Menitip Barang pada Rute Komuter
- **Endpoint:** `POST /api/v1/commuters/routes/:id/orders`
- **Autentikasi:** `Bearer <accessToken>`
- **URL Parameter:** `id` (UUID Rute Komuter)
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `itemDescription` | `string` | Wajib | Deskripsi barang (misal: Obat Warung, Dokumen). |
  | `fuelShareCost` | `number` | Wajib, Min 1000 | Ongkos patungan bensin (Rupiah). |
  | `pickupLat` | `number` | Wajib | Titik koordinat jemput barang. |
  | `pickupLng` | `number` | Wajib | Titik koordinat jemput barang. |
- **Response (201 Created):** Rekam data `JastipOrder` dengan status `REQUESTED`.

---

### 5.5. Komuter Menerima Titipan Barang
- **Endpoint:** `PATCH /api/v1/commuters/orders/:id/accept`
- **Autentikasi:** `Bearer <accessToken>`
- **URL Parameter:** `id` (UUID JastipOrder)
- **Headers:** `X-Idempotency-Key: <UUID>` (Opsional)
- **Response (200 OK):** Mengubah status order menjadi `ACCEPTED` dan menerbitkan `UnifiedTransaction` bertipe `NEBENG_JASTIP` (`LOCKED_ASSIGNED`).

---

## 6. Modul Mini-Job Inklusif Zero-Discrimination (`/api/v1/mini-jobs`)

### 6.1. Pasang Lowongan Pekerjaan Harian
- **Endpoint:** `POST /api/v1/mini-jobs`
- **Autentikasi:** `Bearer <accessToken>`
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `title` | `string` | Wajib | Judul tugas (misal: Kupas Singkong 50kg). |
  | `description` | `string` | Wajib | Rincian pekerjaan dan lokasi kerja. |
  | `wageAmount` | `number` | Wajib, Min 5000 | Upah tunai tugas (minimal Rp 5.000). |
  | `isDisabilityFriendly`| `boolean`| Opsional (default: false)| Penanda khusus ramah disabilitas / lansia. |
- **Response (201 Created):** Entitas `MiniJob` dengan status `OPEN`.

---

### 6.2. Katalog Lowongan Kerja Mini-Job Aktif
- **Endpoint:** `GET /api/v1/mini-jobs`
- **Autentikasi:** `Bearer <accessToken>`
- **Query Parameters:**
  - `status` (opsional, default: `OPEN`)
  - `isDisabilityFriendly` (opsional, boolean: `true` / `false`)
- **Data yang Diambil / Response (200 OK):** Daftar tugas aktif beserta reputasi serap tenaga kerja inklusi majikan (`employerInclusionCount`).

---

### 6.3. Klaim Tugas Mini-Job (Atomic Auto-Accept Lock)
- **Endpoint:** `POST /api/v1/mini-jobs/:id/claim`
- **Autentikasi:** `Bearer <accessToken>`
- **URL Parameter:** `id` (UUID MiniJob)
- **Headers:** `X-Idempotency-Key: <UUID>` (Opsional)
- **Mekanisme Khusus:**
  - Penguncian baris `SELECT ... FOR UPDATE NOWAIT` (Anti-Race Condition).
  - Jika `isDisabilityFriendly: true`, sistem memeriksa `vulnerabilityFlags` pekerja. Jika non-prioritas, ditolak (403).
  - Jika pekerja prioritas mengklaim, tugas terkunci permanen (`LOCKED_BY_PRIORITY`) dengan `autoAcceptLock: true`. Pemberi kerja tidak memiliki hak menolak.
  - Akumulasi serap naker disabilitas pada akun majikan bertambah otomatis.
- **Response (200 OK):**
  ```json
  {
    "job": {
      "id": "uuid-job",
      "status": "LOCKED_BY_PRIORITY",
      "autoAcceptLock": true,
      "workerId": "uuid-worker"
    },
    "transactionId": "uuid-tx",
    "transactionToken": "mocked.minijob.token",
    "status": "LOCKED_ASSIGNED",
    "message": "Tugas mini-job berhasil diklaim secara otomatis (Auto-Accept Lock aktif)."
  }
  ```

---

## 7. Modul Unified Transaction & Selfie Proof-of-Work (`/api/v1/transactions`)

### 7.1. Riwayat Transaksi Terpadu Saya
- **Endpoint:** `GET /api/v1/transactions/me`
- **Autentikasi:** `Bearer <accessToken>`
- **Query Parameters:**
  - `type` (opsional): `HARVEST_DEAL`, `NEBENG_JASTIP`, `MINI_JOB`, `NUTRITION_REDEEM`.
  - `status` (opsional): `INITIATED`, `LOCKED_ASSIGNED`, `AWAITING_SELFIE_POW`, `VERIFIED_COMPLETED`.
- **Data yang Diambil / Response (200 OK):** Riwayat transaksi terpadu lengkap dengan data pihak lawan transaksi dan metadata bukti Selfie PoW jika ada.

---

### 7.2. Ambil One-Time Transaction Token
- **Endpoint:** `GET /api/v1/transactions/:id/token`
- **Autentikasi:** `Bearer <accessToken>`
- **URL Parameter:** `id` (UUID Transaksi)
- **Fungsi:** Mengambil token kriptografi bertanda tangan HMAC untuk pertukaran fisik antarpengguna di lokasi.
- **Response (200 OK):**
  ```json
  {
    "transactionId": "uuid-tx",
    "transactionToken": "txId.nonce.hmacSignature",
    "status": "AWAITING_SELFIE_POW",
    "type": "HARVEST_DEAL",
    "grossAmount": "2500000"
  }
  ```

---

### 7.3. Unggah Selfie Proof-of-Work (Eksekusi 5 Langkah Atomik)
- **Endpoint:** `POST /api/v1/transactions/:id/selfie-pow`
- **Autentikasi:** `Bearer <accessToken>`
- **URL Parameter:** `id` (UUID Transaksi)
- **Headers Wajib:** `Content-Type: application/json`
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `imageStorageUrl` | `string` | Wajib, valid URL | URL foto selfie ber-watermark di Cloudflare R2. |
  | `imageSha256Hash` | `string` | Wajib, Regex 64 hex char | Checksum SHA-256 berkas foto asli. |
  | `gpsLatitude` | `number` | Wajib, -90 s.d 90 | Koordinat Latitude saat pengambilan foto. |
  | `gpsLongitude` | `number` | Wajib, -180 s.d 180 | Koordinat Longitude saat pengambilan foto. |
  | `gpsAccuracyMeters`| `number` | Wajib, Min 0 | Akurasi sinyal GPS perangkat (dalam meter). |
  | `pekonNameOverlay` | `string` | Wajib, string | Nama Pekon yang tercetak pada watermark foto. |
  | `isCameraDirect` | `boolean` | Wajib, HARUS `true` | Validasi tangkapan kamera langsung (*bukan galeri*). |
- **5 Proses Database Atomik Otomatis:**
  1. Simpan metadata `SelfieProofOfWork`.
  2. Perbarui transaksi menjadi `VERIFIED_COMPLETED`.
  3. Mutasi saldo dompet via double-entry buku besar (`Wallet` + `LedgerEntry`).
  4. Hitung skor kredit alternatif SPK AHP-TOPSIS ($S_{kredit}$) secara real-time.
  5. Jika $S_{kredit} \ge 85$, terbitkan `LoanRecommendation` modal tanpa agunan Rp 1.500.000 dan jadwalkan notifikasi FCM di `OutboxEvent`.
- **Data yang Diambil / Response (200 OK):**
  ```json
  {
    "transactionId": "uuid-tx",
    "status": "VERIFIED_COMPLETED",
    "creditScore": {
      "totalSkredit": "92.5",
      "grade": "GRADE_A_LAYAK_MODAL"
    },
    "loanRecommendation": {
      "id": "uuid-loan-rec",
      "plafond": "1500000",
      "status": "ELIGIBLE_WAITING_BUMDES"
    },
    "message": "Verifikasi Selfie PoW berhasil. Saldo dompet dan skor kredit telah diperbarui."
  }
  ```

---

## 8. Modul Skor Kredit Alternatif SPK AHP-TOPSIS (`/api/v1/credit-scoring`)

### 8.1. Skor Kredit Terkini Saya
- **Endpoint:** `GET /api/v1/credit-scoring/me`
- **Autentikasi:** `Bearer <accessToken>`
- **Data yang Diambil / Response (200 OK):**
  ```json
  {
    "currentScore": "92.5",
    "grade": "GRADE_A_LAYAK_MODAL",
    "breakdown": {
      "jastipScore": "80",
      "minijobScore": "100",
      "hasilbumiScore": "90",
      "selfieScore": "100",
      "inklusiScore": "100",
      "calculatedAt": "2026-10-21T06:15:03.741Z"
    },
    "loanRecommendation": {
      "id": "uuid-loan",
      "recommendedPlafond": "1500000",
      "status": "ELIGIBLE_WAITING_BUMDES",
      "createdAt": "2026-10-21T06:15:03.741Z",
      "approvedAt": null
    }
  }
  ```

---

### 8.2. Daftar Skor Warga per Pekon (BUMDes & BAPPERIDA)
- **Endpoint:** `GET /api/v1/credit-scoring/pekon/:pekonId`
- **Autentikasi:** `Bearer <accessToken>`
- **Otorisasi:** `ADMIN_BUMDES`, `ADMIN_BAPPERIDA`, `SUPER_ADMIN` (`@Roles`)
- **URL Parameter:** `pekonId` (UUID Pekon)
- **Data yang Diambil / Response (200 OK):** Daftar seluruh warga di pekon tersebut lengkap dengan status inklusi, snapshot skor kredit terbaru, dan status rekomendasi pinjaman modal.

---

### 8.3. Daftar Calon Penerima Modal yang Memenuhi Syarat
- **Endpoint:** `GET /api/v1/credit-scoring/loans/eligible`
- **Autentikasi:** `Bearer <accessToken>`
- **Otorisasi:** `ADMIN_BUMDES`, `SUPER_ADMIN` (`@Roles`)
- **Query Parameters:** `pekonId` (opsional)
- **Data yang Diambil / Response (200 OK):** Daftar warga berpredikat `GRADE_A_LAYAK_MODAL` yang menunggu persetujuan pencairan modal kerja dari BUMDes.

---

### 8.4. Persetujuan Pencairan Modal oleh BUMDes
- **Endpoint:** `PATCH /api/v1/credit-scoring/loans/:id/approve`
- **Autentikasi:** `Bearer <accessToken>`
- **Otorisasi:** `ADMIN_BUMDES`, `SUPER_ADMIN` (`@Roles`)
- **URL Parameter:** `id` (UUID Rekomendasi Pinjaman)
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `approvedPlafond`| `number` | Opsional, Min 500000 | Penyesuaian plafon yang disetujui (minimal Rp 500.000). |
  | `notes` | `string` | Opsional | Catatan persetujuan pengurus BUMDes. |
- **Response (200 OK):**
  ```json
  {
    "loanId": "uuid-loan",
    "status": "APPROVED",
    "approvedPlafond": "1500000",
    "message": "Pinjaman modal tanpa agunan BUMDes berhasil disetujui."
  }
  ```

---

## 9. Modul Intervensi Gizi & Penanganan Stunting (`/api/v1/nutrition`)

### 9.1. Katalog Paket Pangan Bergizi Lokal
- **Endpoint:** `GET /api/v1/nutrition/packages`
- **Autentikasi:** `Bearer <accessToken>`
- **Query Parameters:** `pekonId` (opsional)
- **Data yang Diambil / Response (200 OK):**
  ```json
  [
    {
      "id": "uuid-package",
      "pekonId": "uuid-pekon",
      "packageName": "Paket Gizi Stunting A: Telur Bebek Lokal (10 Butir) + Lele Segar (1 Kg)",
      "pointsCost": "25",
      "stockCount": 50,
      "pekon": {
        "id": "uuid-pekon",
        "namaPekon": "Pekon Pagelaran",
        "kecamatan": "Pagelaran"
      }
    }
  ]
  ```

---

### 9.2. Penukaran Poin ke Paket Gizi (Closed-Loop Circular Economy)
- **Endpoint:** `POST /api/v1/nutrition/redeem`
- **Autentikasi:** `Bearer <accessToken>`
- **Request Body (JSON):**
  | Field | Tipe | Validasi | Keterangan |
  |---|---|---|---|
  | `packageId` | `string` | Wajib, UUID v4 | ID paket pangan bergizi yang ditukar. |
- **Karakteristik Transaksi Atomik:**
  - Validasi stok (`stockCount > 0`). Jika habis: `409 ERR_STOCK_DEPLETED`.
  - Validasi saldo poin warga (`pointsBalance >= pointsCost`). Jika kurang: `400 ERR_INSUFFICIENT_POINTS`.
  - Mengurangi stok paket gizi (`decrement: 1`).
  - Menerbitkan `UnifiedTransaction` bertipe `NUTRITION_REDEEM`.
  - Mutasi debit poin pada dompet buku besar berpasangan secara OCC dengan tanda tangan HMAC-SHA256.
  - Mencatat riwayat penukaran di `NutritionRedemption`.
- **Data yang Diambil / Response (200 OK):**
  ```json
  {
    "redemptionId": "uuid-redemption",
    "packageName": "Paket Gizi Stunting C: Kacang Hijau + Gula Aren Murni Pringsewu",
    "pointsSpent": "20",
    "remainingPoints": "30",
    "message": "Paket pangan bergizi lokal berhasil ditukarkan. Silakan ambil paket di BUMDes/Posyandu Pekon."
  }
  ```

---

### 9.3. Riwayat Penukaran Paket Gizi Saya
- **Endpoint:** `GET /api/v1/nutrition/redemptions/me`
- **Autentikasi:** `Bearer <accessToken>`
- **Data yang Diambil / Response (200 OK):** Riwayat penukaran paket gizi pengguna yang memuat nama paket, tanggal penukaran, jumlah poin terpakai, dan status klaim.
