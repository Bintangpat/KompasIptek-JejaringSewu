"use client";

import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  TrendingUp,
  MapPin,
  Coins,
  ShieldAlert,
  Award,
  ArrowRight,
  HeartHandshake,
  Users,
} from "lucide-react";
import { MOCK_PEKON_LIST } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";

export default function BapperidaOverviewPage() {
  const totalWargaSeKabupaten = MOCK_PEKON_LIST.reduce((a, b) => a + b.totalWarga, 0);
  const totalLoansApprovedSeKabupaten = MOCK_PEKON_LIST.reduce(
    (a, b) => a + b.totalLoansApproved,
    0
  );
  const totalDanaDisalurkan = totalLoansApprovedSeKabupaten * 1500000;

  return (
    <DashboardLayout allowedRoles={["ADMIN_BAPPERIDA", "SUPER_ADMIN"]}>
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/40">
        <div className="relative z-10 space-y-2">
          <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/40 text-xs">
            BAPPERIDA Kabupaten Pringsewu
          </Badge>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Executive Command Center: JEJARING-SEWU
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl">
            Sistem Pemantauan Makro Ekonomi Sirkular, Agregasi Penilaian Skor Kredit
            Alternatif AHP-TOPSIS, dan Mitigasi Kemiskinan Ekstrem & Stunting di 5 Pekon Percontohan.
          </p>
        </div>
      </div>

      {/* Macro Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Dana Modal BUMDes */}
        <Card className="hover:shadow-md transition-shadow border-blue-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">
              Total Modal Tersalurkan
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Coins className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-950">
              {formatRupiah(totalDanaDisalurkan)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dari {totalLoansApprovedSeKabupaten} penerima modal tanpa agunan
            </p>
          </CardContent>
        </Card>

        {/* NPL / Tingkat Gagal Bayar */}
        <Card className="hover:shadow-md transition-shadow border-emerald-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">
              Kualitas Kredit (NPL)
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Award className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              0.0%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Zero Bad Debt karena seleksi harian SPK
            </p>
          </CardContent>
        </Card>

        {/* Total Partisipasi Warga */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">
              Warga Terdaftar Aktif
            </CardTitle>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {totalWargaSeKabupaten.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Di 5 pekon percontohan
            </p>
          </CardContent>
        </Card>

        {/* Inklusi Disabilitas */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">
              Pekerja Rentan Terlindungi
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              142 Warga
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mekanisme Auto-Accept Lock aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table: 5 Pekon Pilot Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Performa 5 Pekon Percontohan Kabupaten Pringsewu</CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Agregasi data real-time aktivitas ekonomi, kelayakan modal BUMDes, dan risiko stunting.
            </p>
          </div>
          <Link href="/bapperida/peta-pekon">
            <Button size="sm" variant="outline" className="text-xs gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Buka Peta Geospasial
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Pekon & Kecamatan</th>
                  <th className="px-4 py-3">Nama BUMDes Pengelola</th>
                  <th className="px-4 py-3">Warga Aktif</th>
                  <th className="px-4 py-3">Skor Rata-rata ($S_{'{'}kredit{'}'}$)</th>
                  <th className="px-4 py-3">Pinjaman Tersalur</th>
                  <th className="px-4 py-3">Kasus Risiko Stunting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_PEKON_LIST.map((pekon) => (
                  <tr key={pekon.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{pekon.namaPekon}</div>
                      <div className="text-xs text-slate-400">Kec. {pekon.kecamatan}</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">
                      {pekon.namaBumdes}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {pekon.totalWarga.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-600">
                      {pekon.avgCreditScore} / 100
                    </td>
                    <td className="px-4 py-3.5 font-bold text-blue-700">
                      {formatRupiah(pekon.totalLoansApproved * 1500000)}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={pekon.stuntingRiskCount > 10 ? "warning" : "default"} className="text-[10px]">
                        {pekon.stuntingRiskCount} Balita (Intervensi)
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
