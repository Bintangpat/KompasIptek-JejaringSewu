"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calculator, Sparkles, Award } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { MOCK_RADAR_METRICS } from "@/lib/mock-data";

const PEKON_GRADE_DISTRIBUTION = [
  { pekon: "Pagelaran", GradeA: 42, GradeB: 68, GradeC: 15 },
  { pekon: "Pringsewu Brt", GradeA: 65, GradeB: 80, GradeC: 12 },
  { pekon: "Gading Rejo", GradeA: 38, GradeB: 55, GradeC: 22 },
  { pekon: "Sukoharjo", GradeA: 29, GradeB: 47, GradeC: 18 },
  { pekon: "Ambarawa", GradeA: 31, GradeB: 39, GradeC: 10 },
];

export default function AnalitikSpkPage() {
  return (
    <DashboardLayout allowedRoles={["ADMIN_BAPPERIDA", "SUPER_ADMIN"]}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Analitik Mesin SPK AHP-TOPSIS ($S_{'{'}kredit{'}'}$)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Transparansi algoritma penilaian kelayakan modal alternatif berbasis rekam jejak ekonomi harian warga.
          </p>
        </div>
      </div>

      {/* Formula Explanation Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg space-y-2 border border-indigo-900/40">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <h2 className="font-bold text-sm tracking-wide">
            Rumus Matematika Multi-Kriteria AHP-TOPSIS:
          </h2>
        </div>
        <div className="p-3 bg-black/40 rounded-xl font-mono text-xs text-indigo-200 border border-indigo-500/20 overflow-x-auto">
          S_kredit = (0.20 × N_jastip) + (0.25 × N_minijob) + (0.20 × N_hasilbumi) + (0.20 × V_selfie) + (0.15 × I_inklusi)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span><strong>GRADE A (≥ 85):</strong> Layak Modal Rp1.5M BUMDes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span><strong>GRADE B (70 - 84):</strong> Tahap Pembinaan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span><strong>GRADE C (&lt; 70):</strong> Registrasi Awal</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart: Bobot 5 Pilar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profil Rata-rata 5 Pilar Penilaian</CardTitle>
            <CardDescription className="text-xs">
              Distribusi pencapaian indikator kinerja warga desa se-Kabupaten Pringsewu.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={MOCK_RADAR_METRICS}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar
                  name="Skor Rata-rata"
                  dataKey="A"
                  stroke="#059669"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart: Grade Distribution across 5 Pekons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribusi Grade Kelayakan per Pekon</CardTitle>
            <CardDescription className="text-xs">
              Jumlah warga Grade A (Layak Modal), Grade B (Pembinaan), dan Grade C (Awal).
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PEKON_GRADE_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="pekon" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="GradeA" name="Grade A (Layak Modal)" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="GradeB" name="Grade B (Pembinaan)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="GradeC" name="Grade C (Awal)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
