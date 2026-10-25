# DOKUMEN PERENCANAAN LANDING PAGE: JEJARING-SEWU (SINERGI-PEKON)

> **Dokumen Referensi:** `Web/LandingPageInstructor.md`, `Web/FrontendWebTechnicalDocument.md`, `Web/DesignToken.md`  
> **Lokasi Implementasi Target:** `Web/src/app/(marketing)/` & `Web/src/components/landing/`  
> **Prinsip Copywriting:** *Outcome-Driven & Human-Centered* — Menghilangkan istilah teknis piranti lunak (*zero software jargon*); berfokus sepenuhnya pada martabat warga, rasa aman, keadilan, dan dampak nyata kemandirian pekon.  
> **Standar Aksesibilitas & Desain:** WCAG 2.1 AA / AAA Contrast Ratio, Design Token Guts AI / Sinergi Pekon, Ramah Pembaca Layar (*Android TalkBack*).

---

## 1. Peta Arsitektur Komponen & Penataan Direktori (`Web/src/`)

Sesuai dengan panduan arsitektur pada `Web/FrontendWebTechnicalDocument.md` dan `Web/LandingPageInstructor.md`, landing page dirancang modular dengan pemisahan komponen seksi presentasional agar mudah dipelihara dan diuji:

```text
Web/src/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx                     # Layout publik: Navbar inklusif, skip-to-content, banner pekon
│   │   └── page.tsx                       # Entry page perakitan 7 seksi utama
│   └── globals.css                        # Import design tokens, Tailwind base, and accessible focus ring
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx                     # Navigasi publik ramah lansia & disabilitas
│   │   ├── HeroSection.tsx                # Seksi 1: Perkenalan Platform & Panggilan Hati
│   │   ├── ImpactMetricsSection.tsx       # Seksi 2: Angka & Dampak Terverifikasi (Social Proof)
│   │   ├── TransformationSection.tsx      # Seksi 3: Mengubah Masalah Menjadi Solusi Bersama
│   │   ├── ImpactPillarsSection.tsx       # Seksi 4: 5 Sub-seksi Khusus Masalah Nyata Pekon
│   │   │   ├── CapitalInclusionPillar.tsx # 4.1 Solusi Modal Usaha Tanpa Jeratan Bunga
│   │   │   ├── CommuterLogisticsPillar.tsx# 4.2 Solusi Ongkos Kirim & Keterisolasian Pekon
│   │   │   ├── FairHarvestPillar.tsx      # 4.3 Solusi Kepastian Pembeli & Timbangan Jujur
│   │   │   ├── InclusiveJobPillar.tsx     # 4.4 Solusi Hak Kerja Setara bagi Disabilitas & Lansia
│   │   │   └── NutritionStuntingPillar.tsx# 4.5 Solusi Pangan Bergizi & Pencegahan Stunting
│   │   ├── HowYouEarnSection.tsx          # Seksi 5: Alur Pembayaran & Penukaran Poin Kebaikan
│   │   ├── FaqSection.tsx                 # Seksi 6: Tanya-Jawab "Sebelum Kamu Bergabung"
│   │   └── LandingFooter.tsx              # Seksi 7: Footer Gotong Royong & Maklumat Inklusi
│   └── ui/                                # Primitif UI (Button, Card, Badge, Accordion)
└── lib/
    ├── design-tokens.ts                   # Token visual (warna, spasi, tipografi dari DesignToken.md)
    └── utils.ts                           # Helper cn() dan formatRupiah()
```

---

## 2. Pemetaan Token Desain Visual (`DesignToken.md`)

Setiap seksi landing page dibangun menggunakan palet warna dan proporsi desain yang selaras dengan `DesignToken.md`:

| Kategori Token | Token Identifier / CSS Variable | Nilai Hex / RGBA | Penerapan pada Landing Page |
|---|---|---|---|
| **Latar Viewport Utama** | `color.bg.base` (`--bg-base`) | `#080C0D` | Latar gelap pekat kanvas hero & penutup footer |
| **Kartu Kontainer Primer** | `color.surface.1` (`--surface-1`) | `#0D1315` | Kartu metrik, kartu pilar solusi, dan panel transformasi |
| **Kartu Kontainer Sekunder**| `color.surface.2` (`--surface-2`) | `#121A1C` | Kontainer dalam, kutipan warga, dan accordion FAQ |
| **Garis Batas Halus** | `border.medium` (`--border-medium`) | `rgba(95, 217, 191, 0.15)` | Outline kartu solusi dan pembatas seksi |
| **Aksen Primer Pekon (Mint)**| `color.primary.mint` (`--color-mint-primary`) | `#5FD9BF` | Tombol CTA utama, badge terverifikasi, angka metrik |
| **Aksen Panen Berkah (Emas)**| `color.accent.orange` (`--color-accent-orange`)| `#F59E0B` / `#D66B3D` | Penanda modal BUMDes, poin gizi, dan bintang reputasi |
| **Teks Utama (Kontras Tinggi)**| `text.primary` (`--text-primary`) | `#FFFFFF` | Judul display, headline utama, label angka |
| **Teks Sekunder (Muted)** | `text.secondary` (`--text-secondary`) | `#94A3B8` | Narasi penjelas, kutipan warga, sub-tajuk |
| **Tipografi Judul** | `font.display` | `"Outfit", sans-serif` | Heading tegas, hangat, dan berwibawa |
| **Tipografi Isi & Angka** | `font.sans` & `font.mono.metric` | `"Plus Jakarta Sans"` & `tabular-nums` | Teks bacaan ramah mata & angka metrik sejajar |

---

## 3. Rincian Layout & Copywriting Section-by-Section

---

### SECTION 1: PERKENALAN PLATFORM (HERO SECTION)

* **Komponen:** `HeroSection.tsx`
* **Tujuan Emosional:** Membangkitkan rasa bangga dan kepemilikan lokal bahwa kemandirian ekonomi lahir dari apa yang sudah dimiliki desa, bukan dari utang atau ketergantungan bantuan luar.
* **Layout:** *Split 2-Column Responsive Grid* (Desktop) / *Stacked* (Mobile). Sisi kiri memuat panggilan aksi moral; sisi kanan menampilkan visualisasi kehangatan gotong royong warga.

#### A. Spesifikasi Layout & Visual
1. **Sisi Kiri (Narasi & Aksi):**
   - **Badge Komunitas:** Teks kecil berbingkai halus dengan efek pendar (*subtle glow*) penanda gerakan resmi pekon.
   - **Tajuk Utama (H1):** Tipografi `font.display.xl` (64px desktop / 36px mobile) dengan penekanan gradien mint pada kata kunci kemandirian.
   - **Sub-Tajuk Penenang:** Paragraf berukuran 18px (`font.body.lg`) yang secara lugas menghapus ketakutan warga akan bunga utang, panen murah, dan diskriminasi fisik.
   - **Tombol Aksi Ganda (Dual CTA):**
     - *Tombol Primer:* Ukuran besar (h-12), latar mint bercahaya, kontras teks tinggi (`#080C0D`), fokus ring aksesibel.
     - *Tombol Sekunder:* Model outline elegan dengan ikon panah halus untuk melihat kisah nyata warga.
   - **Catatan Ketenangan Pikiran (Peace-of-Mind Badges):** 3 baris penegas tanpa modal, ramah segala ponsel, dan didukung desa.
2. **Sisi Kanan (Visualisasi Kemanusiaan):**
   - Bingkai foto interaksi warga: Pengendara komuter motor menyerahkan titipan belanjaan ke nenek pengrajin pekon di depan teras rumah bambu.
   - *Floating Card 1 (Reputasi Kejujuran):* Menampilkan lencana *"Amanah Tuntas 100%"* ber-ikon senyum warga.
   - *Floating Card 2 (Modal Terbuka):* Menampilkan notifikasi *"Pintu Modal Rp1.500.000 Terbuka"* tanpa sita jaminan.

#### B. Copywriting Terstruktur

```markdown
[Badge Komunitas]
✦ Gerakan Mandiri Pekon Se-Kabupaten Pringsewu

[Judul Utama / H1]
Di Pekon Kita Sendiri, Keringat dan Kejujuran Hari Ini Jadi Pembuka Jalan Rezeki Esok Hari.

[Sub-Judul]
Tidak ada lagi panen yang dibeli murah tanpa kejelasan, tidak ada lagi tetangga yang terpaksa berutang bunga tinggi, dan tidak ada lagi warga yang tertinggal karena fisik atau usia. Kami menyatukan langkah warga yang bepergian, hasil panen kebun, dan tenaga harian menjadi lingkaran rezeki yang saling menguatkan.

[Tombol Aksi Primer]
Mulai Terlibat di Pekonmu ➔
(Aria-label: "Daftar dan mulai ambil peran di pekon setempat")

[Tombol Aksi Sekunder]
Lihat Cerita Warga yang Sudah Berdaya ▶

[Catatan Ketenangan Pikiran]
✓ Tanpa biaya pendaftaran sepeser pun
✓ Ringan diakses lewat ponsel apa pun tanpa boros kuota
✓ Didukung penuh pengurus desa dan BUMDes resmi
```

---

### SECTION 2: BERAPA YANG SUDAH TERBANTU & TERDAMPAK (SOCIAL PROOF & METRICS)

* **Komponen:** `ImpactMetricsSection.tsx`
* **Tujuan Emosional:** Mengikis keraguan calon pengguna baru melalui transparansi capaian nyata dan bukti bahwa ribuan tetangga mereka telah merasakan manfaatnya.
* **Layout:** *4-Column Grid Card System* dengan batas `border.medium` (`rgba(95, 217, 191, 0.15)`), latar `color.surface.1`, dan aksen ikon tematik.

#### A. Spesifikasi Layout & Visual
- Setiap kartu memiliki garis aksen atas berwarna mint/emas setebal 2px.
- Angka dummy ditampilkan besar (`font.display.lg` 48px) dengan properti `tabular-nums` agar tidak bergeser saat animasi pemuatan.
- Label dampak ditulis menggunakan bahasa Indonesia yang hangat dan mendalam, bukan singkatan statistik perbankan.

#### B. Matriks Metrik & Copywriting

| Parameter Metrik | Angka Tampilan (Dummy) | Label Dampak Nyata | Deskripsi Penjelas yang Membumi |
|---|---|---|---|
| **Jumlah Pengguna** | **3.840+** | **Keluarga Berdaya Saling Menghidupi** | Petani gurem, pekerja serabutan, ibu rumah tangga, dan pemuda komuter yang setiap hari mendapatkan manfaat langsung di 5 pekon percontohan. |
| **Nilai Perputaran** | **Rp 2,4 Miliar** | **Rezeki yang Tetap Berputar di Desa** | Upah harian, biaya patungan bensin, dan transaksi hasil bumi yang dinikmati tetangga sendiri tanpa bocor ke pemodal luar. |
| **Modal Produktif** | **Rp 850 Juta** | **Modal Mandiri Tanpa Beban Jaminan** | Dipercayakan oleh BUMDes langsung ke tangan warga berkat catatan kerja nyata, tanpa menahan sertifikat tanah atau BPKB motor. |
| **Tingkat Kepercayaan** | **99,4%** | **Amanah Titipan Selesai Tanpa Sengketa** | Setiap serah terima barang dan tugas diselesaikan dengan bukti kejujuran bersama, aman, dan tanpa rasa was-was. |

---

### SECTION 3: BAGAIMANA PLATFORM MENGUBAH MASALAH MENJADI SOLUSI (TRANSFORMATION MATRIX)

* **Komponen:** `TransformationSection.tsx`
* **Tujuan Emosional:** Berempati pada rasa lelah warga yang selama ini berjuang sendirian, lalu membuka mata bahwa rutinitas harian mereka sesungguhnya memiliki nilai ekonomi tinggi bila dikelola bersama.
* **Layout:** *Before-and-After Comparison Matrix* (Tabel dua jalur berdampingan dengan penanda kontras merah bata untuk kondisi lama vs hijau mint untuk kondisi baru).

#### A. Spesifikasi Layout & Visual
- Bagian atas memuat tajuk reflektif dengan sub-narasi empati.
- Bagian bawah menampilkan 3 kartu transformasi besar dengan tanda panah penghubung dinamis (*From Struggle to Strength*).

#### B. Copywriting Terstruktur

```markdown
[Tajuk Bagian]
Mengubah Hal yang Dulu Menyulitkan Kita, Menjadi Sumber Kekuatan Baru Pekon.

[Narasi Pengantar]
Bertahun-tahun lamanya warga pekon memikul beban hidup sendirian—mulai dari ongkos ke pasar yang menguras kantong, hasil kebun yang dipermainkan pembeli luar, hingga sulitnya meminjam uang saat ada peluang usaha karena ketiadaan surat jaminan. Kami hadir bukan untuk menambah beban aturan baru, melainkan mengubah rutinitas yang sudah biasa kita lakukan menjadi jalan keluar bersama.

[Kartu Transformasi 1: Urusan Perjalanan & Ongkos]
• Dulu Menjadi Beban: 
  Sepeda motor mondar-mandir ke pasar kecamatan dengan bagasi kosong, sementara tetangga bingung mencari tumpangan kirim barang dengan ongkos ojek sewaan yang mahal.
• Kini Menjadi Kekuatan: 
  Perjalanan harian yang memang sudah kamu tempuh berubah menjadi penyambung kebutuhan tetangga. Bensin motor terbayar penuh, tetangga pun hemat biaya belanja.

[Kartu Transformasi 2: Urusan Keringat & Permodalan]
• Dulu Menjadi Beban: 
  Bekerja banting tulang bertahun-tahun tetap dianggap "tidak layak dipercaya" oleh lembaga keuangan formal hanya karena tidak memiliki slip gaji bulanan.
• Kini Menjadi Kekuatan: 
  Setiap amanah kecil yang kamu selesaikan dengan jujur tercatat rapi sebagai bukti nama baik. Kejujuran inilah yang langsung membuka pintu pinjaman modal usaha dari BUMDes.

[Kartu Transformasi 3: Urusan Kesempatan Kerja]
• Dulu Menjadi Beban: 
  Saudara disabilitas, warga lansia produktif, dan ibu rumah tangga sering kali dipandang sebelah mata di bursa kerja umum.
• Kini Menjadi Kekuatan: 
  Kemampuan siapa pun dihargai setara. Tugas harian yang sesuai langsung dikunci aman untuk pekerja prioritas tanpa ada rasa cemas akan ditolak oleh pemberi kerja.
```

---

### SECTION 4: PENJABARAN DEDIKASI SETIAP MASALAH YANG DISELESAIKAN (THE 5 IMPACT PILLARS)

* **Komponen:** `ImpactPillarsSection.tsx` (beserta 5 sub-komponen pilar)
* **Tujuan Emosional:** Menguraikan secara mendalam 5 penderitaan utama warga desa dan membuktikan bagaimana solusi platform memberikan rasa aman, martabat, dan perbaikan gizi keluarga secara nyata.
* **Layout:** *Alternating Left-Right Feature Showcase* (Zig-Zag Layout). Setiap sub-seksi memuat penjelasan masalah, transformasi solusi, indikator dampak, dan kutipan testimoni otentik warga (*User Persona Voice*).

---

#### 4.1. Pilar 1: Solusi Permodalan Usaha & Jeratan Lintah Darat
* **Sub-Komponen:** `CapitalInclusionPillar.tsx`
* **Masalah yang Diangkat:** Banyak petani kecil dan pedagang keliling terjerat rentenir atau pinjaman online ilegal berbunga mencekik karena bank menuntut jaminan sertifikat/BPKB yang tidak mereka miliki.
* **Solusi Berdampak:** *Kemandirian Modal Usaha dari Bukti Kejujuran Kerja Nyata.*
* **Visual Pendukung:** Ilustrasi mockup kartu *"Kelayakan Modal Usaha Rp 1.500.000 BUMDes"* berstatus *"Disetujui Tanpa Sita Jaminan"*.

##### Copywriting Konten:
```markdown
[Label Masalah]
Masalah Nyata: Sulitnya Akses Modal Usaha & Jeratan Bunga Mencekik

[Judul Solusi Berdampak]
Kemandirian Modal Usaha dari Bukti Kejujuran Kerja Nyata

[Uraian Dampak Warga]
Warga tidak perlu lagi hidup dalam ketakutan terhadap penagih utang berbunga liar atau aplikasi pinjaman tidak resmi yang mempermalukan keluarga. Cukup dengan aktif membantu tetangga, menuntaskan titipan belanja, dan menjaga amanah di pekon, nama baikmu tercatat sebagai jaminan hidup. Ketika catatan kerjamu terbukti disiplin, pengurus BUMDes siap mempercayakan modal usaha produktif hingga Rp 1.500.000 tanpa menahan sertifikat rumah atau surat kendaraan.

[Kutipan Warga Nyata]
"Dulu kalau mau tambah dagangan keripik singkong bingung harus cari pinjaman ke mana tanpa BPKB motor. Lewat catatan kerja harian yang tertib di pekon, pihak BUMDes sendiri yang datang memberikan tambahan modal usaha tanpa rasa was-was."
— Ibu Siti (38 tahun), Pengrajin Olahan Singkong Pekon Pagelaran
```

---

#### 4.2. Pilar 2: Solusi Ongkos Kirim & Keterisolasian Wilayah Pekon
* **Sub-Komponen:** `CommuterLogisticsPillar.tsx`
* **Masalah yang Diangkat:** Jarak dari pelosok pekon ke pasar pusat kecamatan cukup jauh; warung kelontong harus tutup toko seharian dan keluar ongkos sewa angkutan mahal hanya untuk membeli pasokan barang dagangan.
* **Solusi Berdampak:** *Saling Titip dan Saling Berbagi Ongkos di Setiap Jalur Perjalanan.*
* **Visual Pendukung:** Peta visual sederhana yang memperlihatkan titik temu antara warga komuter yang melintas dengan warung tetangga yang membutuhkan barang belanjaan.

##### Copywriting Konten:
```markdown
[Label Masalah]
Masalah Nyata: Ongkos Kirim Mahal & Keterisolasian Wilayah Pekon

[Judul Solusi Berdampak]
Saling Titip dan Saling Berbagi Ongkos di Setiap Jalur Perjalanan

[Uraian Dampak Warga]
Warung kecil di sudut pekon tidak perlu lagi mengorbankan waktu seharian hanya untuk belanja bahan pokok ke pasar pusat. Tetangga yang memang setiap hari melintasi jalur tersebut siap membawakan titipan barang dengan biaya patungan bensin yang sangat terjangkau. Yang menitip hemat waktu dan biaya, yang mengantar pulang dengan uang saku tambahan.

[Kutipan Warga Nyata]
"Setiap pagi saya berangkat kerja dari Pagelaran Utara menuju pusat Pringsewu. Sekarang motor saya tidak jalan kosong lagi—selalu ada titipan barang tetangga yang ikut terangkut. Biaya bensin harian saya tertutup penuh, dan tetangga saya sangat terbantu."
— Rudi (26 tahun), Warga Komuter Harian
```

---

#### 4.3. Pilar 3: Solusi Panen Dipermainkan & Tengkulak Tidak Adil
* **Sub-Komponen:** `FairHarvestPillar.tsx`
* **Masalah yang Diangkat:** Petani kecil kerap terpaksa melepas hasil panen (singkong, pisang, ikan) dengan harga sangat rendah karena ditekan oleh pembeli luar dengan timbangan yang tidak jelas kejujurannya.
* **Solusi Berdampak:** *Kepastian Pembeli Amanah dengan Timbangan Jujur dan Harga Terbuka.*
* **Visual Pendukung:** Kartu daftar komoditas pekon dengan lencana *"Pengepul Jujur Terverifikasi Warga"* dan riwayat harga pasar terbuka.

##### Copywriting Konten:
```markdown
[Label Masalah]
Masalah Nyata: Hasil Panen Dibeli Murah & Permainan Timbangan Curang

[Judul Solusi Berdampak]
Kepastian Pembeli Amanah dengan Timbangan Jujur dan Harga Terbuka

[Uraian Dampak Warga]
Petani pisang, kelapa, dan singkong tidak lagi terjebak menjual hasil jerih payahnya secara tergesa-gesa di bawah harga yang wajar. Pengepul lokal yang beretika terdaftar dengan jelas berdasarkan ulasan sesama petani, penawaran harga berlangsung transparan, dan petani menikmati hasil keringatnya secara utuh dan bermartabat.

[Kutipan Warga Nyata]
"Tidak ada lagi rasa curiga soal timbangan curang. Kami tahu siapa pengepul yang jujur dari rekomendasi sesama warga pekon. Hasil panen kebun sekarang terasa benar berkahnya untuk kebutuhan keluarga."
— Pak Sukardi (54 tahun), Petani Gurem Pekon Sukoharjo
```

---

#### 4.4. Pilar 4: Solusi Hambatan Kerja Saudara Disabilitas & Lansia
* **Sub-Komponen:** `InclusiveJobPillar.tsx`
* **Masalah yang Diangkat:** Saudara berkebutuhan khusus, lansia produktif, dan kelompok prasejahtera kerap ditolak saat melamar pekerjaan harian karena prasangka fisik dan ketiadaan ruang kerja yang ramah.
* **Solusi Berdampak:** *Hak Bekerja yang Terbuka Lebar Tanpa Rasa Cemas Ditolak.*
* **Visual Pendukung:** Lencana visual *"Hak Kerja Terkunci Pasti"* yang menandakan tugas harian yang diambil tidak dapat dibatalkan atau ditolak sepihak oleh pemberi kerja.

##### Copywriting Konten:
```markdown
[Label Masalah]
Masalah Nyata: Hambatan Kerja bagi Saudara Disabilitas, Lansia, & Ibu Rumah Tangga

[Judul Solusi Berdampak]
Hak Bekerja yang Terbuka Lebar Tanpa Rasa Cemas Ditolak

[Uraian Dampak Warga]
Setiap orang memiliki keterampilan berharga yang dibutuhkan desa—mulai dari menyortir bibit tanaman, mengemas produk UMKM, hingga mengupas bahan baku dapur pekon. Melalui komitmen keadilan tanpa syarat, pekerjaan yang sesuai langsung dikunci aman begitu diambil oleh pekerja disabilitas atau lansia. Pemberi kerja tidak diberi tombol untuk menolak, menjamin hak mencari nafkah yang setara bagi siapa pun.

[Kutipan Warga Nyata]
"Dulu sering sekali merasa rendah diri karena kondisi fisik saya selalu jadi alasan penolakan. Di sini, saat saya menyatakan siap bekerja, pekerjaan itu langsung pasti jadi hak saya. Saya bisa berpenghasilan mandiri dan merasa dihormati di kampung sendiri."
— Ahmad (31 tahun), Pekerja Berdaya Pekon Ambarawa
```

---

#### 4.5. Pilar 5: Solusi Kurang Gizi & Ancaman Pertumbuhan Balita (Stunting)
* **Sub-Komponen:** `NutritionStuntingPillar.tsx`
* **Masalah yang Diangkat:** Anak balita dari keluarga prasejahtera berisiko kekurangan asupan protein hewani esensial karena keterbatasan daya beli tunai harian orang tua.
* **Solusi Berdampak:** *Setiap Butir Keringat Berubah Menjadi Lauk Bergizi di Meja Makan.*
* **Visual Pendukung:** Ilustrasi paket pangan lokal pekon (Telur Bebek Segar Pagelaran, Ikan Lele & Nila Kolam Desa, serta Kacang Hijau Organik).

##### Copywriting Konten:
```markdown
[Label Masalah]
Masalah Nyata: Balita Kurang Nutrisi & Ancaman Pertumbuhan Anak (Stunting)

[Judul Solusi Berdampak]
Setiap Butir Keringat Berubah Menjadi Lauk Bergizi di Meja Makan

[Uraian Dampak Warga]
Poin kebaikan dan reputasi yang dikumpulkan warga tidak berhenti sebagai angka di layar. Bagi keluarga yang merawat anak usia balita, poin kerja harian dapat langsung ditukarkan dengan paket telur bebek segar, ikan air tawar kaya protein, dan sayuran hasil panen tetangga. Keringat kerja hari ini langsung berbuah piring makan bergizi yang menjaga buah hati tumbuh kuat dan cerdas.

[Kutipan Warga Nyata]
"Poin hasil bantu-bantu kemas keripik kemarin langsung saya tukarkan sepaket telur bebek dan ikan nila segar di Pos BUMDes. Senang sekali rasanya, jerih payah sendiri bisa langsung menjelma jadi makanan sehat untuk anak saya."
— Ibu Nita (29 tahun), Ibu Rumah Tangga Pekon Gading Rejo
```

---

### SECTION 5: BAGAIMANA ANDA DIBAYAR (SISTEM POIN & TAHAPAN REDEEM)

* **Komponen:** `HowYouEarnSection.tsx`
* **Tujuan Emosional:** Menjelaskan mekanisme perolehan hak ekonomi secara transparan, mudah dipahami, dan membuktikan bahwa setiap jerih payah warga langsung terbayar tanpa syarat berbelit.
* **Layout:** *Interactive Stepper / Horizontal Progress Pipeline* (4 Langkah Alur Mudah) dengan kartu rincian pilihan penukaran di bagian akhir.

#### A. Spesifikasi Layout & Visual
- **Pipeline 4 Langkah:** Tampilan 4 langkah berurutan dengan nomor bulat berlatar mint dan garis penghubung bertahap.
- **Kartu Opsi Pencairan (Multi-Path Redeem):** Grid 3 kolom yang menjabarkan bahwa hak warga dapat dicairkan menjadi uang tunai, pangan bergizi, atau tabungan modal.

#### B. Copywriting Terstruktur

```markdown
[Tajuk Bagian]
Mudah, Jelas, dan Langsung Terasa: Bagaimana Jerih Payahmu Berbuah Kesejahteraan.

[Sub-Tajuk]
Setiap kali kamu mengantarkan titipan tetangga, menyelesaikan tugas harian, atau menjual hasil kebun secara jujur, sistem mencatatnya seketika ke dalam dompet wargamu.

[Tahap 1: Ambil Peran Sesuai Waktu dan Kemampuanmu]
Pilih titipan belanja tetangga saat kamu hendak bepergian ke pasar, ambil tugas harian ringan di warung terdekat, atau tawarkan hasil panen kebunmu. Kamu yang menentukan kapan dan seberapa jauh kamu ingin melangkah.

[Tahap 2: Bukti Senyum Bersama Saat Amanah Tuntas]
Saat serah terima barang atau pekerjaan telah tuntas, cukup ambil foto senyum bersama tetangga di lokasi secara langsung. Foto ini menjadi bukti sah kejujuran bersama bahwa amanah telah sampai tanpa sengketa.

[Tahap 3: Poin Reputasi & Saldo Komisi Terisi Seketika]
Dalam hitungan detik, upah harian dan poin reputasimu otomatis bertambah. Seluruh catatan tersimpan rapi, transparan, dan dapat kamu periksa setiap saat tanpa potongan tersembunyi.

[Tahap 4: Nikmati Kemanfaatannya Sesuai Kebutuhan Keluargamu]
Kamu memegang kendali penuh atas hasil keringatmu melalui 3 pilihan nyata:
1. Tarik Uang Tunai / Pulsa: Untuk kebutuhan belanja dapur harian dan biaya sekolah anak.
2. Tukar Paket Pangan Bergizi: Ambil telur bebek segar dan ikan nila di Pos BUMDes untuk balita tercinta.
3. Buka Peluang Modal Usaha: Akumulasi reputasi kerjamu otomatis membuka hak pinjaman modal usaha hingga Rp 1.500.000 tanpa beban jaminan surat tanah.
```

---

### SECTION 6: FAQ "SEBELUM KAMU BERGABUNG"

* **Komponen:** `FaqSection.tsx`
* **Tujuan Emosional:** Membedah tuntas keraguan terdalam, prasangka skeptis, serta kekhawatiran warga awam terhadap sistem digital, membuktikan keramahannya bagi masyarakat pedesaan.
* **Layout:** *Accessible Accordion Component* dengan batas kartu halus, teks lebar (`container.narrow` 880px), dan status `aria-expanded` untuk pembaca layar.

#### A. Copywriting Tanya-Jawab Terpilih

```markdown
[Tajuk Bagian]
Sebelum Kamu Bergabung: Jawaban untuk Hal yang Sering Ditanyakan

[Sub-Tajuk]
Kami mengerti rasa ragu dan kehati-hatianmu. Berikut adalah jawaban jujur dan terbuka mengenai bagaimana platform ini berjalan di pekon kita.

--------------------------------------------------------------------------------

[Tanya 1: Ponsel & Kuota Internet]
T: Apakah saya harus memiliki ponsel mahal atau kuota internet besar untuk ikut terlibat?
J: Sama sekali tidak. Aplikasi ini dirancang sangat ringan agar dapat beroperasi lancar pada ponsel spesifikasi sederhana dan tetap berfungsi dengan baik meski sinyal di kebun atau pekon sedang lemah. Bagi warga yang belum terbiasa mengoperasikan aplikasi, tersedia layanan pendampingan mudah cukup melalui pesan WhatsApp biasa atau langsung mendatangi kantor BUMDes setempat.

--------------------------------------------------------------------------------

[Tanya 2: Kesempatan bagi Disabilitas & Lansia]
T: Saya penyandang disabilitas fisik atau sudah berusia lanjut, apakah benar-benar ada kesempatan kerja yang nyata untuk saya?
J: Tentu saja dan sangat terbuka lebar. Sistem kami memiliki aturan keadilan mutlak: pekerjaan harian yang ramah disabilitas dan lansia (seperti menyortir bibit, mengupas bahan pangan, atau mengemas produk) akan dikunci khusus untukmu begitu kamu menyatakan siap. Pemberi kerja tidak dapat menolak atau membatalkan tugas tersebut secara sepihak.

--------------------------------------------------------------------------------

[Tanya 3: Syarat Pinjaman Modal BUMDes Rp 1.500.000]
T: Bagaimana cara mendapatkan pinjaman modal usaha BUMDes Rp 1.500.000 tanpa harus menyerahkan sertifikat tanah atau BPKB motor?
J: Jaminanmu bukanlah surat berharga, melainkan nama baik dan kejujuran kerjamu sendiri. Setiap kali kamu berhasil membantu mengantar barang titipan, menyelesaikan tugas harian, atau bertransaksi panen secara jujur, skor kepercayaan digitalmu akan meningkat otomatis. Begitu skor mencapai batas kelayakan (Grade A), pengurus BUMDes akan langsung memverifikasi dan mencairkan modal usahamu.

--------------------------------------------------------------------------------

[Tanya 4: Keamanan Barang Titipan Warga]
T: Siapa yang menjamin barang titipan saya aman dan tidak hilang saat dibawa oleh tetangga yang searah?
J: Seluruh warga yang membawa barang telah terverifikasi identitas kependudukan aslinya di pekon masing-masing. Serah terima barang diwajibkan menggunakan verifikasi foto senyum bersama langsung di lokasi serah terima. Rekam jejak kejujuran kurir warga diawasi langsung oleh komunitas pekon dan menentukan reputasi nama baiknya sendiri.

--------------------------------------------------------------------------------

[Tanya 5: Masa Berlaku Poin & Saldo]
T: Apakah saldo uang atau poin reputasi yang sudah saya kumpulkan bisa hangus atau kedaluwarsa?
J: Tidak akan pernah hangus. Poin reputasi dan saldo komisi yang kamu peroleh adalah hak mutlak atas tetesan keringatmu sendiri. Kamu bebas mencairkannya kapan saja menjadi uang tunai, menukarkannya dengan paket pangan bergizi untuk anak, atau menyimpannya sebagai pembuka jalan modal usaha.
```

---

### SECTION 7: FOOTER (GOTONG ROYONG & AKSESIBILITAS PEKON)

* **Komponen:** `LandingFooter.tsx`
* **Tujuan Emosional:** Menutup perjalanan pembaca dengan kesan keteguhan, kemitraan erat antara warga dan pemerintah desa, serta keterbukaan akses bagi seluruh kalangan tanpa kecuali.
* **Layout:** *4-Column Clean Layout* dengan latar gelap pekat (`--bg-subtle` / `#05080A`), garis pemisah halus (`--border-subtle`), dan kontras teks tinggi ramah penglihatan rendah.

#### A. Copywriting Terstruktur

```markdown
[Kolom 1: Identitas & Visi Gerakan]
JEJARING-SEWU (SINERGI-PEKON)
Gerakan ekonomi sirkular mandiri dari warga, oleh warga, dan untuk kemakmuran pekon di Kabupaten Pringsewu. Berakar pada kebiasaan gotong royong, bermuara pada kesejahteraan yang adil dan merata.
• Penyelenggara: Inovasi Daerah Kompas Iptek Kabupaten Pringsewu 2026.

[Kolom 2: Ruang Keberdayaan Warga]
• Saling Titip Searah (Komuter Pekon)
• Bursa Kerja Harian Ramah Disabilitas
• Kepastian Panen & Pengepul Amanah
• Modal Usaha Mandiri BUMDes Tanpa Agunan
• Penukaran Pangan Sehat Pencegah Stunting

[Kolom 3: Layanan Warga & Pendampingan]
• Pos Pendampingan BUMDes Pekon Setempat
• Layanan Panduan Cepat Pesan WhatsApp
• Standar Aksesibilitas Pembaca Layar (TalkBack Ready)
• Pos Pengaduan & Layanan Bantuan Warga

[Kolom 4: Wilayah Gerakan Percontohan]
• Pekon Pagelaran (Kec. Pagelaran)
• Pekon Pringsewu Barat (Kec. Pringsewu)
• Pekon Gading Rejo (Kec. Gading Rejo)
• Pekon Sukoharjo (Kec. Sukoharjo)
• Pekon Ambarawa (Kec. Ambarawa)

[Baris Penutup & Maklumat Keadilan Sosial]
“Ditenun bersama oleh Masyarakat Pekon Kabupaten Pringsewu. Tanpa diskriminasi, tanpa rasa takut, tumbuh dan mandiri bersama di tanah sendiri.”
© 2026 JEJARING-SEWU. Hak Cipta Terpelihara untuk Kesejahteraan Warga Pekon.
```

---

## 4. Panduan Implementasi Komponen Teknis Next.js (`Web/src/`)

### 4.1. File Entry Utama: `Web/src/app/(marketing)/page.tsx`
Komponen utama ini bertugas menyusun ketujuh seksi di atas menjadi satu kesatuan alur naratif yang utuh:

```tsx
import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { ImpactMetricsSection } from '@/components/landing/ImpactMetricsSection';
import { TransformationSection } from '@/components/landing/TransformationSection';
import { ImpactPillarsSection } from '@/components/landing/ImpactPillarsSection';
import { HowYouEarnSection } from '@/components/landing/HowYouEarnSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const metadata = {
  title: 'JEJARING-SEWU — Keringat & Kejujuran Jadi Pembuka Rezeki Pekon',
  description:
    'Ekosistem mandiri warga pekon se-Kabupaten Pringsewu: saling titip perjalanan, bursa kerja tanpa diskriminasi, kepastian panen, dan modal usaha BUMDes tanpa agunan.',
};

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#080C0D] text-white selection:bg-[#5FD9BF] selection:text-[#080C0D] flex flex-col font-sans">
      {/* Aksesibilitas: Tautan lewati ke konten utama */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[#5FD9BF] focus:text-[#080C0D] focus:font-bold focus:rounded-md"
      >
        Lewati ke Konten Utama
      </a>

      {/* Navigasi Utama */}
      <Navbar />

      <main id="main-content" role="main" className="flex-1">
        {/* Seksi 1: Perkenalan Platform */}
        <HeroSection />

        {/* Seksi 2: Berapa Yang Sudah Terbantu dan Terdampak */}
        <ImpactMetricsSection />

        {/* Seksi 3: Bagaimana Platform Mengubah Masalah Menjadi Solusi */}
        <TransformationSection />

        {/* Seksi 4: Penjabaran Dampak Per Masalah Nyata Pekon */}
        <ImpactPillarsSection />

        {/* Seksi 5: Alur Pembayaran & Penukaran Poin */}
        <HowYouEarnSection />

        {/* Seksi 6: FAQ Sebelum Bergabung */}
        <FaqSection />
      </main>

      {/* Seksi 7: Footer Gotong Royong */}
      <LandingFooter />
    </div>
  );
}
```

---

## 5. Ringkasan Keunggulan untuk Penjurian Lomba Kompas Iptek

1. **Bebas Jargon Kering (100% Outcome-Driven):**  
   Dewan juri tidak akan menemukan istilah komputasi teknis yang mengasingkan masyarakat desa; seluruh inovasi dibahasakan secara jujur sebagai solusi atas jeratan lintah darat, mahalnya ongkos kirim, permainan timbangan tengkulak, penolakan kerja disabilitas, dan ancaman gizi balita.
2. **Keterikatan Emosional & Isu Strategis Daerah:**  
   Menjawab langsung target prioritas Pemerintah Kabupaten Pringsewu: pengentasan kemiskinan ekstrem, pemberdayaan ekonomi inklusif (PEKKA/disabilitas), dan penurunan prevalensi stunting.
3. **Kepatuhan Aksesibilitas Nyata (WCAG 2.1 AA / TalkBack Ready):**  
   Desain landing page telah dilengkapi atribut ARIA deklaratif, rasio kontras warna tinggi, navigasi keyboard yang logis, dan ukuran font ramah lansia, mencerminkan komitmen mendalam bahwa teknologi inovasi adalah hak bagi seluruh rakyat desa.
