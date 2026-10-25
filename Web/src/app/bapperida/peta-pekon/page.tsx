"use client";

import React from "react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MapPin, Info } from "lucide-react";

// Dynamic import with SSR false for Leaflet
const PekonMap = dynamic(() => import("@/components/map/pekon-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[520px] w-full rounded-2xl bg-slate-100 flex flex-col items-center justify-center gap-3 border border-slate-200">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-slate-500 font-medium">Memuat Peta Geospasial Kabupaten Pringsewu...</p>
    </div>
  ),
});

export default function PetaPekonPage() {
  return (
    <DashboardLayout allowedRoles={["ADMIN_BAPPERIDA", "SUPER_ADMIN"]}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            Peta Geospasial Pekon Kabupaten Pringsewu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visualisasi sebaran 5 pekon percontohan inovasi JEJARING-SEWU dan status ekonomi sirkular desa.
          </p>
        </div>
      </div>

      {/* Map Container */}
      <Card>
        <CardContent className="p-4">
          <PekonMap />
        </CardContent>
      </Card>

      {/* Explanatory notes */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Integrasi PostGIS & Radius Geofence:</span>{" "}
          Sistem backend NestJS memanfaatkan modul geospasial PostGIS (`ST_DWithin` & `ST_Distance`)
          untuk mencocokkan rute komuter nebeng-jastip secara otomatis dalam koridor radius 1.500 meter dari titik jemput warga desa.
        </div>
      </div>
    </DashboardLayout>
  );
}
