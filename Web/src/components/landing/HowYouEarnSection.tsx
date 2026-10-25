"use client";

import React from "react";
import { FileText, ArrowRight, ShieldCheck, Check } from "lucide-react";

export function HowYouEarnSection() {
  return (
    <section id="ekonomi-terbuka" className="bg-[#0F1416] py-24 border-t border-[#3B4A41]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-16 lg:px-20 space-y-16">

        {/* Section Header (#1:304) */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-semibold text-[#84958A] tracking-wider uppercase">
            EKONOMI TERBUKA
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[#DFE2EB] leading-tight">
            Hasil Keringatmu Utuh.
            <br />
            <span className="text-[#C1FFDD]">
              Kas Terbuka Sampai Rupiah Terakhir.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#B9CBBF] max-w-2xl leading-relaxed">
            Semua aliran kas diproses bertahap dengan pencatatan terenkripsi yang bisa dicek bersama.
          </p>
        </div>

        {/* 2-Column Grid (#1:310) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: 4-Step Interactive Pipeline (#1:311) */}
          <div className="lg:col-span-6 space-y-3">

            {/* Step 1 */}
            <div className="rounded-lg border border-[#3B4A41]/40 bg-[#1C2026] p-4 flex items-center justify-between hover:border-[#00F2A9]/40 transition-colors">
              <div className="space-y-1">
                <span className="inline-block rounded bg-[#262A31] px-2 py-0.5 font-mono text-[11px] font-medium text-[#C1FFDD]">
                  1. RESERVASI
                </span>
                <h3 className="text-sm font-semibold text-[#DFE2EB]">
                  Kebutuhan Dicatat
                </h3>
              </div>
              <span className="font-mono text-xs text-[#B9CBBF]">
                estimate.hold()
              </span>
            </div>

            {/* Step 2 */}
            <div className="rounded-lg border border-[#3B4A41]/40 bg-[#1C2026] p-4 flex items-center justify-between hover:border-[#00F2A9]/40 transition-colors">
              <div className="space-y-1">
                <span className="inline-block rounded bg-[#262A31] px-2 py-0.5 font-mono text-[11px] font-medium text-[#4EDEA3]">
                  2. EKSEKUSI
                </span>
                <h3 className="text-sm font-semibold text-[#DFE2EB]">
                  Kerja Selesai Lapangan
                </h3>
              </div>
              <span className="font-mono text-xs text-[#4EDEA3]">
                verified.stream()
              </span>
            </div>

            {/* Step 3 */}
            <div className="rounded-lg border border-[#3B4A41]/40 bg-[#1C2026] p-4 flex items-center justify-between hover:border-[#00F2A9]/40 transition-colors">
              <div className="space-y-1">
                <span className="inline-block rounded bg-[#262A31] px-2 py-0.5 font-mono text-[11px] font-medium text-[#7BD0FF]">
                  3. VERIFIKASI
                </span>
                <h3 className="text-sm font-semibold text-[#DFE2EB]">
                  Timbangan & Kualitas
                </h3>
              </div>
              <span className="font-mono text-xs text-[#C4E7FF]">
                settle.audit()
              </span>
            </div>

            {/* Step 4 - Active Finish */}
            <div className="rounded-lg border border-[#C1FFDD]/40 bg-[#1C2026] p-4 flex items-center justify-between shadow-[0_0_15px_rgba(0,242,169,0.15)]">
              <div className="space-y-1">
                <span className="inline-block rounded bg-[#262A31] px-2 py-0.5 font-mono text-[11px] font-medium text-[#00F2A9]">
                  4. BAGI HASIL
                </span>
                <h3 className="text-sm font-semibold text-[#C1FFDD]">
                  Cair ke Kas Mandiri
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold text-[#00F2A9]">
                0% fee perantara
              </span>
            </div>

          </div>

          {/* Right Column: Realtime Receipt Card (#1:340) */}
          <div className="lg:col-span-6 rounded-lg border border-[#3B4A41]/40 bg-[#151C1E]/90 backdrop-blur-md p-6 space-y-5 shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#3B4A41]/30 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#C1FFDD]" />
                <span className="font-mono text-xs sm:text-sm font-bold text-[#DFE2EB]">
                  Bukti Realtime Penjualan Kopi #KP-9021
                </span>
              </div>
              <span className="rounded bg-[#00F2A9]/15 border border-[#00F2A9]/30 px-2 py-0.5 font-mono text-[10px] font-bold text-[#00F2A9] uppercase">
                LUNAS
              </span>
            </div>

            {/* Line Items */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-[#B9CBBF]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C1FFDD]" />
                  <span>Hasil Panen Kopi Petik Merah (85kg):</span>
                </div>
                <span className="font-semibold text-[#DFE2EB]">Rp 3.400.000</span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-[#3B4A41]/20">
                <div className="flex items-center gap-2 text-[#B9CBBF]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4EDEA3]" />
                  <span>Ongkos Angkut Pikap Terkoordinir:</span>
                </div>
                <span className="font-semibold text-[#4EDEA3]">- Rp 45.000</span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-[#3B4A41]/20">
                <div className="flex items-center gap-2 text-[#B9CBBF]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#84958A]" />
                  <span>Iuran Gotong Royong Perawatan Jalan:</span>
                </div>
                <span className="font-semibold text-[#84958A]">- Rp 10.000</span>
              </div>

              <div className="flex items-center justify-between py-1 border-t border-[#3B4A41]/20">
                <div className="flex items-center gap-2 text-[#B9CBBF]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00F2A9]" />
                  <span>Potongan Rentenir / Calo:</span>
                </div>
                <span className="font-semibold text-[#00F2A9]">Rp 0 (0%)</span>
              </div>
            </div>

            {/* Total Footer Box (#1:376) */}
            <div className="rounded border border-[#C1FFDD]/30 bg-[#1C2026] p-4 flex items-center justify-between">
              <div>
                <span className="block font-mono text-[10px] text-[#84958A] uppercase tracking-wider">
                  TOTAL BERSIH DITERIMA
                </span>
                <span className="font-mono text-xs text-[#DFE2EB]">
                  Bersih Diterima Petani:
                </span>
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#C1FFDD]">
                Rp 3.345.000
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
