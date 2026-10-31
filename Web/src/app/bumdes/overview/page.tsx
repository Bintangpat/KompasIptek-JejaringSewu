"use client";

import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { EconomicVelocityChart } from "@/components/charts/economic-velocity-chart";
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
  Users,
  Wallet,
  Scale,
  Apple,
  Camera,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function BumdesOverviewPage() {
  const { activePekon } = useAuth();

  const recentTransactions = [
    {
      id: "TRX-7821",
      modul: "Hasil Bumi",
      warga: "Pak Slamet",
      nominal: "Rp 850.000",
      poin: "+15 Pts",
      statusPoW: "VERIFIED_GEOTAG",
      waktu: "10 menit lalu",
    },
    {
      id: "TRX-7820",
      modul: "Nebeng-Jastip",
      warga: "Bu Rohmah",
      nominal: "Rp 35.000",
      poin: "+2 Pts",
      statusPoW: "VERIFIED_GEOTAG",
      waktu: "25 menit lalu",
    },
    {
      id: "TRX-7819",
      modul: "Mini-Job",
      warga: "Mbah Suroto",
      nominal: "Rp 75.000",
      poin: "+5 Pts",
      statusPoW: "VERIFIED_GEOTAG",
      waktu: "1 jam lalu",
    },
    {
      id: "TRX-7818",
      modul: "Hasil Bumi",
      warga: "Pak Teguh",
      nominal: "Rp 1.200.000",
      poin: "+20 Pts",
      statusPoW: "PENDING_REVIEW",
      waktu: "2 jam lalu",
    },
    {
      id: "TRX-7817",
      modul: "Paket Gizi",
      warga: "Ibu Anisa (Balita)",
      nominal: "Tukar 30 Poin",
      poin: "-30 Pts",
      statusPoW: "VERIFIED_GEOTAG",
      waktu: "3 jam lalu",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Overview Operasional BUMDes
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-medium">
                {activePekon.namaPekon}
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Pantauan perputaran ekonomi sirkular, inklusi kerja, dan penyaluran nutrisi desa.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" asChild className="text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/bumdes/credit-scoring">
                <span>Review Pengajuan Modal</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Warga Terdaftar</CardTitle>
              <Users className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">{(activePekon.totalWarga || 1420).toLocaleString("id-ID")}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                  98% NIK Terverifikasi
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Transaksi Sirkular</CardTitle>
              <Wallet className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">Rp 48.500.000</div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-500 font-medium">
                +14.2% dari bulan lalu
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Rekomendasi Grade A</CardTitle>
              <Scale className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">{(activePekon.totalLoansApproved || 18)} Warga</div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                Plafon Rp 1.500.000 tanpa agunan
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Stok Paket Gizi</CardTitle>
              <Apple className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight text-foreground">85 Paket</div>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-rose-500 font-medium">
                {(activePekon.stuntingRiskCount || 14)} Balita dalam pantauan
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EconomicVelocityChart
              title={`Perputaran Ekonomi ${activePekon.namaPekon}`}
              description="Volume transaksi terverifikasi: Hasil Bumi, Jastip, dan Upah Mini-Job"
            />
          </div>

          <div className="space-y-4">
            <Card className="border-border/60 bg-card/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  Antrean Perlu Tindakan
                </CardTitle>
                <CardDescription className="text-xs">Prioritas verifikasi otoritas BUMDes hari ini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg border border-border/50 bg-background/50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>3 Pengajuan Modal Grade A</span>
                    <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/40">Menunggu</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Pak Slamet dan 2 warga lainnya telah memenuhi skor kelayakan AHP-TOPSIS &ge; 85.
                  </p>
                  <Button size="sm" variant="outline" asChild className="w-full text-xs h-7 border-primary/40 hover:bg-primary/10 hover:text-primary">
                    <Link href="/bumdes/credit-scoring">Buka Meja Rekomendasi</Link>
                  </Button>
                </div>

                <div className="p-3 rounded-lg border border-border/50 bg-background/50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>5 Pengajuan NIK Baru</span>
                    <Badge variant="outline" className="text-[10px] text-cyan-500 border-cyan-500/40">Tertunda</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Verifikasi identitas fisik KK/KTP sebelum akun warga dapat bertransaksi penuh.
                  </p>
                  <Button size="sm" variant="outline" asChild className="w-full text-xs h-7">
                    <Link href="/bumdes/verifikasi-nik">Verifikasi NIK Sekarang</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabel 10 Transaksi Terakhir dengan Status Selfie PoW */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 gap-2">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                Transaksi Terkini & Bukti Kerja (Proof-of-Work)
              </CardTitle>
              <CardDescription className="text-xs">
                Semua transaksi wajib dilengkapi geotag foto dan verifikasi radius Pekon
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID Transaksi</TableHead>
                    <TableHead className="text-xs">Modul Layanan</TableHead>
                    <TableHead className="text-xs">Warga / Pelaksana</TableHead>
                    <TableHead className="text-xs">Nilai Transaksi</TableHead>
                    <TableHead className="text-xs">Poin Gizi</TableHead>
                    <TableHead className="text-xs">Status Geotag PoW</TableHead>
                    <TableHead className="text-xs text-right">Waktu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell className="font-mono text-xs font-medium text-foreground">{trx.id}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="text-[10px]">
                          {trx.modul}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium">{trx.warga}</TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">{trx.nominal}</TableCell>
                      <TableCell className="text-xs font-medium text-amber-500">{trx.poin}</TableCell>
                      <TableCell className="text-xs">
                        {trx.statusPoW === "VERIFIED_GEOTAG" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            GPS Valid (Radius 15m)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-500">
                            <Clock className="h-3.5 w-3.5" />
                            Menunggu Review
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-right text-muted-foreground">{trx.waktu}</TableCell>
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
