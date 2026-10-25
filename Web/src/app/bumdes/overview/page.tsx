"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShieldCheck,
  Coins,
  HeartHandshake,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { MOCK_LOAN_RECOMMENDATIONS, MOCK_NUTRITION_PACKAGES, MOCK_USERS_PAGELARAN } from "@/lib/mock-data";

export default function BumdesOverviewPage() {
  const { user, isMockMode } = useAuth();
  const [stats, setStats] = useState({
    totalWarga: 1420,
    verifiedWarga: 1285,
    pendingLoansCount: 2,
    activeNutritionStock: 125,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt to fetch fresh data if live server
    const fetchFreshData = async () => {
      if (isMockMode) return;
      try {
        setLoading(true);
        const loansRes = await apiClient.get("/credit-scoring/loans/eligible");
        const packagesRes = await apiClient.get("/nutrition/packages");

        const eligibleLoans = loansRes.data || [];
        const packages = packagesRes.data || [];

        const totalStock = packages.reduce(
          (sum: number, p: any) => sum + (p.stockCount || 0),
          0
        );

        setStats((prev) => ({
          ...prev,
          pendingLoansCount: eligibleLoans.length,
          activeNutritionStock: totalStock,
        }));
      } catch (e) {
        // Fallback gracefully
      } finally {
        setLoading(false);
      }
    };

    fetchFreshData();
  }, [isMockMode]);

  return (
    <DashboardLayout allowedRoles={["ADMIN_BUMDES", "SUPER_ADMIN"]}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/40 text-xs">
            Portal Administrasi BUMDes
          </Badge>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Selamat Datang di {user?.pekon?.namaPekon || "Pekon Pagelaran"}
          </h1>
          <p className="text-emerald-100 text-sm max-w-2xl">
            Sistem pengawasan perputaran ekonomi mandiri desa, validasi fisik NIK,
            penyaluran modal ultra-mikro tanpa agunan (SPK AHP-TOPSIS), dan pemenuhan gizi balita stunting.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Warga */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">
              Total Warga Terdaftar
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.totalWarga.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>+14 warga baru minggu ini</span>
            </p>
          </CardContent>
        </Card>

        {/* NIK Terverifikasi */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">
              Warga Tervalidasi NIK
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.verifiedWarga.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="font-semibold text-emerald-600">90.5%</span> cakupan identitas terverifikasi
            </p>
          </CardContent>
        </Card>

        {/* Antrean Pinjaman Modal */}
        <Card className="hover:shadow-md transition-shadow border-amber-200 bg-amber-50/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-700">
              Rekomendasi Modal Rp1.5M
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
              <Coins className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {stats.pendingLoansCount} Warga
            </div>
            <p className="text-xs text-amber-700 font-medium mt-1">
              Menunggu persetujuan BUMDes
            </p>
          </CardContent>
        </Card>

        {/* Stok Paket Gizi */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-slate-500">
              Stok Pangan Stunting
            </CardTitle>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.activeNutritionStock} Paket
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tersedia di Posyandu & BUMDes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Action 1: Verifikasi NIK */}
        <Card className="border-l-4 border-l-emerald-600 bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-900 text-base">
                Verifikasi Fisik KTP / NIK Warga
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Periksa KTP asli warga pendaftar untuk mencocokkan hash kriptografi
                dan mengaktifkan kelayakan bantuan & transaksi bursa panen.
              </p>
            </div>
            <Link href="/bumdes/verifikasi-nik">
              <Button size="sm" className="gap-2 shrink-0">
                Buka Antrean <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Action 2: Pinjaman Modal */}
        <Card className="border-l-4 border-l-amber-500 bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-slate-900 text-base">
                Persetujuan Modal Usaha Rp1.500.000
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Tinjau warga Grade A ($S_{'{'}kredit{'}'} \ge 85$) hasil SPK AHP-TOPSIS
                untuk persetujuan pencairan modal kerja tanpa agunan fisik.
              </p>
            </div>
            <Link href="/bumdes/pinjaman-modal">
              <Button size="sm" variant="default" className="bg-amber-600 hover:bg-amber-700 gap-2 shrink-0">
                Tinjau Pinjaman <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Warga Activity Table Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Warga Terdaftar Terkini di Pekon</CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Daftar rekam jejak warga terdaftar beserta status verifikasi NIK dan poin reputasi.
            </p>
          </div>
          <Link href="/bumdes/verifikasi-nik">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              Kelola Semua Warga <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Warga</th>
                  <th className="px-4 py-3">No. WhatsApp</th>
                  <th className="px-4 py-3">Status Inklusi</th>
                  <th className="px-4 py-3">Status NIK</th>
                  <th className="px-4 py-3">Poin Reputasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_USERS_PAGELARAN.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      {w.fullName}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 text-xs">
                      {w.phoneNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      {w.vulnerabilityFlags.includes("DISABILITAS_FISIK") ? (
                        <Badge variant="warning" className="text-[10px]">
                          Disabilitas Fisik
                        </Badge>
                      ) : w.vulnerabilityFlags.includes("KELUARGA_PRA_SEJAHTERA") ? (
                        <Badge variant="secondary" className="text-[10px]">
                          Pra-Sejahtera
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-500">Umum</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {w.isNikVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Belum Verifikasi
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-600">
                      {w.wallet?.pointsBalance || 0} Poin
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
