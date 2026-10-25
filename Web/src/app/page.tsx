"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ImpactMetricsSection } from "@/components/landing/ImpactMetricsSection";
import { TransformationSection } from "@/components/landing/TransformationSection";
import { ImpactPillarsSection } from "@/components/landing/ImpactPillarsSection";
import { HowYouEarnSection } from "@/components/landing/HowYouEarnSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F1416] text-[#DFE2EB] selection:bg-[#00F2A9] selection:text-[#006947] flex flex-col font-sans">
      {/* Aksesibilitas: Tautan pintas ke konten utama */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[#00F2A9] focus:text-[#006947] focus:font-bold focus:rounded-md m-2"
      >
        Lewati ke Konten Utama
      </a>

      {/* Navigasi Publik */}
      <Navbar />

      <main id="main-content" role="main" className="flex-1">
        {/* Seksi 1: Perkenalan Platform */}
        <HeroSection />

        {/* Seksi 2: Berapa Yang Sudah Terbantu dan Terdampak */}
        <ImpactMetricsSection />

        {/* Seksi 3: Bagaimana Platform Mengubah Masalah Menjadi Solusi */}
        <TransformationSection />

        {/* Seksi 4: Penjabaran 5 Masalah Nyata Pekon yang Diselesaikan */}
        <ImpactPillarsSection />

        {/* Seksi 5: Alur Pembayaran & Penukaran Poin Kebaikan */}
        <HowYouEarnSection />

        {/* Seksi 6: FAQ Sebelum Bergabung */}
        <FaqSection />
      </main>

      {/* Seksi 7: Footer Gotong Royong */}
      <LandingFooter />
    </div>
  );
}
