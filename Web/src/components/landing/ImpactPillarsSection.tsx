"use client";

import React from "react";
import { Quote, Sparkles } from "lucide-react";

const FLOW_CARDS = [
  {
    id: "01",
    badge: "TERBUKTI",
    badgeColor: "text-[#4EDEA3] bg-[#00A572]/20 border-[#00A572]/30",
    title: "Modal Usaha Berbasis Kejujuran",
    description: "Warga yang konsisten amanah mendapat alokasi kas tanpa jaminan surat tanah.",
    quote: '"Warung bakso saya tambah freezer tanpa utang bank keliling." — Pak Sukardi',
  },
  {
    id: "02",
    badge: "HEMAT 60%",
    badgeColor: "text-[#84958A] bg-[#1C2026] border-[#3B4A41]/30",
    title: "Saling Berbagi Ongkos Transportasi",
    description: "Tiap ada pikap atau motor ke pasar kecamatan, muatan dititipkan secara terkoordinir.",
    quote: '"Ongkos bawa pisang ke agen jadi cuma separuh." — Budi Utomo',
  },
  {
    id: "03",
    badge: "DIGITAL",
    badgeColor: "text-[#00F2A9] bg-[#00F2A9]/10 border-[#00F2A9]/20",
    title: "Timbangan Jujur Tanpa Sunat",
    description: "Timbangan digital terkalibrasi BUMDes memunculkan angka langsung di ponsel petani.",
    quote: '"Tak ada lagi potongan berat sepihak dari tengkulak nakal." — Ibu Min',
  },
  {
    id: "04",
    badge: "INKLUSIF",
    badgeColor: "text-[#C1FFDD] bg-[#C1FFDD]/10 border-[#C1FFDD]/20",
    title: "Hak Kerja Tanpa Cemas Ditolak",
    description: "Pekerjaan pemilahan hasil panen terbuka merata bagi ibu rumah tangga dan disabilitas.",
    quote: '"Saya bisa kerja sortir biji kopi dari rumah, hak upah langsung cair tanpa potongan." — Mbah Marto',
  },
  {
    id: "05",
    badge: "GIZI BALITA",
    badgeColor: "text-[#4EDEA3] bg-[#4EDEA3]/10 border-[#4EDEA3]/20",
    title: "Keringat Jadi Lauk Bergizi",
    description: "Upah harian dibayarkan langsung detik itu juga tanpa potongan admin sepeser pun.",
    quote: '"Poin gotong royong bisa ditukar paket telur bebek & lele buat balita di Posyandu." — Bu Dewi',
  },
];

export function ImpactPillarsSection() {
  return (
    <section id="solusi-lapangan" className="bg-[#0F1416] py-24 border-t border-[#3B4A41]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-16 lg:px-20 space-y-16">

        {/* Section Header (#1:241) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#3B4A41]/30 pb-6">
          <div className="space-y-1">
            <span className="font-mono text-xs font-semibold text-[#00F2A9] tracking-wider uppercase">
              ALUR PEKON TERPERCAYA
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.015em] text-[#DFE2EB]">
              5 Solusi Konkret di Lapangan
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#84958A]">
            <Sparkles className="h-3.5 w-3.5 text-[#00F2A9]" />
            <span>TOP PROTOCOL</span>
          </div>
        </div>

        {/* Ranked Flow Cards (#1:247) */}
        <div className="space-y-3">
          {FLOW_CARDS.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-[#3B4A41]/40 bg-[#151C1E]/80 backdrop-blur-md p-5 sm:p-6 transition-all hover:border-[#00F2A9]/40 hover:bg-[#151C1E]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-[#31353C] font-mono text-xs font-bold text-white">
                    {item.id}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-[#DFE2EB] tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <span className={`self-start sm:self-center font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#B9CBBF] leading-relaxed mb-3 pl-0 sm:pl-10">
                {item.description}
              </p>

              <div className="flex items-center gap-2 pl-0 sm:pl-10 text-[11px] font-sans italic text-[#C1FFDD]/90">
                <Quote className="h-3 w-3 shrink-0 text-[#84958A]" />
                <span>{item.quote}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
