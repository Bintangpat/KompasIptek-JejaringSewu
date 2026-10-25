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
    <section id="impact-metrics" className="bg-[#0F1416] border-y border-[#3B4A41]/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-16 lg:px-20 space-y-16">

        {/* Metrics Strip (#1:84) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#3B4A41]/30">

          {/* Column 1: Keluarga Berdaya */}
          <div className="py-6 sm:py-2 sm:px-6 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono tracking-[0.05em] uppercase text-[#84958A]">
              KELUARGA BERDAYA
            </span>
            <div className="text-3xl w-fit sm:text-4xl font-semibold tracking-[-0.012em] text-[#DFE2EB]">
              3.840+
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#4EDEA3]">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+18% bln ini</span>
            </div>
          </div>

          {/* Column 2: Dana Berputar */}
          <div className="py-6 sm:py-2 sm:px-6 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono tracking-[0.05em] uppercase text-[#84958A]">
              DANA BERPUTAR
            </span>
            <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.012em] text-[#DFE2EB]">
              Rp 2,4 M
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#C1FFDD]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Pekon mandiri</span>
            </div>
          </div>

          {/* Column 3: Modal Mandiri */}
          <div className="py-6 sm:py-2 sm:px-6 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono tracking-[0.05em] uppercase text-[#84958A]">
              MODAL MANDIRI
            </span>
            <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.012em] text-[#DFE2EB]">
              Rp 850 Jt
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#B9CBBF]">
              <Coins className="h-3.5 w-3.5" />
              <span>Tanpa agunan</span>
            </div>
          </div>

          {/* Column 4: Tingkat Amanah */}
          <div className="py-6 sm:py-2 sm:px-6 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono tracking-[0.05em] uppercase text-[#84958A]">
              TINGKAT AMANAH
            </span>
            <div className="text-3xl sm:text-4xl font-semibold tracking-[-0.012em] text-[#C1FFDD]">
              99,4%
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#4EDEA3]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>0 sengketa</span>
            </div>
          </div>

        </div>

        {/* Infinite Scroll / Marquee (#1:145) */}
        <div className="pt-6 space-y-6">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.012em] text-[#DFE2EB]">
            Seluruh Daerah Terimplementasikan
          </h2>

          <div className="relative overflow-hidden py-4">
            {/* Gradient Mask Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0F1416] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0F1416] to-transparent z-10 pointer-events-none" />

            {/* Marquee Track */}
            <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
              {[...REGIONS, ...REGIONS, ...REGIONS].map((region, index) => (
                <div key={index} className="flex items-center gap-12 text-sm sm:text-base font-medium text-white/90">
                  <span className="hover:text-[#00F2A9] transition-colors cursor-default">
                    {region}
                  </span>
                  <span className="text-[#3B4A41] text-xs font-mono">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
