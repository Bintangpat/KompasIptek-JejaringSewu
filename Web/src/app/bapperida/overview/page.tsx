"use client";

import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PekonMap } from "@/components/map/pekon-map";
import { PekonComparisonBarChart } from "@/components/charts/pekon-comparison-bar-chart";
import { MOCK_PEKON_LIST } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Compass,
  MapPin,
  TrendingUp,
  Scale,
  Apple,
  ShieldCheck,
  ArrowUpRight,
  Radar,
  FileSearch,
} from "lucide-react";

export default function BapperidaOverviewPage() {
  const totalWargaKabupaten = MOCK_PEKON_LIST.reduce((a, b) => a + b.totalWarga, 0);
  const totalLoansKabupaten = MOCK_PEKON_LIST.reduce((a, b) => a + b.totalLoansApproved, 0);
  const totalStuntingKabupaten = MOCK_PEKON_LIST.reduce((a, b) => a + b.stuntingRiskCount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Executive Heatmap & Analitik Daerah
              <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-500 border-cyan-500/30 font-medium">
                BAPPERIDA Pringsewu
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Pemantauan makro sirkulasi ekonomi, inklusi sosial, dan intervensi stunting lintas 9 Pekon.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10">
              <Link href="/bapperida/spk-radar">
                <Radar className="h-3.5 w-3.5" />
                <span>Simulasi Sensitivitas SPK</span>
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="text-xs gap-1.5">
              <Link href="/bapperida/audit-trail">
                <FileSearch className="h-3.5 w-3.5" />
                <span>Audit Forensik</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Macro Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Transaksi Kabupaten</CardTitle>
              <TrendingUp className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">Rp 236.700.000</div>
              <span className="text-[11px] text-emerald-500 font-medium">+18.5% Pertumbuhan Sirkular</span>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Cakupan Warga Terdaftar</CardTitle>
              <MapPin className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {totalWargaKabupaten.toLocaleString("id-ID")} Jiwa
              </div>
              <span className="text-[11px] text-muted-foreground">Tersebar di {MOCK_PEKON_LIST.length} Pekon Pilot</span>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Rekomendasi Modal Terbit</CardTitle>
              <Scale className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">{totalLoansKabupaten} Penerima</div>
              <span className="text-[11px] text-muted-foreground">Rp {((totalLoansKabupaten * 1.5)).toFixed(1)} Juta Total Modal</span>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Intervensi Balita Stunting</CardTitle>
              <Apple className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">{totalStuntingKabupaten} Sasaran</div>
              <span className="text-[11px] text-emerald-500 font-medium">92% Paket Nutrisi Tersalurkan</span>
            </CardContent>
          </Card>
        </div>

        {/* Map & Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-500" />
                  Peta Sebaran Ekonomi Pekon (Kabupaten Pringsewu)
                </span>
                <Badge variant="outline" className="text-[10px]">Interaktif</Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Radius lingkaran menunjukkan intensitas transaksi dan permodalan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PekonMap showHeatmap={true} className="h-[280px] w-full rounded-xl overflow-hidden border border-border/60" />
            </CardContent>
          </Card>

          <PekonComparisonBarChart
            title="Komparasi Kinerja Antar-Pekon"
            description="Total transaksi sirkular dan penerima rekomendasi modal Grade A"
          />
        </div>

        {/* Pekon Comparison Table */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Matriks Kinerja Multi-Pekon Pilot Project
            </CardTitle>
            <CardDescription className="text-xs">
              Agregasi performa BUMDes, skor rata-rata AHP-TOPSIS, dan penanganan kerentanan stunting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Nama Pekon</TableHead>
                    <TableHead className="text-xs">Kecamatan</TableHead>
                    <TableHead className="text-xs">BUMDes Pengelola</TableHead>
                    <TableHead className="text-xs">Warga Terdaftar</TableHead>
                    <TableHead className="text-xs">Rata-rata Skor S_kredit</TableHead>
                    <TableHead className="text-xs">Modal Disetujui</TableHead>
                    <TableHead className="text-xs text-right">Sasaran Stunting</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PEKON_LIST.map((pekon) => (
                    <TableRow key={pekon.id}>
                      <TableCell className="text-xs font-semibold text-foreground">{pekon.namaPekon}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{pekon.kecamatan}</TableCell>
                      <TableCell className="text-xs font-medium">{pekon.namaBumdes}</TableCell>
                      <TableCell className="text-xs font-mono">{pekon.totalWarga.toLocaleString("id-ID")}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                          {pekon.avgCreditScore.toFixed(1)} Pts
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-emerald-500 font-mono">
                        {pekon.totalLoansApproved} Warga
                      </TableCell>
                      <TableCell className="text-xs text-right font-mono text-rose-500">
                        {pekon.stuntingRiskCount} Balita
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
