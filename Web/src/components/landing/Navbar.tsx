"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-[#3B4A41]/40 bg-white/85 dark:bg-[#0F1416]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-20">

        {/* Leading Icon & Brand Anchor (#1:50) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416]"
          aria-label="Jejaring Warga — Beranda"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-50 dark:bg-[#262A31]/80 border border-emerald-200 dark:border-[#3B4A41]/60 text-emerald-600 dark:text-[#C1FFDD] group-hover:border-emerald-400 dark:group-hover:border-[#00F2A9]/60 transition-colors shadow-sm">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-[#00F2A9]" />
          </div>
          <span className="text-lg font-semibold tracking-[-0.025em] text-slate-900 group-hover:text-emerald-600 dark:text-[#DFE2EB] dark:group-hover:text-white transition-colors">
            Jejaring Warga
          </span>
        </Link>

        {/* Desktop Navigation Links (Keyboard Accessible) */}
        <nav
          className="hidden md:flex items-center gap-2 text-xs font-mono font-medium text-slate-600 dark:text-[#B9CBBF]"
          aria-label="Navigasi Utama"
        >
          <a
            href="#infrastruktur"
            className="px-3 py-1.5 rounded-md hover:text-emerald-600 dark:hover:text-[#00F2A9] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416]"
          >
            Infrastruktur
          </a>
          <a
            href="#solusi-lapangan"
            className="px-3 py-1.5 rounded-md hover:text-emerald-600 dark:hover:text-[#00F2A9] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416]"
          >
            5 Solusi Lapangan
          </a>
          <a
            href="#ekonomi-terbuka"
            className="px-3 py-1.5 rounded-md hover:text-emerald-600 dark:hover:text-[#00F2A9] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416]"
          >
            Ekonomi Terbuka
          </a>
          <a
            href="#faq"
            className="px-3 py-1.5 rounded-md hover:text-emerald-600 dark:hover:text-[#00F2A9] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416]"
          >
            Konsultasi Warga
          </a>
        </nav>

        {/* Trailing Action Cluster: Theme Toggle, Status Pill & Portal Login */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Theme Toggle (Dark / Light) */}
          <div className="border-r border-slate-200 dark:border-[#3B4A41]/40 pr-2.5">
            <ThemeToggle className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-[#B9CBBF] dark:hover:text-white dark:hover:bg-[#1C2026] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416]" />
          </div>

          {/* Status Pill (#1:57) */}
          <div className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-[#3B4A41]/40 bg-slate-100/90 dark:bg-[#1C2026] px-2.5 py-1 text-[11px] font-mono text-slate-700 dark:text-[#B9CBBF]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-[#00F2A9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-[#00F2A9] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            <span>v2.4 Tanggamus</span>
          </div>

          {/* Button Pekon Online (#1:61) */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded border border-slate-300 dark:border-[#C1FFDD]/20 bg-slate-900 hover:bg-slate-800 text-white dark:bg-[#262A31] dark:hover:bg-[#31353C] dark:hover:border-[#00F2A9]/40 px-3 py-1.5 text-[11px] font-mono font-medium dark:text-[#C1FFDD] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416]"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 dark:bg-[#00F2A9]"></span>
            <span>Pekon Online</span>
            <ArrowUpRight className="h-3 w-3 text-slate-300 dark:text-[#B9CBBF]" />
          </Link>
        </div>

        {/* Mobile Menu & Theme Toggle on Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle className="h-8 w-8 text-slate-700 hover:bg-slate-100 dark:text-[#B9CBBF] dark:hover:bg-white/5" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-700 dark:text-[#B9CBBF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-b border-slate-200 dark:border-[#3B4A41]/40 bg-white dark:bg-[#151C1E] px-4 pt-3 pb-5 space-y-3 transition-colors shadow-lg"
        >
          <nav className="flex flex-col space-y-1.5 text-xs font-mono text-slate-800 dark:text-[#DFE2EB]">
            <a
              href="#infrastruktur"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-[#1C2026] dark:hover:text-[#00F2A9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Infrastruktur
            </a>
            <a
              href="#solusi-lapangan"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-[#1C2026] dark:hover:text-[#00F2A9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              5 Solusi Lapangan
            </a>
            <a
              href="#ekonomi-terbuka"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-[#1C2026] dark:hover:text-[#00F2A9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Ekonomi Terbuka
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-[#1C2026] dark:hover:text-[#00F2A9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Konsultasi Warga
            </a>
          </nav>
          <div className="pt-3 border-t border-slate-200 dark:border-[#3B4A41]/30 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#84958A]">v2.4 Tanggamus</span>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 rounded bg-emerald-500 hover:bg-emerald-400 dark:bg-[#00F2A9] dark:hover:bg-[#4EDEA3] px-3.5 py-1.5 text-xs font-semibold text-slate-950 dark:text-[#006947] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <span>Masuk Portal</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
