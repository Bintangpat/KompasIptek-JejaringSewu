---
name: dokumentasi_pengembangan_fitur
description: >-
  Gunakan skill ini untuk mendokumentasikan setiap pengembangan fitur, refactoring, atau perubahan modul
  pada repositori KompasIptek. Skill ini memandu penulisan log teknis berstandar enterprise dan menyimpannya
  di folder Docs/Logs/<Modul>/ dengan format penamaan [Tanggal_Perubahan Ke Berapa Kali].md (contoh: 11.2.26_1.md).
---

# Skill: Dokumentasi Pengembangan Fitur (Enterprise Standard)

Skill ini digunakan untuk mencatat dan mendokumentasikan setiap rilis, pembaruan, atau refactoring fitur ke dalam log historis proyek dengan struktur yang jelas, mendalam secara teknis, dan memenuhi standar tata kelola rekayasa perangkat lunak tingkat enterprise (*Enterprise Software Engineering Governance*).

---

## 1. Aturan Penempatan & Penamaan Berkas

### 1.1 Lokasi Direktori
Dokumentasi wajib disimpan di dalam folder:
`Docs/Logs/<Modul>/`
Pilihan subfolder berdasarkan ruang lingkup perubahan:
- `Docs/Logs/Backend/` (untuk perubahan pada API NestJS, Prisma, Database, Worker)
- `Docs/Logs/Web/` (untuk dashboard Next.js, komponen admin, Tailwind/shadcn)
- `Docs/Logs/Mobile/` (untuk aplikasi React Native Expo / Mobile2)
- `Docs/Logs/` (jika perubahan bersifat orkestrator lintas seluruh subproject)

### 1.2 Format Penamaan Berkas
Format nama file:
```text
[Tanggal_Perubahan Ke Berapa Kali].md
```
**Formula:** `<Hari>.<Bulan>.<TahunDuaDigit>_<NomorUrut>.md`  
**Contoh:**
- Perubahan pertama pada tanggal tersebut: `11.2.26_1.md`
- Perubahan kedua pada tanggal yang sama: `11.2.26_2.md`
- Perubahan ketiga: `11.2.26_3.md`

> **Langkah Otomatis Penentuan Indeks:**  
> Sebelum membuat file baru, periksa berkas yang sudah ada di direktori tujuan dengan pola tanggal yang sama. Ambil nomor indeks berikutnya setelah file terakhir.

---

## 2. Struktur & Format Standar Penulisan

Format ini menggabungkan 4 pilar inti kebutuhan proyek dengan 6 ekstensi penguatan standar *Enterprise Software Engineering* (Auditabilitas, Keamanan Transaksi, Migrasi Data, Kontrak API, QA & Rollback).

### 📋 Template Dokumen

```markdown
# [Judul Pengembangan]

| Metadata | Keterangan |
| :--- | :--- |
| **Tanggal & Waktu** | DD MMMM YYYY, HH:MM WIB |
| **Target Subproject** | Backend / Web / Mobile |
| **Domain Fitur** | (Contoh: Commuter / Harvest / Mini-Job / Wallet / Auth) |
| **Tipe Perubahan** | New Feature / Refactoring / Breaking Change / Performance |
| **Penanggung Jawab** | (Nama Engineer / AI Agent) |

---

## 1. Alasan Pengembangan
> **Catatan Penting:** Bagian ini HARUS SINGKAT (maksimal 2–3 kalimat langsung pada inti masalah/kebutuhan bisnis).

[Tuliskan alasan singkat, latar belakang masalah, atau objektif bisnis di sini secara padat dan jelas].

---

## 2. Pengembangan Fitur & Mekanisme Teknis
> Jelaskan setiap fitur/subfitur per poin dengan uraian teknis mendalam dan konteks arsitektur luasnya.

### 2.1 [Nama Fitur / Komponen 1]
- **Tujuan Teknis:** [Deskripsi tujuan spesifik komponen/fungsi ini dibuat].
- **Mekanisme & Alur Kerja:** [Jelaskan arsitektur data flow, algoritma, lifecycle, atau komunikasi antar komponen].
- **Berkas Terkait:**
  - `[Path/Ke/File.ts](file:///D:/Projects/KompasIptek/...)`: Deskripsi peran file/fungsi.

### 2.2 [Nama Fitur / Komponen 2]
- **Tujuan Teknis:** ...
- **Mekanisme & Alur Kerja:** ...
- **Berkas Terkait:** ...

---

## 3. Perubahan yang Dilakukan pada Modul Lain (Cross-Module Impact)
> Uraikan per poin bagaimana fitur ini berdampak, mengubah, atau memerlukan penyesuaian pada modul/subproject lain.

- **Modul [Nama Modul A]:**
  - **Dampak Perubahan:** [Jelaskan apa yang berubah pada modul ini].
  - **Mekanisme Keterkaitan:** [Bagaimana integrasi baru bekerja dan mencegah side-effect].
- **Modul [Nama Modul B]:**
  - **Dampak Perubahan:** ...
  - **Mekanisme Keterkaitan:** ...

---

## 4. Dampak Basis Data & Skema (Database & Migration Impact)
*(Wajib diisi jika ada modifikasi schema.prisma / database)*
- **Perubahan Skema:** [Penambahan Model, Field, Index, Enum pada `schema.prisma`].
- **Status Migrasi:** [Misal: `npx prisma migrate dev --name <nama_migrasi>` telah dijalankan].
- **Backward Compatibility:** [Apakah data eksisting memerlukan data backfill / default value?].

---

## 5. Kontrak API & Potensi Breaking Changes
*(Wajib diisi jika menyentuh API endpoint Backend atau konsumsi API)*
- **Endpoint Terkait:** `[METHOD] /api/v1/...`
- **Perubahan DTO (Request/Response):** [Field baru yang ditambah atau diubah].
- **Status Kompatibilitas:** [Backward Compatible / Breaking Change terhadap Web/Mobile].

---

## 6. Keamanan, Integritas Data & Validasi
*(Standar Enterprise: Kepatuhan Buku Besar & Transaksi Atomik)*
- **Pola Transaksi:** [Penerapan `prisma.$transaction(...)` untuk mutasi atomik].
- **Integritas Buku Besar (Ledger):** [Penerapan Double-Entry Bookkeeping & Signature HMAC-SHA256 jika relevan].
- **Validasi Input:** [Penerapan `class-validator` / sanitasi input].

---

## 7. Verifikasi & Bukti Pengujian (QA & Evidence)
- **Kompilasi TypeScript:** `0 Errors` (Hasil eksekusi `npx tsc --noEmit`).
- **Pengujian Fungsional:** [Hasil pengujian endpoint / komponen / unit test].
- **Bukti Log / Output:**
  ```text
  [Salin cuplikan output test, log eksekusi, atau respons API di sini]
  ```

---

## 8. Strategi Rollback & Mitigasi Risiko (Disaster Recovery)
- **Langkah Rollback Kode:** [Perintah git revert atau branch fallback].
- **Langkah Rollback Data:** [Langkah manual atau down-migration jika database bermasalah].
- **Mitigasi Risiko:** [Tindakan pencegahan dampak ke pengguna aktif].
```

---

## 3. Pedoman Pelaksanaan Bagi Agent / Engineer

1. **Selalu Buat Berkas di Folder yang Tepat:**
   Periksa subproject yang dimodifikasi. Jika melakukan perubahan pada `Backend/`, simpan di `Docs/Logs/Backend/`. Jika pada `Mobile2/`, simpan di `Docs/Logs/Mobile/`.
2. **Hitung Nomor Urut Berkas Secara Akurat:**
   Gunakan perintah shell / PowerShell untuk melihat file log tanggal hari ini guna memastikan nomor urut increment (`_1`, `_2`, dst.) tidak menimpa file lama.
3. **Patuhi Batasan "Alasan Singkat":**
   Jangan menuliskan paragraf panjang pada bagian alasan. Maksimal 2–3 kalimat langsung pada objektif (contoh: *"Mendekomposisi tab commuter monolitik menjadi feature components terisolasi untuk meniadakan redundant re-render dan mempermudah unit testing"*).
4. **Tautkan Path File Secara Rinci:**
   Gunakan markdown file link yang valid dengan format `[NamaFile](file:///D:/Projects/KompasIptek/...)` agar mudah dinavigasi oleh reviewer atau developer lain.
