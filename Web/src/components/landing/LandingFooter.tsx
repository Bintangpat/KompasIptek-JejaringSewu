"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#0F1416] border-t border-[#3B4A41]/30">

      {/* Section: Bottom CTA Banner (#1:458) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-16 lg:px-20 space-y-16">
        <div className="relative rounded-2xl border border-[#C1FFDD]/20 bg-gradient-to-b from-[#1C2026] to-[#151C1E] p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-2xl">

          {/* Top Blur Glow Accents (#1:483) */}
          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 -z-10 h-36 w-96 rounded-full bg-[#00F2A9]/15 blur-[80px] pointer-events-none" />

          {/* Badge: Akses Terbuka & Gratis (#1:459) */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C1FFDD]/20 bg-[#1C2026] px-3.5 py-1 text-xs font-mono text-[#C1FFDD]">
            <Sparkles className="h-3.5 w-3.5 text-[#00F2A9]" />
            <span>Akses Terbuka & Gratis</span>
          </div>

          {/* Heading 2 (#1:464) */}
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.025em] text-[#DFE2EB]">
              Daftar Mandiri dalam Dua Menit.
            </h2>
            <p className="text-xs sm:text-sm text-[#B9CBBF] leading-relaxed">
              Keringat dan kejujuran hari ini jadi pembuka jalan rezeki esok hari. Bergabung sekarang bersama ribuan warga pekon lainnya.
            </p>
          </div>

          {/* Button CTA (#1:469) */}
          <div className="max-w-md mx-auto space-y-4 pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded bg-[#00F2A9] hover:bg-[#4EDEA3] px-6 py-3.5 text-base sm:text-lg font-semibold text-[#006947] shadow-[0px_4px_20px_rgba(0,242,169,0.3)] active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-[#00F2A9]"
            >
              <span>Buka Akun Mandiri Pekon</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Trust Indicators (#1:474) */}
            <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-[#84958A]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#C1FFDD]" />
                <span>Tanpa potongan bulanan</span>
              </div>
              <span className="text-[#3B4A41]">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#4EDEA3]" />
                <span>100% Amanah</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Telemetry (#1:484) */}
      <div className="border-t border-[#3B4A41]/20 py-8 px-4 text-center space-y-1.5">
        <p className="font-mono text-[11px] text-[#84958A]">
          Jejaring Warga © 2025 • Dibangun untuk Kedaulatan Pekon Nusantara
        </p>
        <p className="font-mono text-[10px] text-[#3B4A41] tracking-wider uppercase">
          Open Protocol • Low Latency Rural Mesh Network • Lampung
        </p>
      </div>

    </footer>
  );
}
