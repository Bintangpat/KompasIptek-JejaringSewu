"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    id: 1,
    question: "Apakah perlu punya rekening bank khusus?",
    answer:
      "Tidak perlu. Rekening kas mandiri warga terhubung langsung dengan dompet digital pekon. Saldo dapat ditarik tunai melalui kasir BUMDes setempat, ditransfer ke rekening bank apa pun yang kamu miliki, atau langsung ditukarkan dengan kebutuhan pangan harian.",
  },
  {
    id: 2,
    question: "Bagaimana jika hasil panen sedang gagal atau cuaca buruk?",
    answer:
      "Sistem gotong royong pekon mengalokasikan cadangan kas ketahanan pangan BUMDes. Petani terdaftar dengan rekam jejak amanah mendapatkan relaksasi perputaran modal dan prioritas pekerjaan mini-job alternatif agar dapur tetap ngebul.",
  },
  {
    id: 3,
    question: "Siapa yang menjamin keakuratan timbangan hasil bumi?",
    answer:
      "Timbangan digital Bluetooth terkalibrasi milik BUMDes yang otomatis mengirimkan angka timbangan ke layar ponsel penjual dan pembeli secara realtime. Tidak ada celah bagi calo untuk menyunat timbangan.",
  },
  {
    id: 4,
    question: "Apakah orang tua atau lansia bisa ikut bekerja?",
    answer:
      "Sangat bisa. Mini-job dirancang ramah lansia dan kelompok rentan, seperti sortir biji kopi, kupas kelapa, atau anyaman bambu dengan waktu kerja fleksibel dari rumah.",
  },
  {
    id: 5,
    question: "Berapa lama proses pencairan upah setelah pekerjaan selesai?",
    answer:
      "Seketika (realtime). Setelah bukti foto selfie Proof-of-Work terverifikasi GPS dan waktu, smart-ledger langsung mengkreditkan upah ke saldo dompet pekonmu tanpa potongan perantara.",
  },
  {
    id: 6,
    question: "Bagaimana cara kerja sistem penukaran poin pangan untuk pencegahan stunting?",
    answer:
      "Poin kontribusi gotong royong dapat ditukar langsung di Posyandu atau gerai BUMDes dengan paket pangan kaya protein hewani (telur bebek, ikan nila, dan tempe) untuk balita dan ibu hamil.",
  },
  {
    id: 7,
    question: "Apakah ada bunga atau potongan tersembunyi pada pinjaman modal usaha?",
    answer:
      "0% Bunga Riba. Modal usaha produktif BUMDes hingga Rp 1.500.000 bersumber dari kas pekon mandiri dengan sistem bagi hasil murni dan tanpa sita jaminan surat tanah.",
  },
  {
    id: 8,
    question: "Bagaimana sistem menjamin transparansi kas pekon?",
    answer:
      "Seluruh transaksi tercatat dalam buku kas digital terbuka berenkripsi HMAC-SHA256 yang diawasi bersama oleh warga, BPD, dan pengurus BUMDes secara berkala.",
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="bg-[#0F1416] py-24 border-t border-[#3B4A41]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-16 lg:px-20 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column (#1:385) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-xs font-semibold text-[#84958A] tracking-wider uppercase">
              KONSULTASI WARGA
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-[#DFE2EB] leading-tight">
              Sebelum Kamu Bergabung:
              <br />
              <span className="text-[#4EDEA3]">
                Jawaban untuk Hal yang Sering Ditanyakan
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#B9CBBF] leading-relaxed">
              Transparansi penuh tata cara partisipasi, bagi hasil, dan jaminan gotong royong warga tanpa beban calo.
            </p>
          </div>

          {/* Right Column: 8 Accordion Details (#1:392) */}
          <div className="lg:col-span-7 space-y-2.5">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded border border-[#3B4A41]/40 bg-[#0A0E14]/80 backdrop-blur-md overflow-hidden transition-all hover:border-[#00F2A9]/30"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-1 focus:ring-[#00F2A9]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#84958A] w-5">
                        {item.id}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#DFE2EB]">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-[#84958A] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#00F2A9]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 pl-12 text-xs font-mono text-[#B9CBBF] leading-relaxed border-t border-[#3B4A41]/20">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
