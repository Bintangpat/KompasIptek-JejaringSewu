# KompasIptek Mobile Client

> **Proyek:** JEJARING-SEWU (SINERGI-PEKON) — Mobile Application  
> **Teknologi:** React Native (Expo SDK) + TypeScript  
> **Target Pengguna:** Warga desa/pekon, kurir jastip, pekerja mini-job, dan petani/pengepul.

---

## 1. Tech Stack & Dependencies

- **Framework:** React Native dengan Expo SDK (Managed Workflow)
- **Bahasa:** TypeScript
- **Navigasi:** Expo Router / React Navigation (Bottom Tabs)
- **Komponen Perangkat Keras & Sensor:**
  - `expo-camera`: Pengambilan langsung foto Selfie Proof-of-Work (Watermark GPS, Waktu, & ID Transaksi).
  - `expo-location`: Pelacakan lokasi presisi tinggi untuk rute Nebeng-Jastip dan validasi geotagging radius pekon.
  - `expo-image-manipulator`: Kompresi gambar sisi klien sebelum pengunggahan (hemat kuota & ramah koneksi pedesaan).
  - `expo-task-manager`: Pelacakan rute kurir di latar belakang (*background route tracking*).
- **Penyimpanan Lokal & Offline-First:**
  - `expo-sqlite`: Antrean transaksi offline (*offline queue*) saat berada di area *blank-spot* sinyal, otomatis sinkronisasi saat terhubung internet kembali.
- **Peta & Geospasial:** OpenStreetMap (OSM) / React Native Maps.
- **Aksesibilitas (Zero-Discrimination):**
  - Kompatibilitas penuh dengan Android TalkBack (`accessible={true}` dan `accessibilityLabel` pada seluruh elemen interaktif).
  - Dukungan antarmuka kontras tinggi dan ukuran font ramah lansia/disabilitas.

---

## 2. Struktur Navigasi (4 Tab Utama)

1. **Tab 1: Peta Searah & Nebeng-Jastip (`/commuter`)**
   - Menampilkan rute komuter searah warga pekon ke kota/pasar.
   - Peta visualisasi titik temu dan penitipan barang.
2. **Tab 2: Bursa Panen & Mini-Job (`/marketplace`)**
   - Daftar komoditas panen lokal dan harga wajar harian.
   - Lowongan pekerjaan harian mikro (Mini-Job) dengan filter *Disability-Friendly* dan *Auto-Accept Lock*.
3. **Tab 3: Kamera Validasi Selfie PoW (`/verify-camera`)**
   - Antarmuka khusus kamera langsung (*camera direct only*, tanpa galeri).
   - Menempelkan metadata watermark (Koordinat GPS, Nama Pekon, Timestamp, Transaksi ID) dan menghasilkan `X-Image-Hash` (SHA-256).
4. **Tab 4: Dashboard Skor Kredit & Dompet (`/profile-wallet`)**
   - Tampilan saldo Poin Gizi & Saldo Tunai (Double-Entry Wallet).
   - Visualisasi nilai $S_{kredit}$ (Skor Kredit Alternatif AHP-TOPSIS) dan rekomendasi pinjaman modal BUMDes (Grade A/B/C).
   - Penukaran poin ke paket pangan pencegahan stunting.

---

## 3. Integrasi Backend

Aplikasi mobile berkomunikasi dengan backend NestJS melalui REST API `/api/v1`:
- Base URL: `http://<backend-host>:3000/api/v1`
- Autentikasi: JWT Access Token (disimpan di SecureStore) + FCM Token untuk push notification OTP.
