"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, FileText } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-28 bg-slate-50 dark:bg-[#0F1416] transition-colors">
      {/* Background Radial Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 h-[480px] w-[750px] rounded-full bg-emerald-500/10 dark:bg-[#00F2A9]/10 blur-[140px] pointer-events-none" />

      {/* Handshake Background Image */}
      <div className="absolute inset-x-0 -top-[360px] z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="relative flex items-center justify-center w-full h-full opacity-20 dark:opacity-40 transition-opacity">
          <Image
            src="/Bg demo.png"
            alt="Gotong Royong Pekon"
            width={1000}
            height={1000}
            priority
            className="object-cover md:object-contain object-center"
          />
        </div>
      </div>

      {/* Main Content with relative z-10 */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 text-center space-y-8">

        {/* Bold Punchy Typography (#1:68) */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.025em] text-slate-900 dark:text-[#DFE2EB] leading-[1.18] transition-colors">
            Satu Sistem Pekon.
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-[#C1FFDD] dark:via-[#00F2A9] dark:to-[#4EDEA3] bg-clip-text text-transparent">
              Semua Hak Warga Berdaya.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-[#B9CBBF] leading-relaxed max-w-[728px] mx-auto pt-2 transition-colors">
            Ubah cara perputaran rupiah, timbangan hasil bumi, dan gotong royong antar warga. Transparan, terdesentralisasi, tanpa potongan rentenir, dan langsung cair ke kas mandiri.
          </p>
        </div>

        {/* Action Cluster (#1:73) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          {/* Primary CTA (#1:74) */}
          <a
            href="#solusi-lapangan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 dark:bg-[#00F2A9] dark:hover:bg-[#4EDEA3] dark:text-[#006947] px-6 py-3 text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-500/20 dark:shadow-[0px_4px_15px_rgba(0,242,169,0.25)] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416]"
          >
            <span>Mulai Terlibat di Pekon</span>
            <ArrowRight className="h-4 w-4" />
          </a>

          {/* Secondary CTA (#1:79) */}
          <a
            href="#infrastruktur"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-[#3B4A41]/60 bg-white hover:bg-slate-100 text-slate-800 dark:bg-[#1C2026] dark:hover:bg-[#262A31] dark:hover:border-[#C1FFDD]/30 dark:text-[#DFE2EB] px-5 py-3 text-xs sm:text-sm font-medium shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416]"
          >
            <FileText className="h-4 w-4 text-emerald-600 dark:text-[#C1FFDD]" />
            <span>Lihat Carta Warga</span>
          </a>
        </div>

      </div>
    </section>
  );
}
