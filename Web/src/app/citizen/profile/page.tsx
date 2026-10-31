"use client";

import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  UserCheck,
  Scale,
  Wallet,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Briefcase,
  Car,
  ShoppingBag,
  Camera,
} from "lucide-react";

export default function CitizenProfilePage() {
  const { user, activePekon } = useAuth();

  const creditScore = 89.4;
  const grade = "GRADE_A_LAYAK_MODAL";

  const formatRupiah = (val?: string | number) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Profil Warga & Skor Kredit Alternatif
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-medium">
                S_kredit AHP-TOPSIS
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Identitas digital, status verifikasi NIK, dompet sirkular, dan skor kelayakan permodalan BUMDes.
            </p>
          </div>
        </div>

        {/* User Identity & Wallet Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/60 bg-card/60 md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10 gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  NIK Terverifikasi BUMDes
                </Badge>
                <span className="text-xs text-muted-foreground">{activePekon.namaPekon}</span>
              </div>
              <CardTitle className="text-lg font-bold text-foreground mt-1">
                {user.fullName}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                No. HP: {user.phoneNumber} &bull; Peran: {user.role}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">NIK Bertopeng:</span>
                  <span className="text-foreground font-semibold flex items-center gap-1">
                    <Lock className="h-3 w-3 text-primary" />
                    180410******0002
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Kategori Warga:</span>
                  <span className="text-foreground">Petani Produktif & Kurir Komunitas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Balances Card */}
          <Card className="border-border/60 bg-card/60 flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Dompet Sirkular
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Wallet className="h-3 w-3 text-emerald-500" />
                  Saldo Kas Tunai
                </span>
                <div className="text-lg font-bold text-foreground font-mono mt-0.5">
                  {formatRupiah(user.wallet?.cashBalance)}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Coins className="h-3 w-3 text-amber-500" />
                  Saldo Poin Kebaikan
                </span>
                <div className="text-lg font-bold text-amber-500 font-mono mt-0.5">
                  {user.wallet?.pointsBalance || 0} Pts
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Scoring Card */}
        <Card className="border-border/60 bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Skor Kelayakan Modal (S_kredit)
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Dihitung otomatis oleh backend NestJS berdasarkan 5 pilar aktivitas produktif
                </CardDescription>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 text-xs px-2.5 py-1 font-bold">
                GRADE A: LAYAK MODAL RP 1.500.000
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium">Skor Total AHP-TOPSIS:</span>
                <div className="text-4xl font-extrabold text-foreground font-mono flex items-baseline gap-2">
                  <span>{creditScore.toFixed(1)}</span>
                  <span className="text-sm font-semibold text-emerald-500">/ 100 Pts</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground sm:max-w-xs space-y-1">
                <div className="font-semibold text-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Rekomendasi Plafon Terbit
                </div>
                <div>Plafon modal kerja bergulir Rp 1.500.000 tanpa agunan aset fisik siap dicairkan oleh BUMDes.</div>
              </div>
            </div>

            {/* 5 Pillars Progress Bars */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-foreground">Pemenuhan 5 Dimensi Kriteria:</div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-emerald-500" />
                    Upah & Partisipasi Mini-Job (25%)
                  </span>
                  <span className="font-mono font-bold">92 / 100</span>
                </div>
                <Progress value={92} className="h-1.5" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Car className="h-3.5 w-3.5 text-cyan-500" />
                    Frekuensi & Penyelesaian Jastip (20%)
                  </span>
                  <span className="font-mono font-bold">85 / 100</span>
                </div>
                <Progress value={85} className="h-1.5" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />
                    Volume Pasokan Hasil Bumi (20%)
                  </span>
                  <span className="font-mono font-bold">88 / 100</span>
                </div>
                <Progress value={88} className="h-1.5" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-purple-500" />
                    Kepatuhan Bukti Kerja Selfie PoW (20%)
                  </span>
                  <span className="font-mono font-bold">95 / 100</span>
                </div>
                <Progress value={95} className="h-1.5" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5 text-rose-500" />
                    Indeks Inklusi & Kerentanan (15%)
                  </span>
                  <span className="font-mono font-bold">87 / 100</span>
                </div>
                <Progress value={87} className="h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
