"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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
import { SpkRadarChart } from "@/components/charts/spk-radar-chart";
import { toast } from "sonner";
import {
  Radar,
  Sliders,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

export default function SpkRadarPage() {
  const [wJastip, setWJastip] = useState(20);
  const [wMiniJob, setWMiniJob] = useState(25);
  const [wHasilBumi, setWHasilBumi] = useState(20);
  const [wSelfiePoW, setWSelfiePoW] = useState(20);
  const [wInklusi, setWInklusi] = useState(15);

  const totalWeight = wJastip + wMiniJob + wHasilBumi + wSelfiePoW + wInklusi;

  const handleReset = () => {
    setWJastip(20);
    setWMiniJob(25);
    setWHasilBumi(20);
    setWSelfiePoW(20);
    setWInklusi(15);
    toast.info("Bobot Dikembalikan ke Standar AHP", {
      description: "Jastip 20%, MiniJob 25%, HasilBumi 20%, SelfiePoW 20%, Inklusi 15%",
    });
  };

  const sampleApplicants = [
    {
      name: "Pak Slamet Riyadi (Petani & Kurir)",
      scores: { jastip: 85, miniJob: 92, hasilBumi: 88, selfiePoW: 95, inklusi: 87 },
    },
    {
      name: "Mbah Suroto (Pekerja Disabilitas)",
      scores: { jastip: 70, miniJob: 98, hasilBumi: 75, selfiePoW: 96, inklusi: 100 },
    },
    {
      name: "Ibu Siti Rohmah (Pengrajin Tempe)",
      scores: { jastip: 80, miniJob: 72, hasilBumi: 80, selfiePoW: 78, inklusi: 75 },
    },
    {
      name: "Budi Santoso (Buruh Harian)",
      scores: { jastip: 55, miniJob: 60, hasilBumi: 68, selfiePoW: 65, inklusi: 60 },
    },
  ];

  const calculateSimulatedScore = (scores: {
    jastip: number;
    miniJob: number;
    hasilBumi: number;
    selfiePoW: number;
    inklusi: number;
  }) => {
    if (totalWeight === 0) return 0;
    const raw =
      (scores.jastip * wJastip +
        scores.miniJob * wMiniJob +
        scores.hasilBumi * wHasilBumi +
        scores.selfiePoW * wSelfiePoW +
        scores.inklusi * wInklusi) /
      totalWeight;
    return raw;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Radar Sensitivitas Bobot SPK AHP-TOPSIS
              <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-500 border-cyan-500/30 font-medium">
                Simulasi BAPPERIDA
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Eksperimen pembobotan kriteria untuk mengevaluasi dampak kebijakan inklusi dan permodalan desa.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Bobot Standar</span>
          </Button>
        </div>

        {/* Sliders & Radar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sliders Card */}
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  Konfigurasi 5 Bobot Kriteria
                </CardTitle>
                <Badge
                  variant={totalWeight === 100 ? "outline" : "destructive"}
                  className="text-xs font-mono font-bold"
                >
                  Total: {totalWeight}% {totalWeight === 100 ? "(Normal)" : "(Perlu 100%)"}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Geser nilai bobot untuk melihat simulasi pergeseran kelayakan modal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {/* Slider 1: MiniJob */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">1. Mini-Job Inklusif (w_minijob)</span>
                  <span className="font-mono font-bold text-primary">{wMiniJob}%</span>
                </div>
                <Slider value={[wMiniJob]} min={5} max={50} step={1} onValueChange={([v]) => setWMiniJob(v)} />
              </div>

              {/* Slider 2: Jastip */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">2. Nebeng-Jastip Searah (w_jastip)</span>
                  <span className="font-mono font-bold text-cyan-500">{wJastip}%</span>
                </div>
                <Slider value={[wJastip]} min={5} max={50} step={1} onValueChange={([v]) => setWJastip(v)} />
              </div>

              {/* Slider 3: Hasil Bumi */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">3. Bursa Hasil Bumi (w_hasilbumi)</span>
                  <span className="font-mono font-bold text-amber-500">{wHasilBumi}%</span>
                </div>
                <Slider value={[wHasilBumi]} min={5} max={50} step={1} onValueChange={([v]) => setWHasilBumi(v)} />
              </div>

              {/* Slider 4: Selfie PoW */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">4. Selfie Proof-of-Work (w_selfie)</span>
                  <span className="font-mono font-bold text-purple-500">{wSelfiePoW}%</span>
                </div>
                <Slider value={[wSelfiePoW]} min={5} max={50} step={1} onValueChange={([v]) => setWSelfiePoW(v)} />
              </div>

              {/* Slider 5: Inklusi */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">5. Inklusi Disabilitas / Lansia (w_inklusi)</span>
                  <span className="font-mono font-bold text-rose-500">{wInklusi}%</span>
                </div>
                <Slider value={[wInklusi]} min={5} max={50} step={1} onValueChange={([v]) => setWInklusi(v)} />
              </div>
            </CardContent>
          </Card>

          {/* Radar Visualization */}
          <SpkRadarChart
            title="Profil Radar Pembobotan Aktif"
            description="Visualisasi proporsi kriteria multi-dimensi AHP-TOPSIS"
            data={[
              { pilar: "Mini-Job", nilai: wMiniJob * 2, bobot: wMiniJob },
              { pilar: "Jastip", nilai: wJastip * 2, bobot: wJastip },
              { pilar: "Hasil Bumi", nilai: wHasilBumi * 2, bobot: wHasilBumi },
              { pilar: "Selfie PoW", nilai: wSelfiePoW * 2, bobot: wSelfiePoW },
              { pilar: "Inklusi", nilai: wInklusi * 2, bobot: wInklusi },
            ]}
          />
        </div>

        {/* Simulation Impact Table */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>Simulasi Dampak Skor Terhadap Kelayakan Warga</span>
              <span className="text-xs font-normal text-muted-foreground">Ambang Batas Grade A: &ge; 85 Pts</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Perubahan nilai akhir warga saat bobot kriteria disesuaikan oleh perencana daerah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Nama Pemohon</TableHead>
                    <TableHead className="text-xs">Mini-Job</TableHead>
                    <TableHead className="text-xs">Jastip</TableHead>
                    <TableHead className="text-xs">Hasil Bumi</TableHead>
                    <TableHead className="text-xs">Selfie PoW</TableHead>
                    <TableHead className="text-xs">Inklusi</TableHead>
                    <TableHead className="text-xs">Skor Hasil Simulasi</TableHead>
                    <TableHead className="text-xs text-right">Kelayakan Modal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleApplicants.map((applicant) => {
                    const simScore = calculateSimulatedScore(applicant.scores);
                    const isGradeA = simScore >= 85;
                    const isGradeB = simScore >= 70 && simScore < 85;

                    return (
                      <TableRow key={applicant.name}>
                        <TableCell className="text-xs font-semibold text-foreground">
                          {applicant.name}
                        </TableCell>
                        <TableCell className="text-xs font-mono">{applicant.scores.miniJob}</TableCell>
                        <TableCell className="text-xs font-mono">{applicant.scores.jastip}</TableCell>
                        <TableCell className="text-xs font-mono">{applicant.scores.hasilBumi}</TableCell>
                        <TableCell className="text-xs font-mono">{applicant.scores.selfiePoW}</TableCell>
                        <TableCell className="text-xs font-mono">{applicant.scores.inklusi}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-foreground">
                          {simScore.toFixed(1)} Pts
                        </TableCell>
                        <TableCell className="text-xs text-right">
                          {isGradeA && (
                            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                              Grade A (Rp1.5M)
                            </Badge>
                          )}
                          {isGradeB && (
                            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                              Grade B (Binaan)
                            </Badge>
                          )}
                          {!isGradeA && !isGradeB && (
                            <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px]">
                              Grade C
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
