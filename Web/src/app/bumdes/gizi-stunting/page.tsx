"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HeartHandshake,
  Egg,
  Fish,
  Wheat,
  Plus,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { MOCK_NUTRITION_PACKAGES } from "@/lib/mock-data";
import { NutritionPackage } from "@/types";

export default function BumdesGiziStuntingPage() {
  const { isMockMode } = useAuth();
  const [packages, setPackages] = useState<NutritionPackage[]>(MOCK_NUTRITION_PACKAGES);

  useEffect(() => {
    const fetchPackages = async () => {
      if (isMockMode) return;
      try {
        const res = await apiClient.get("/nutrition/packages");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPackages(res.data);
        }
      } catch (e) {
        // Fallback to mock
      }
    };
    fetchPackages();
  }, [isMockMode]);

  return (
    <DashboardLayout allowedRoles={["ADMIN_BUMDES", "SUPER_ADMIN"]}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-rose-600" />
            Manajemen Pangan Bergizi & Intervensi Stunting
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Penyerapan produk pangan lokal pekon untuk ditebus menggunakan poin reputasi kerja warga.
          </p>
        </div>
      </div>

      {/* Impact Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-rose-50/50 border-rose-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-rose-800 font-medium">Prevalensi Risiko Stunting</p>
              <p className="text-xl font-bold text-rose-950">Turun 18.2%</p>
              <p className="text-[10px] text-rose-700">Dalam 3 bulan siklus intervensi</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/50 border-emerald-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <Egg className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-800 font-medium">Protein Hewani Tersalurkan</p>
              <p className="text-xl font-bold text-emerald-950">485 Kg</p>
              <p className="text-[10px] text-emerald-700">Diserap dari peternak & petambak desa</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-blue-800 font-medium">Balita Menerima Manfaat</p>
              <p className="text-xl font-bold text-blue-950">94 Anak</p>
              <p className="text-[10px] text-blue-700">Data terhubung posyandu desa</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Stock Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">
          Katalog Stok Paket Pangan Pekon Pagelaran
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-xs font-semibold">
                    {pkg.pointsCost} Poin Reputasi
                  </Badge>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Sisa Stok: {pkg.stockCount}
                  </span>
                </div>
                <CardTitle className="text-base text-slate-900 mt-2">
                  {pkg.packageName}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {pkg.description || "Paket gizi protein tinggi dari hasil panen pekon."}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lokasi Penukaran:</span>
                    <span className="font-medium text-slate-800">Kantor BUMDes / Posyandu</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mekanisme Klaim:</span>
                    <span className="font-medium text-slate-800">QR / Kode App Mobile</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
