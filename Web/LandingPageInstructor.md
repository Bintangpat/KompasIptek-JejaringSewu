DOKUMEN PERENCANAAN LANDING PAGE: JEJARING-SEWU (SINERGI-PEKON)
Penempatan File: @Web\src\app\(marketing)\page.tsx & @Web\src\components\landing\
Pendekatan: Outcome-Driven Copywriting (Fokus pada martabat, rasa aman, dan kemandirian warga; bukan istilah teknis piranti lunak).
1. Arsitektur Komponen & Penataan Direktori (@Web\src\)

Plaintext
Web/src/
├── app/
│   └── (marketing)/
│       ├── page.tsx                     # Entry page menggabungkan seluruh section
│       └── layout.tsx                   # Layout publik dengan Navbar & Footer inklusif
├── components/
│   ├── landing/
│   │   ├── HeroSection.tsx              # Section 1: Perkenalan Platform
│   │   ├── ImpactMetricsSection.tsx     # Section 2: Angka & Dampak Terverifikasi
│   │   ├── TransformationSection.tsx    # Section 3: Mengubah Beban Menjadi Berkah
│   │   ├── ImpactPillarsSection.tsx     # Section 4: 5 Solusi Spesifik Masalah Pekon
│   │   ├── HowYouEarnSection.tsx        # Section 5: Cara Menghasilkan & Menukarkan Poin
│   │   ├── FaqSection.tsx               # Section 6: FAQ "Sebelum Kamu Bergabung"
│   │   └── LandingFooter.tsx            # Section 7: Footer Gotong Royong
│   └── ui/                              # shadcn/ui (Button, Card, Accordion, Badge)
└── lib/
    └── design-tokens.ts                 # Pemetaan warna semantik, spasi, dan tipografi


Integrasi Token Desain (DesignToken.md)
Warna Primer Komunitas: Hijau Alam Subur (emerald-700 / #047857) melambangkan panen dan keadilan.
Warna Aksen Gotong Royong: Emas/Kuning Jerami (amber-500 / #F59E0B) melambangkan komisi mikro dan poin gizi keluarga.
Latar Belakang Bersih & Nyaman: Warm Off-White (stone-50 / #FAFAF9) yang nyaman di mata petani di bawah terik matahari.
Tipografi: Sans-serif tegas berukuran besar (accessible minimum font 16px, judul leading-tight) dengan rasio kontras warna minimal 4.5:1 memenuhi standar WCAG 2.1 AA.
2. Rincian Layout & Copywriting Section-by-Section
SECTION 1: PERKENALAN PLATFORM (HERO SECTION)
Komponen: HeroSection.tsx
Tujuan Emosional: Membangkitkan rasa kepemilikan lokal bahwa kemandirian ekonomi lahir dari apa yang sudah dimiliki desa, bukan dari utang atau bantuan yang mengikat.
Layout: Split 2-Column Grid (Desktop) / Stacked (Mobile).
Sisi Kiri: Badge wilayah lokal, tajuk utama yang menggugah, sub-tajuk yang menenangkan keraguan warga, dan aksi tombol ganda (Call-to-Action berkontras tinggi).
Sisi Kanan: Ilustrasi foto hangat interaksi warga (seorang komuter menyerahkan pesanan titipan ke lansia pengrajin pekon, didampingi kartu visual reputasi kerja).
Copywriting Konten:
Tagar / Badge Komunitas:
✦ Gerakan Mandiri Pekon Se-Kabupaten Pringsewu


Judul Utama (Headline):
"Di Pekon Kita Sendiri, Keringat dan Kejujuran Hari Ini Jadi Pembuka Jalan Rezeki Esok Hari."


Sub-Judul (Sub-headline):
Tidak ada lagi panen yang dibeli murah tanpa kejelasan, tidak ada lagi tetangga yang terpaksa berutang bunga tinggi, dan tidak ada lagi warga yang tertinggal karena fisik atau usia. Kami menyatukan langkah warga yang bepergian, hasil panen kebun, dan tenaga harian menjadi lingkaran rezeki yang saling menguatkan.
Tombol Aksi Utama (CTA 1):
Mulai Terlibat di Pekonmu (Aria-label: "Daftar dan mulai ambil peran di pekon")
Tombol Aksi Sekunder (CTA 2):
Lihat Cerita Warga yang Sudah Berdaya
Catatan Kenyamanan:
✓ Tanpa modal awal • ✓ Bisa diakses lewat ponsel apa saja • ✓ Didukung penuh pengurus desa (BUMDes)


SECTION 2: BERAPA YANG SUDAH TERBANTU & TERDAMPAK (SOCIAL PROOF)
Komponen: ImpactMetricsSection.tsx
Tujuan: Menghilangkan keraguan warga baru lewat transparansi capaian nyata dan keterlibatan komunitas di sekitar mereka.
Layout: Barisan 4 Kartu Metrik Berkontras Tinggi (Grid 4-Cols) dengan aksen warna hangat dan ikon yang mewakili manusia, bukan angka kering.
Kartu Metrik & Copywriting:

Metrik
Angka Tampilan (Dummy)
Label Dampak Nyata
Keterangan Pendukung bagi Pembaca
Keluarga Berdaya
3.840+
Warga Pekon Aktif Saling Menghidupi


Petani gurem, pekerja harian lepas, ibu rumah tangga, dan pemuda komuter yang setiap hari mendapatkan manfaat langsung.
Nilai Perputaran Rezeki
Rp 2,4 Miliar
Rezeki yang Tetap Berputar di Dalam Desa


Uang belanja, upah kerja harian, dan hasil bumi yang dinikmati oleh tetangga sendiri tanpa bocor ke pihak luar.
Permodalan Tanpa Beban
Rp 850 Juta
Modal Usaha Mandiri Tersalurkan Tanpa Jaminan Surat


Dipercaya oleh BUMDes langsung ke tangan warga berkat catatan kerja nyata, tanpa menahan sertifikat rumah atau BPKB.
Tingkat Kepercayaan Komunitas
99,4%
Serah Terima Kerja & Titipan Berjalan Tuntas


Setiap amanah diselesaikan dengan bukti kejujuran bersama tanpa sengketa dan tanpa kecurangan.

SECTION 3: BAGAIMANA PLATFORM MENGUBAH MASALAH MENJADI SOLUSI
Komponen: TransformationSection.tsx
Tujuan: Mengakui kelelahan dan kesulitan yang selama ini dirasakan masyarakat, lalu menunjukkan bagaimana kebiasaan harian warga sebenarnya adalah kunci jalan keluarnya.
Layout: Before & After Transformation Comparison Card (Tabel komparasi dua sisi dengan visual "Dulu Menjadi Beban Sendiri" vs "Kini Menjadi Kekuatan Bersama").
Copywriting Konten:
Tajuk Bagian:
"Mengubah Hal yang Dulu Menyulitkan Kita, Menjadi Sumber Kekuatan Baru Pekon."


Narasi Pengantar:
Selama bertahun-tahun, warga pekon menanggung biaya mahal sendirian—mulai dari ongkos ke pasar yang menguras kantong, hasil kebun yang dipermainkan pembeli luar, hingga sulitnya meminjam uang saat ada peluang usaha. Kami hadir bukan untuk menambah aturan baru, melainkan mengubah rutinitas yang sudah biasa kita lakukan menjadi jalan keluar bersama.
3 Titik Balik Utama:
Dari Perjalanan Kosong Menjadi Berkah Berkelanjutan:
Dulu: Sepeda motor mondar-mandir ke pasar kecamatan dengan bagasi kosong sementara tetangga bingung kirim barang.
Kini: Perjalanan rutin harian berubah menjadi penyambung kebutuhan tetangga sekaligus menutup biaya bensin.
Dari Keringat yang Terlupakan Menjadi Tiket Kepercayaan Modal:
Dulu: Bekerja serabutan bertahun-tahun tetap dianggap "tidak mampu pinjam" oleh bank umum karena tidak punya slip gaji formal.
Kini: Setiap pekerjaan kecil yang dituntaskan dengan jujur langsung tercatat sebagai bukti nama baik yang membuka pinjaman usaha BUMDes.
Dari Pintu Kerja yang Tertutup Menjadi Kesempatan yang Sama bagi Semua:
Dulu: Sahabat disabilitas, warga lansia, dan ibu rumah tangga sering kali dipandang sebelah mata di bursa kerja.
Kini: Kemampuan siapa pun dihargai setara, tugas langsung diterima tanpa rasa cemas ditolak.
SECTION 4: PENJABARAN DAMPAK BERDASARKAN MASALAH YANG DISELESAIKAN
Komponen: ImpactPillarsSection.tsx
Tujuan: Menjabarkan 5 masalah mendasar secara spesifik dengan menempatkan warga sebagai pahlawan yang merasakan perubahan nyata dalam hidupnya.
Layout: 5 Sub-Section bergantian arah (Alternating Layout kiri-kanan), dilengkapi kutipan dampak dari sudut pandang warga (User Persona Voices).
4.1. Masalah: Sulitnya Akses Modal Usaha & Jeratan Bunga Mencekik
Solusi Berdampak: Kemandirian Modal Usaha dari Bukti Kejujuran Kerja Nyata


Dampak yang Diterima Warga:
Warga tidak perlu lagi takut pada tengkulak uang gelap atau aplikasi pinjaman ilegal yang mempermalukan keluarga. Cukup dengan aktif membantu tetangga, menyelesaikan tugas harian, dan menjaga reputasi di pekon, BUMDes siap mempercayakan modal usaha produktif hingga Rp 1.500.000 tanpa agunan fisik sama sekali.
Suara Penerima Manfaat:"Dulu kalau mau tambah dagangan keripik bingung harus pinjam ke mana tanpa jaminan BPKB. Lewat catatan kerja nyata di sini, pengurus BUMDes sendiri yang datang menawarkan tambahan modal tanpa beban was-was."
— Ibu Siti (38 thn), Pengrajin Olahan Pekon


4.2. Masalah: Ongkos Kirim Mahal & Keterisolasian Wilayah Pekon
Solusi Berdampak: Saling Titip dan Saling Berbagi Ongkos di Setiap Jalur Perjalanan


Dampak yang Diterima Warga:
Warung kecil tidak perlu lagi tutup seharian hanya untuk belanja bahan pokok ke pasar pusat. Tetangga yang memang searah menuju pusat kota siap membawakan pesanan dengan biaya patungan bensin yang murah. Yang menitip hemat waktu dan biaya, yang mengantar pulang dengan uang saku tambahan.
Suara Penerima Manfaat:"Tiap pagi saya berangkat kerja dari Pagelaran Utara ke Pringsewu. Sekarang ada barang tetangga yang ikut saya bawa. Bensin motor terbayar penuh, tetangga pun tidak perlu keluar ongkos mahal naik ojek carteran."
— Rudi (26 thn), Warga Komuter Harian


4.3. Masalah: Panen Dipermainkan & Tengkulak Tidak Adil
Solusi Berdampak: Kepastian Pembeli Amanah dengan Timbangan Jujur dan Harga Terbuka


Dampak yang Diterima Warga:
Petani pisang, kelapa, dan singkong tidak lagi terjebak menjual hasil jerih payahnya secara tergesa-gesa di bawah harga pasar. Pengepul lokal yang beretika terdaftar dengan jelas, penawaran harga bersaing secara sehat, dan petani menikmati hasil jerih payahnya secara utuh.
Suara Penerima Manfaat:"Tidak ada lagi permainan timbangan curang. Kami tahu siapa pembeli yang jujur dari rekomendasi sesama warga pekon. Hasil panen kebun sekarang terasa benar berkahnya."
— Pak Sukardi (54 thn), Petani Gurem Pekon


4.4. Masalah: Hambatan Kerja bagi Saudara Disabilitas, Lansia, & Ibu Rumah Tangga
Solusi Berdampak: Hak Bekerja yang Terbuka Lebar Tanpa Penolakan Fisik


Dampak yang Diterima Warga:
Setiap orang memiliki keterampilan yang dibutuhkan desa—mulai dari menyortir bibit tanaman, mengemas produk, hingga mengupas bahan baku. Melalui komitmen tanpa diskriminasi, tugas yang ramah disabilitas langsung terkunci untuk diambil pekerja berkebutuhan khusus tanpa rasa cemas akan ditolak oleh pemberi kerja.
Suara Penerima Manfaat:"Dulu sering ditolak karena kondisi fisik saya. Di sini, saat saya klik siap bekerja, pekerjaan itu langsung aman jadi milik saya. Saya bisa berpenghasilan mandiri dan merasa dihargai di kampung sendiri."
— Ahmad (31 thn), Pekerja Berdaya Pekon


4.5. Masalah: Balita Kurang Nutrisi & Ancaman Pertumbuhan Anak (Stunting)
Solusi Berdampak: Setiap Butir Keringat Berubah Menjadi Lauk Bergizi di Meja Makan


Dampak yang Diterima Warga:
Poin kebaikan yang dikumpulkan warga tidak cuma tersimpan sebagai angka. Bagi keluarga yang memiliki balita, poin kerja dapat langsung ditukarkan dengan paket telur segar, ikan nila kolam pekon, dan sayur segar dari petani tetangga. Anak tumbuh kuat dan sehat dari pangan yang dihasilkan tanahnya sendiri.
Suara Penerima Manfaat:"Poin hasil bantu-bantu kemarin langsung saya tukar sepaket telur ayam dan ikan nila segar buat anak balita saya. Senang sekali, keringat sendiri bisa langsung jadi gizi anak."
— Ibu Nita (29 thn), Ibu Rumah Tangga


SECTION 5: BAGAIMANA ANDA DIBAYAR (SISTEM POIN & TAHAPAN REDEEM)
Komponen: HowYouEarnSection.tsx
Tujuan: Menjelaskan sistem penghargaan secara transparan dan manusiawi; membuktikan bahwa setiap kontribusi warga berharga dan cair tanpa syarat berbelit.
Layout: Interactive Stepper / Horizontal Progress Card (4 Langkah Alur Pembayaran & Penukaran Manfaat).
Copywriting Konten:
Tajuk Bagian:
"Mudah, Jelas, dan Langsung Terasa: Bagaimana Jerih Payahmu Berbuah Kesejahteraan."


Sub-Tajuk:
Setiap kali kamu menyelesaikan titipan, menuntaskan tugas, atau berbagi kebaikan, sistem mencatatnya secara instan ke dalam dompet wargamu.
4 Langkah Menikmati Hasil:



Plaintext
[ 1. Selesaikan Tugas ] ───> [ 2. Bukti Senyum Warga ] ───> [ 3. Saldo & Poin Masuk ] ───> [ 4. Tukar Sesuai Kebutuhan ]


Langkah 1: Ambil Peran Sesuai Waktu dan Kemampuanmu
Pilih titipan belanja saat kamu hendak ke pasar, ambil tugas harian di warung tetangga, atau tawarkan hasil panen kebunmu. Kamu yang tentukan kapan dan di mana kamu ingin bergerak.
Langkah 2: Senyum Bersama Sebagai Bukti Amanah Tuntas
Saat serah terima barang atau tugas selesai, cukup ambil foto senyum bersama tetangga secara langsung. Foto ini menjadi bukti kejujuran bersama bahwa amanah telah sampai tanpa ada yang dirugikan.
Langkah 3: Poin Reputasi & Uang Komisi Terisi Otomatis
Detik itu juga, upah harian dan poin reputasimu langsung bertambah. Semuanya tercatat aman, transparan, dan dapat kamu periksa setiap saat.
Langkah 4: Nikmati Kemanfaatannya Sesuai Kebutuhan Keluarga
Pilihan selalu ada di tanganmu:
Tarik Uang Tunai/Pulsa: Untuk kebutuhan dapur dan uang saku harian.
Tukar Paket Gizi Pekon: Bawa pulang telur dan ikan segar untuk asupan buah hati.
Kumpulkan Jadi Pintu Modal: Poin reputasimu otomatis membuka peluang modal usaha Rp 1.500.000 dari BUMDes tanpa beban agunan.
SECTION 6: FAQ "SEBELUM KAMU BERGABUNG"
Komponen: FaqSection.tsx
Tujuan: Menjawab keraguan, kekhawatiran orang awam di desa, dan membedakan platform ini dari aplikasi komersial perkotaan yang rumit.
Layout: Accordion List yang lebar, teks jelas, ramah screen-reader (aria-expanded).
Tanya Jawab Terpilih:
T: Apakah saya harus memiliki ponsel mahal atau kuota besar untuk ikut terlibat?
J: Sama sekali tidak. Platform ini dibuat sangat ringan untuk ponsel spesifikasi apa pun dan tetap berjalan lancar meski sinyal di pekon sedang lemah. Untuk warga yang belum terbiasa dengan aplikasi, ada layanan panduan mudah melalui pesan WhatsApp biasa.
T: Saya penyandang disabilitas atau sudah lanjut usia, apakah benar-benar ada kesempatan kerja untuk saya?
J: Tentu saja. Sistem kami memiliki aturan khusus di mana pekerjaan yang ramah disabilitas dan lansia akan diprioritaskan untukmu. Begitu kamu mengambilnya, pekerjaan tersebut langsung terkunci untukmu tanpa bisa dibatalkan atau ditolak sepihak oleh pemberi kerja.
T: Bagaimana cara mendapatkan pinjaman modal usaha BUMDes Rp 1.500.000 tanpa jaminan sertifikat atau BPKB?
J: Di platform ini, jaminanmu adalah rekam jejak kerja nyatamu sendiri. Setiap kali kamu berhasil membantu mengantar barang, menyelesaikan pekerjaan harian, atau bertransaksi panen secara jujur, skor reputasimu meningkat otomatis. Ketika skor mencapai batas kelayakan, pengurus BUMDes akan langsung memverifikasi pencairan modal usahamu.
T: Siapa yang menjamin barang titipan saya aman saat dibawa oleh warga yang searah?
J: Semua warga yang membawa barang telah diverifikasi identitas kependudukannya di pekon setempat. Serah terima barang diwajibkan menggunakan verifikasi foto bersama langsung di lokasi. Kejujuran kurir warga diawasi oleh komunitas dan menentukan nama baiknya sendiri di pekon.
T: Apakah uang dan poin yang saya dapatkan bisa hangus?
J: Tidak pernah. Poin dan saldo komisi yang kamu kumpulkan adalah hak mutlak atas keringatmu. Kamu bebas mencairkannya kapan saja atau menukarkannya dengan paket pangan sehat untuk keluargamu.
SECTION 7: FOOTER (GOTONG ROYONG & AKSESIBILITAS PEKON)
Komponen: LandingFooter.tsx
Tujuan: Menegaskan komitmen inklusi sosial, kemitraan pemerintah pekon, dan keterbukaan layanan bagi siapa pun.
Layout: Multi-Column Clean Footer dengan latar gelap hangat (stone-900) dan kontras teks tinggi (stone-100).
Elemen Isi Footer:
Kolom 1 — Identitas & Misi:
JEJARING-SEWU (SINERGI-PEKON)
Gerakan ekonomi sirkular dari warga, oleh warga, untuk kemandirian pekon di Kabupaten Pringsewu. Berakar pada gotong royong, bermuara pada kesejahteraan yang merata.
Kolom 2 — Ruang Keberdayaan:
Saling Titip Searah (Komuter Pekon)
Bursa Kerja Ramah Inklusi
Panen Terpercaya Petani
Modal Usaha Mandiri BUMDes
Paket Gizi Balita Sehat
Kolom 3 — Layanan Warga & Pendampingan:
Pos Bantuan BUMDes Pekon Setempat
Panduan Melalui WhatsApp Pekon
Standar Aksesibilitas Pembaca Layar (TalkBack Compatible)
Laporkan Kendala / Aduan Warga
Baris Bawah (Hak Cipta & Semangat):
“Ditenun bersama oleh Masyarakat Pekon Pringsewu. Tanpa diskriminasi, tanpa rasa takut, tumbuh bersama.”


3. Contoh Implementasi Kode Komponen Next.js (Web/src/)
Berikut adalah cetak biru kode pada file utama Web/src/app/(marketing)/page.tsx yang merangkai seluruh section di atas dengan penerapan token desain dan aksesibilitas ramah pembaca layar:



TypeScript
// Web/src/app/(marketing)/page.tsx
import React from 'react';
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
    'Ekosistem mandiri warga pekon: saling titip perjalanan, bursa kerja tanpa diskriminasi, kepastian panen, dan modal usaha BUMDes tanpa agunan.',
};

export default function LandingPage() {
  return (
    <main
      id="main-content"
      role="main"
      className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900"
    >
      {/* 1. Perkenalan Platform */}
      <HeroSection />

      {/* 2. Berapa yang Sudah Terbantu & Terdampak */}
      <ImpactMetricsSection />

      {/* 3. Bagaimana Mengubah Masalah Menjadi Solusi */}
      <TransformationSection />

      {/* 4. Penjabaran Dampak Per Masalah Nyata */}
      <ImpactPillarsSection />

      {/* 5. Alur Bagaimana Anda Dibayar & Sistem Poin */}
      <HowYouEarnSection />

      {/* 6. FAQ Sebelum Bergabung */}
      <FaqSection />

      {/* 7. Footer Gotong Royong */}
      <LandingFooter />
    </main>
  );
}


4. Keunggulan Strategis untuk Kebutuhan Penjurian Lomba
Bebas Jargon Kering: Tidak ada kata-kata rumit seperti "Fitur PostGIS" atau "Row-Level Lock" yang membingungkan warga awam; semua diterjemahkan menjadi "Perjalanan Searah yang Menutup Biaya Bensin" dan "Hak Kerja yang Langsung Aman Tanpa Takut Ditolak".
Keterikatan Emosional & Dampak Sosial: Setiap angka dan alur langsung menyentuh 3 isu strategis daerah (pengentasan kemiskinan ekstrem, pemberdayaan disabilitas/PEKKA, dan pencegahan stunting balita).
Kesiapan Aksesibilitas Nyata: Dokumen layout ini telah menyertakan atribut ARIA deklaratif, rasio kontras warna tinggi, serta keramahan bagi pengguna screen-reader (TalkBack) sehingga dewan juri melihat kepedulian mendalam pada prinsip kesetaraan teknologi.
