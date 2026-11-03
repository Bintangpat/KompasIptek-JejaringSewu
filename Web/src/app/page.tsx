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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F1416] text-slate-900 dark:text-[#DFE2EB] selection:bg-emerald-400 selection:text-emerald-950 dark:selection:bg-[#00F2A9] dark:selection:text-[#006947] flex flex-col font-sans transition-colors duration-300">
      {/* Aksesibilitas: Tautan pintas ke konten utama berstandar WCAG 2.1 AA */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-5 focus:py-2.5 focus:bg-emerald-500 focus:text-slate-950 focus:font-bold focus:shadow-2xl focus:ring-2 focus:ring-emerald-400 focus:rounded-lg focus:outline-none transition-all"
      >
        Lewati ke Konten Utama (Tekan Enter)
      </a>

      {/* Navigasi Publik dengan Mode Gelap/Terang & Navigasi Tab */}
      <Navbar />

      <main id="main-content" role="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* Seksi 1: Perkenalan Platform */}
        <HeroSection />

        {/* Seksi 2: Berapa Yang Sudah Terbantu dan Terdampak + Infinite Scroll Marquee */}
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
