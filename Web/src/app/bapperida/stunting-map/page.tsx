"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PekonMap } from "@/components/map/pekon-map";
import { MOCK_PEKON_LIST } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Apple, HeartPulse, MapPin, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function StuntingMapPage() {
  const stuntingData = [
    { pekon: "Pagelaran", balitaSasaran: 14, paketTersalurkan: 45, persentaseSelesai: 88, status: "TERKENDALI" },
    { pekon: "Pringsewu Barat", balitaSasaran: 8, paketTersalurkan: 30, persentaseSelesai: 95, status: "TERKENDALI" },
    { pekon: "Gading Rejo", balitaSasaran: 19, paketTersalurkan: 38, persentaseSelesai: 68, status: "PERLU_INTERVENSI_LEBIH" },
    { pekon: "Sukoharjo", balitaSasaran: 11, paketTersalurkan: 28, persentaseSelesai: 82, status: "TERKENDALI" },
    { pekon: "Ambarawa", balitaSasaran: 6, paketTersalurkan: 22, persentaseSelesai: 96, status: "TERKENDALI" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Peta Sebaran Kerentanan Gizi & Intervensi Stunting
              <Badge variant="outline" className="text-xs bg-rose-500/10 text-rose-500 border-rose-500/30 font-medium">
                Geospasial BAPPERIDA
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Pemetaan intervensi nutrisi lokal tepat sasaran terintegrasi poin sirkular warga.
            </p>
          </div>
        </div>

        {/* Map Container */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-500" />
                Sebaran Titik Kerentanan Balita & Posko BUMDes Nutrisi
              </span>
              <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/40">
                Data Realtime Sinkron
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Radius lingkaran merah/cyan menunjukkan tingkat intervensi paket nutrisi per Pekon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PekonMap showHeatmap={true} className="h-[360px] w-full rounded-xl overflow-hidden border border-border/60" />
          </CardContent>
        </Card>

        {/* Table of Intervention Matrix */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Matriks Capaian Intervensi Stunting per Pekon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Nama Pekon</TableHead>
                    <TableHead className="text-xs">Balita Sasaran</TableHead>
                    <TableHead className="text-xs">Paket Tersalurkan</TableHead>
                    <TableHead className="text-xs">Capaian Pemenuhan</TableHead>
                    <TableHead className="text-xs text-right">Status Evaluasi BAPPERIDA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stuntingData.map((item) => (
                    <TableRow key={item.pekon}>
                      <TableCell className="text-xs font-semibold text-foreground">{item.pekon}</TableCell>
                      <TableCell className="text-xs font-mono text-rose-500 font-medium">
                        {item.balitaSasaran} Balita
                      </TableCell>
                      <TableCell className="text-xs font-mono">{item.paketTersalurkan} Paket Gizi</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <Progress value={item.persentaseSelesai} className="w-24 h-2" />
                          <span className="text-[11px] font-mono">{item.persentaseSelesai}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        {item.status === "TERKENDALI" ? (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            Terkendali Baik
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                            Prioritas Tambah Stok
                          </Badge>
                        )}
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
