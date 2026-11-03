"use client";

import React from "react";
import { TrendingUp, Coins, ShieldCheck, CheckCircle2 } from "lucide-react";

const REGIONS = [
  "Adiluwih",
  "Ambarawa",
  "Banyumas",
  "Gading Rejo",
  "Pagelaran",
  "Pagelaran Utara",
  "Pardasuka",
  "Pringsewu",
  "Sukoharjo",
];

export function ImpactMetricsSection() {
  return (
    <section
      id="impact-metrics"
      aria-labelledby="metrics-heading"
      className="bg-white dark:bg-[#0F1416] border-y border-slate-200 dark:border-[#3B4A41]/30 py-16 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-16 lg:px-20 space-y-16">

        {/* Accessibility Announcement for Screen Readers */}
        <h2 id="metrics-heading" className="sr-only">
          Metrik Dampak Ekonomi dan Jangkauan Wilayah Pekon
        </h2>

        {/* Metrics Strip (#1:84) - Fully Accessible with Tab Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-[#3B4A41]/30">

          {/* Column 1: Keluarga Berdaya */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Metrik Keluarga Berdaya: 3.840 lebih keluarga, naik 18 persen bulan ini"
            className="py-6 sm:py-3 sm:px-6 flex flex-col justify-between space-y-2 rounded-lg hover:bg-slate-50/80 dark:hover:bg-[#151C1E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416] transition-all cursor-default"
          >
            <span className="text-[10px] font-mono tracking-[0.05em] uppercase text-slate-500 dark:text-[#84958A]">
              KELUARGA BERDAYA
            </span>
            <div className="text-3xl w-fit sm:text-4xl font-semibold tracking-[-0.012em] text-slate-900 dark:text-[#DFE2EB]">
              3.840+
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-[#4EDEA3]">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+18% bln ini</span>
            </div>
          </div>

          {/* Column 2: Dana Berputar */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Metrik Dana Berputar: Rp 2,4 Miliar di Pekon Mandiri"
            className="py-6 sm:py-3 sm:px-6 flex flex-col justify-between space-y-2 rounded-lg hover:bg-slate-50/80 dark:hover:bg-[#151C1E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416] transition-all cursor-default"
          >
            <span className="text-[10px] font-mono tracking-[0.05em] uppercase text-slate-500 dark:text-[#84958A]">
              DANA BERPUTAR
            </span>
            <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.012em] text-slate-900 dark:text-[#DFE2EB]">
              Rp 2,4 M
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 dark:text-[#C1FFDD]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Pekon mandiri</span>
            </div>
          </div>

          {/* Column 3: Modal Mandiri */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Metrik Modal Mandiri: Rp 850 Juta tanpa agunan"
            className="py-6 sm:py-3 sm:px-6 flex flex-col justify-between space-y-2 rounded-lg hover:bg-slate-50/80 dark:hover:bg-[#151C1E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416] transition-all cursor-default"
          >
            <span className="text-[10px] font-mono tracking-[0.05em] uppercase text-slate-500 dark:text-[#84958A]">
              MODAL MANDIRI
            </span>
            <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.012em] text-slate-900 dark:text-[#DFE2EB]">
              Rp 850 Jt
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-[#B9CBBF]">
              <Coins className="h-3.5 w-3.5" />
              <span>Tanpa agunan</span>
            </div>
          </div>

          {/* Column 4: Tingkat Amanah */}
          <div
            tabIndex={0}
            role="region"
            aria-label="Metrik Tingkat Amanah: 99,4 persen dengan 0 sengketa"
            className="py-6 sm:py-3 sm:px-6 flex flex-col justify-between space-y-2 rounded-lg hover:bg-slate-50/80 dark:hover:bg-[#151C1E]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416] transition-all cursor-default"
          >
            <span className="text-[10px] font-mono tracking-[0.05em] uppercase text-slate-500 dark:text-[#84958A]">
              TINGKAT AMANAH
            </span>
            <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.012em] text-emerald-600 dark:text-[#C1FFDD]">
              99,4%
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-[#4EDEA3]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>0 sengketa</span>
            </div>
          </div>

        </div>

        {/* Infinite Scroll / Marquee Section (#1:145) */}
        <div className="pt-6 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.012em] text-slate-900 dark:text-[#DFE2EB] transition-colors">
              Seluruh Daerah Terimplementasikan
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#84958A] font-mono">
              Jejaring 9 Kecamatan & Pekon Mandiri Terverifikasi Kabupaten Pringsewu
            </p>
          </div>

          {/* Interactive Marquee Container with Accessible Pause on Hover/Focus */}
          <div className="group relative flex overflow-hidden py-4 select-none">
            {/* Gradient Mask Overlays (Adaptive Light & Dark) */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white dark:from-[#0F1416] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white dark:from-[#0F1416] to-transparent z-10 pointer-events-none" />

            {/* Marquee Track 1 (Interactive & Tab Accessible) */}
            <div className="flex shrink-0 items-center justify-around gap-4 sm:gap-6 min-w-full animate-marquee motion-reduce:animate-none group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
              {REGIONS.map((region, index) => (
                <div
                  key={`track-1-${index}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`Daerah terimplementasi: Kecamatan ${region}, Pringsewu`}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200 dark:border-[#3B4A41]/60 bg-slate-50/90 dark:bg-[#1C2026]/90 text-xs sm:text-sm font-medium text-slate-800 dark:text-white/90 shadow-sm hover:border-emerald-500 dark:hover:border-[#00F2A9] hover:text-emerald-600 dark:hover:text-[#00F2A9] hover:bg-emerald-50/50 dark:hover:bg-[#151C1E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416] transition-all cursor-pointer"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-[#00F2A9] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-[#00F2A9]"></span>
                  </span>
                  <span className="font-sans font-medium tracking-tight">Kecamatan {region}</span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-[#4EDEA3] bg-emerald-100/80 dark:bg-[#00A572]/20 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    Aktif
                  </span>
                </div>
              ))}
            </div>

            {/* Marquee Track 2 (Cloned for Infinite Loop, Hidden from Screen Reader / Tab to Prevent Duplication) */}
            <div
              aria-hidden="true"
              className="flex shrink-0 items-center justify-around gap-4 sm:gap-6 min-w-full animate-marquee motion-reduce:animate-none group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            >
              {REGIONS.map((region, index) => (
                <div
                  key={`track-2-${index}`}
                  tabIndex={-1}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200 dark:border-[#3B4A41]/60 bg-slate-50/90 dark:bg-[#1C2026]/90 text-xs sm:text-sm font-medium text-slate-800 dark:text-white/90 shadow-sm hover:border-emerald-500 dark:hover:border-[#00F2A9] hover:text-emerald-600 dark:hover:text-[#00F2A9] hover:bg-emerald-50/50 dark:hover:bg-[#151C1E] transition-all select-none cursor-pointer"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-[#00F2A9] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-[#00F2A9]"></span>
                  </span>
                  <span className="font-sans font-medium tracking-tight">Kecamatan {region}</span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-[#4EDEA3] bg-emerald-100/80 dark:bg-[#00A572]/20 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    Aktif
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
