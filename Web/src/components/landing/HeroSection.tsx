"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, FileText, Shield, CheckCircle2, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-28 bg-[#0F1416]">
      {/* Handshake Background Image (from Figma Photo Handshake #1:44) */}
      <div className="absolute inset-x-0 -top-[360px] z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="relative flex items-center justify-center w-full h-full  opacity-40">
          <Image
            src="/Bg demo.png"
            alt="Gotong Royong Pekon"
            width={1000}
            height={1000}
            priority
            className="object-cover md:object-contain object-center"
          />
          {/* Gradient Overlays to blend with #0F1416 */}

        </div>
      </div>


      {/* Main Content with relative z-10 */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-32 text-center space-y-8">

        {/* Bold Punchy Typography (#1:68) */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.025em] text-[#DFE2EB] leading-[1.18]">
            Satu Sistem Pekon.
            <br />
            <span className="bg-gradient-to-r from-[#C1FFDD] via-[#00F2A9] to-[#4EDEA3] bg-clip-text text-transparent">
              Semua Hak Warga Berdaya.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#B9CBBF] leading-relaxed max-w-[728px] mx-auto pt-2">
            Ubah cara perputaran rupiah, timbangan hasil bumi, dan gotong royong antar warga. Transparan, terdesentralisasi, tanpa potongan rentenir, dan langsung cair ke kas mandiri.
          </p>
        </div>

        {/* Action Cluster (#1:73) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          {/* Primary CTA (#1:74) */}
          <a
            href="#solusi-lapangan"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-[#00F2A9] px-6 py-3 text-xs sm:text-sm font-medium text-[#006947] shadow-[0px_4px_15px_rgba(0,242,169,0.25)] hover:bg-[#4EDEA3] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#00F2A9]"
          >
            <span>Mulai Terlibat di Pekon</span>
            <ArrowRight className="h-4 w-4" />
          </a>

          {/* Secondary CTA (#1:79) */}
          <a
            href="#infrastruktur"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-[#3B4A41]/60 bg-[#1C2026] hover:bg-[#262A31] hover:border-[#C1FFDD]/30 px-5 py-3 text-xs sm:text-sm font-medium text-[#DFE2EB] transition-all focus:outline-none focus:ring-1 focus:ring-[#C1FFDD]"
          >
            <FileText className="h-4 w-4 text-[#C1FFDD]" />
            <span>Lihat Carta Warga</span>
          </a>
        </div>

        {/* System Trust Badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#84958A]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#00F2A9]" />
            <span>Tanpa Biaya Admin</span>
          </div>
          <span className="text-[#3B4A41]">•</span>
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-[#00F2A9]" />
            <span>Pencatatan Realtime Instan</span>
          </div>
          <span className="text-[#3B4A41]">•</span>
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-[#00F2A9]" />
            <span>Didukung BUMDes Pekon</span>
          </div>
        </div>

      </div>
    </section>
  );
}
