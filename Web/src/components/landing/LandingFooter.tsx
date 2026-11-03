"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-[#0F1416] border-t border-slate-200 dark:border-[#3B4A41]/30 transition-colors">

      {/* Section: Bottom CTA Banner (#1:458) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-16 lg:px-20 pt-16 pb-12 space-y-16">
        <div className="relative rounded-2xl border border-emerald-500/20 dark:border-[#C1FFDD]/20 bg-gradient-to-b from-white via-slate-50 to-emerald-50/30 dark:from-[#1C2026] dark:to-[#151C1E] p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-xl dark:shadow-2xl transition-colors">

          {/* Top Blur Glow Accents (#1:483) */}
          <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 -z-10 h-36 w-96 rounded-full bg-emerald-500/15 dark:bg-[#00F2A9]/15 blur-[80px] pointer-events-none" />

          {/* Heading 2 (#1:464) */}
          <div className="space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.025em] text-slate-900 dark:text-[#DFE2EB] transition-colors">
              Daftar Mandiri dalam Dua Menit.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B9CBBF] leading-relaxed transition-colors">
              Keringat dan kejujuran hari ini jadi pembuka jalan rezeki esok hari. Bergabung sekarang bersama ribuan warga pekon lainnya.
            </p>
          </div>

          {/* Button CTA (#1:469) */}
          <div className="max-w-md mx-auto space-y-4 pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 dark:bg-[#00F2A9] dark:hover:bg-[#4EDEA3] px-6 py-3.5 text-base sm:text-lg font-semibold dark:text-[#006947] shadow-lg shadow-emerald-500/25 dark:shadow-[0px_4px_20px_rgba(0,242,169,0.3)] active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F1416]"
            >
              <span>Buka Akun Mandiri Pekon</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Trust Indicators (#1:474) */}
            <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-slate-600 dark:text-[#84958A]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-[#C1FFDD]" />
                <span>Tanpa potongan bulanan</span>
              </div>
              <span className="text-slate-300 dark:text-[#3B4A41]">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-[#4EDEA3]" />
                <span>100% Amanah</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Telemetry (#1:484) */}
      <div className="border-t border-slate-200 dark:border-[#3B4A41]/20 py-8 px-4 text-center space-y-1.5 transition-colors">
        <p className="font-mono text-[11px] text-slate-600 dark:text-[#84958A]">
          Jejaring Warga © 2025 • Dibangun untuk Kedaulatan Pekon Nusantara
        </p>
        <p className="font-mono text-[10px] text-slate-400 dark:text-[#3B4A41] tracking-wider uppercase">
          Open Protocol • Low Latency Rural Mesh Network • Pringsewu, Lampung
        </p>
      </div>

    </footer>
  );
}
