"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3B4A41]/40 bg-[#0F1416]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-20">

        {/* Leading Icon & Brand Anchor (#1:50) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#00F2A9] rounded-md p-1"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#262A31]/80 border border-[#3B4A41]/60 text-[#C1FFDD] group-hover:border-[#00F2A9]/60 transition-colors">
            <Sparkles className="h-4 w-4 text-[#00F2A9]" />
          </div>
          <span className="text-lg font-semibold tracking-[-0.025em] text-[#DFE2EB] group-hover:text-white transition-colors">
            Jejaring Warga
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-medium text-[#B9CBBF]" aria-label="Navigasi Utama">
          <a href="#infrastruktur" className="hover:text-[#00F2A9] transition-colors">
            Infrastruktur
          </a>
          <a href="#solusi-lapangan" className="hover:text-[#00F2A9] transition-colors">
            5 Solusi Lapangan
          </a>
          <a href="#ekonomi-terbuka" className="hover:text-[#00F2A9] transition-colors">
            Ekonomi Terbuka
          </a>
          <a href="#faq" className="hover:text-[#00F2A9] transition-colors">
            Konsultasi Warga
          </a>
        </nav>

        {/* Trailing Action Pill & Online Status (#1:56) */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Status Pill (#1:57) */}
          <div className="flex items-center gap-2 rounded-full border border-[#3B4A41]/40 bg-[#1C2026] px-2.5 py-1 text-[11px] font-mono text-[#B9CBBF]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2A9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2A9] shadow-[0_0_8px_#00F2A9]"></span>
            </span>
            <span>v2.4 Tanggamus</span>
          </div>

          {/* Button Pekon Online (#1:61) */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded border border-[#C1FFDD]/20 bg-[#262A31] hover:bg-[#31353C] hover:border-[#00F2A9]/40 px-3 py-1.5 text-[11px] font-mono font-medium text-[#C1FFDD] transition-all focus:outline-none focus:ring-1 focus:ring-[#00F2A9]"
          >
            <span className="h-2 w-2 rounded-full bg-[#00F2A9]"></span>
            <span>Pekon Online</span>
            <ArrowUpRight className="h-3 w-3 text-[#B9CBBF]" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#B9CBBF] hover:text-white hover:bg-white/5 focus:outline-none focus:ring-1 focus:ring-[#00F2A9]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu navigasi"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#3B4A41]/40 bg-[#151C1E] px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2 text-xs font-mono text-[#DFE2EB]">
            <a
              href="#infrastruktur"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#1C2026] hover:text-[#00F2A9]"
            >
              Infrastruktur
            </a>
            <a
              href="#solusi-lapangan"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#1C2026] hover:text-[#00F2A9]"
            >
              5 Solusi Lapangan
            </a>
            <a
              href="#ekonomi-terbuka"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#1C2026] hover:text-[#00F2A9]"
            >
              Ekonomi Terbuka
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#1C2026] hover:text-[#00F2A9]"
            >
              Konsultasi Warga
            </a>
          </nav>
          <div className="pt-2 border-t border-[#3B4A41]/30 flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#84958A]">v2.4 Tanggamus</span>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 rounded bg-[#00F2A9] px-3 py-1.5 text-xs font-semibold text-[#006947]"
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
