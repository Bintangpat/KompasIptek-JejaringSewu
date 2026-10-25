"use client";

import React from "react";
import { Camera, MapPin, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Scale, Car, Users, Coins } from "lucide-react";

export function TransformationSection() {
  return (
    <section id="infrastruktur" className="bg-[#0F1416] py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-16 lg:px-20 space-y-16">

        {/* Section Header (#1:151) */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5">
            <span className="font-mono text-xs font-semibold text-[#4EDEA3] tracking-wider uppercase">
              Infrastruktur
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.015em] text-[#DFE2EB]">
            Masalah yang kami coba selesaikan
          </h2>
          <p className="text-xs sm:text-sm text-[#B9CBBF] max-w-2xl leading-relaxed">
            Perbandingan langsung sistem konvensional rentan calo vs otomatisasi jejaring terbuka.
          </p>
        </div>

        {/* Technical Comparison Bento Cards (#1:159) */}
        <div className="grid grid-cols-1 grid-rows-1 md:grid-rows-3 md:grid-cols-3 gap-4">

          {/* Card 1: Nebeng-Jastip Searah (#1:176) */}
          <div className="rounded-lg row-span-2 border border-[#3B4A41]/40 bg-[#151C1E] p-6 flex flex-col justify-between space-y-4 backdrop-blur-md hover:border-[#00F2A9]/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#3B4A41]/30 pb-3">
                <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.0075em] text-[#DFE2EB] flex items-center gap-2">
                  <Car className="h-5 w-5 text-[#00F2A9]" />
                  Nebeng-Jastip Searah
                </h3>
              </div>
              <p className="text-xs font-mono text-[#B9CBBF] leading-relaxed">
                Saling titip bagasi & nebeng searah terverifikasi GPS rute. Bagi ongkos otomatis via smart-ledger, memangkas BBM 65% dan menghapus carter mahal mobil sayur kosong.
              </p>
            </div>

            {/* Comparison Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <div className="rounded bg-[#262A31]/40 border border-[#3B4A41]/20 p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-red-400 font-mono text-[11px] font-semibold">
                  <XCircle className="h-3 w-3 shrink-0" />
                  <span>Pola Lama</span>
                </div>
                <p className="text-[10px] font-mono text-[#B9CBBF] leading-tight">
                  Carter Rp150rb/rit, muatan balik kosong.
                </p>
              </div>

              <div className="rounded bg-[#1C2026] border border-[#C1FFDD]/20 p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#C1FFDD] font-mono text-[11px] font-semibold">
                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                  <span>Peer Fleet</span>
                </div>
                <p className="text-[10px] font-mono text-[#DFE2EB] leading-tight">
                  Bagi ongkos P2P, hemat BBM 65%.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Skor Kredit Alternatif AHP-TOPSIS & BUMDes (#1:221) - Span 2 Columns */}
          <div className="md:col-span-2 rounded-lg border border-[#3B4A41]/40 bg-[#151C1E] p-6 flex flex-col justify-between space-y-4 backdrop-blur-md hover:border-[#00F2A9]/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#3B4A41]/30 pb-3">
                <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.0075em] text-[#DFE2EB] flex items-center gap-2">
                  <Coins className="h-5 w-5 text-[#C1FFDD]" />
                  Skor Kredit Alternatif AHP-TOPSIS (S_kredit) & BUMDes
                </h3>
              </div>
              <p className="text-xs font-mono text-[#B9CBBF] leading-relaxed">
                Algoritma multi-kriteria berbasis riwayat amanah gotong royong dan kontribusi riil—bukan sertifikat tanah atau BI-checking. Rekomendasi modal usaha produktif BUMDes bunga 0% hingga Rp 1.500.000 cair tanpa sita jaminan.
              </p>
            </div>

            {/* 3 Metric Parameter Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <div className="rounded bg-[#1C2026] border border-[#3B4A41]/30 p-2.5">
                <span className="block text-[10px] font-mono text-[#84958A] uppercase tracking-wider">
                  METODE HITUNG
                </span>
                <span className="block text-xs font-mono font-semibold text-[#C1FFDD] mt-1">
                  AHP-TOPSIS Weighted
                </span>
              </div>

              <div className="rounded bg-[#1C2026] border border-[#3B4A41]/30 p-2.5">
                <span className="block text-[10px] font-mono text-[#84958A] uppercase tracking-wider">
                  PLAFON TANPA AGUNAN
                </span>
                <span className="block text-xs font-mono font-semibold text-[#DFE2EB] mt-1">
                  Rp 500rb - Rp 1.500.000
                </span>
              </div>

              <div className="rounded bg-[#1C2026] border border-[#C1FFDD]/30 p-2.5">
                <span className="block text-[10px] font-mono text-[#84958A] uppercase tracking-wider">
                  STATUS BUNGA
                </span>
                <span className="block text-xs font-mono font-semibold text-[#00F2A9] mt-1">
                  0% Riba • Kas BUMDes
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Selfie Proof-of-Work (PoW) (#1:160) - High Contrast Signature Card */}
          <div className="rounded-lg bg-[#00F2A9] p-6 text-[#151C1E] flex flex-col justify-between space-y-4 shadow-xl hover:shadow-[0_0_20px_rgba(0,242,169,0.3)] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#151C1E]/20 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-[#151C1E]" />
                  <h3 className="text-lg font-semibold tracking-tight text-[#151C1E]">
                    Selfie Proof-of-Work (PoW)
                  </h3>
                </div>
              </div>
              <p className="text-xs font-mono text-[#151C1E]/90 leading-relaxed">
                Validasi penyelesaian tugas dan serah terima komoditas melalui snapshot kamera presisi tinggi ber-timestamp geolokasi langsung ke buku kas digital instan.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] font-mono font-semibold border-t border-[#151C1E]/15">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>GPS & Timestamp Signed</span>
              </div>
              <span className="uppercase tracking-wider">LEDGER INSTAN</span>
            </div>
          </div>

          {/* Card 4: Mini-Job Zero-Discrimination (#1:196) */}
          <div className="rounded-lg md:row-span-2 border border-[#3B4A41]/40 bg-[#151C1E] p-6 flex flex-col justify-between space-y-4 backdrop-blur-md hover:border-[#00F2A9]/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#3B4A41]/30 pb-3">
                <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.0075em] text-[#DFE2EB] flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#4EDEA3]" />
                  Mini-Job Zero-Discrimination
                </h3>
              </div>
              <p className="text-xs font-mono text-[#B9CBBF] leading-relaxed">
                Penyerapan kerja mikro (sortir kopi, kupas kelapa, anyaman) fleksibel bagi ibu rumah tangga, lansia, & difabel tanpa batasan usia kaku atau ijazah formal.
              </p>
            </div>

            <div className="rounded bg-[#1C2026] border border-[#3B4A41]/30 p-3 flex items-center justify-between text-xs font-mono">
              <span className="text-[#84958A]">Kriteria Perekrutan:</span>
              <span className="text-[#C1FFDD] font-semibold">100% Inklusif Tanpa Tolak</span>
            </div>
          </div>

          {/* Card 5: Bursa Hasil Bumi & Pengepul (#1:201) - Span 1 or 2 Columns */}
          <div className="md:col-span-2 rounded-lg border border-[#3B4A41]/40 bg-[#151C1E] p-6 flex flex-col justify-between space-y-4 backdrop-blur-md hover:border-[#00F2A9]/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#3B4A41]/30 pb-3">
                <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.0075em] text-[#DFE2EB] flex items-center gap-2">
                  <Scale className="h-5 w-5 text-[#00F2A9]" />
                  Bursa Hasil Bumi & Pengepul
                </h3>
              </div>
              <p className="text-xs font-mono text-[#B9CBBF] leading-relaxed">
                Bypass tengkulak nakal dengan timbangan digital terkalibrasi dan transparansi harga acuan pasar harian. Reputasi pengepul terverifikasi rating gotong-royong.
              </p>
            </div>

            {/* Comparison Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <div className="rounded bg-[#262A31]/40 border border-[#3B4A41]/20 p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-red-400 font-mono text-[11px] font-semibold">
                  <XCircle className="h-3 w-3 shrink-0" />
                  <span>Tengkulak</span>
                </div>
                <p className="text-[10px] font-mono text-[#B9CBBF] leading-tight">
                  Sunat timbangan 8-15%, monopoli harga.
                </p>
              </div>

              <div className="rounded bg-[#1C2026] border border-[#4EDEA3]/20 p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#4EDEA3] font-mono text-[11px] font-semibold">
                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                  <span>Acuan Sah</span>
                </div>
                <p className="text-[10px] font-mono text-[#DFE2EB] leading-tight">
                  Bluetooth BUMDes, presisi 100%.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
