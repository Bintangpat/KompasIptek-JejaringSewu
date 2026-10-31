"use client";

import React, { useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SpkRadarChart } from "@/components/charts/spk-radar-chart";
import { toast } from "sonner";
import {
  Scale,
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Coins,
  Camera,
  Car,
  Briefcase,
  ShoppingBag,
} from "lucide-react";

interface CreditScoringItem {
  id: string;
  wargaName: string;
  pekon: string;
  skorFinal: number;
  grade: "GRADE_A_LAYAK_MODAL" | "GRADE_B_PEMBINAAN" | "GRADE_C_AWAL";
  plafonRekomendasi: string;
  status: "ELIGIBLE_WAITING_BUMDES" | "APPROVED" | "DISBURSED";
  breakdown: {
    jastip: number;
    miniJob: number;
    hasilBumi: number;
    selfiePoW: number;
    inklusi: number;
  };
}

const MOCK_SCORING_ITEMS: CreditScoringItem[] = [
  {
    id: "sc-01",
    wargaName: "Pak Slamet Riyadi",
    pekon: "Pagelaran",
    skorFinal: 89.4,
    grade: "GRADE_A_LAYAK_MODAL",
    plafonRekomendasi: "Rp 1.500.000",
    status: "ELIGIBLE_WAITING_BUMDES",
    breakdown: {
      jastip: 85,
      miniJob: 92,
      hasilBumi: 88,
      selfiePoW: 95,
      inklusi: 87,
    },
  },
  {
    id: "sc-02",
    wargaName: "Mbah Suroto",
    pekon: "Pagelaran",
    skorFinal: 86.2,
    grade: "GRADE_A_LAYAK_MODAL",
    plafonRekomendasi: "Rp 1.500.000",
    status: "ELIGIBLE_WAITING_BUMDES",
    breakdown: {
      jastip: 70,
      miniJob: 98,
      hasilBumi: 75,
      selfiePoW: 96,
      inklusi: 100, // Disabilitas prioritas
    },
  },
  {
    id: "sc-03",
    wargaName: "Ibu Siti Rohmah",
    pekon: "Pagelaran",
    skorFinal: 76.8,
    grade: "GRADE_B_PEMBINAAN",
    plafonRekomendasi: "Rp 750.000 (Pendampingan)",
    status: "ELIGIBLE_WAITING_BUMDES",
    breakdown: {
      jastip: 80,
      miniJob: 72,
      hasilBumi: 80,
      selfiePoW: 78,
      inklusi: 75,
    },
  },
  {
    id: "sc-04",
    wargaName: "Budi Santoso",
    pekon: "Pagelaran",
    skorFinal: 62.5,
    grade: "GRADE_C_AWAL",
    plafonRekomendasi: "Rp 0 (Perlu Tingkatkan PoW)",
    status: "ELIGIBLE_WAITING_BUMDES",
    breakdown: {
      jastip: 55,
      miniJob: 60,
      hasilBumi: 68,
      selfiePoW: 65,
      inklusi: 60,
    },
  },
  {
    id: "sc-05",
    wargaName: "Dewi Lestari",
    pekon: "Pagelaran",
    skorFinal: 88.0,
    grade: "GRADE_A_LAYAK_MODAL",
    plafonRekomendasi: "Rp 1.500.000",
    status: "APPROVED",
    breakdown: {
      jastip: 82,
      miniJob: 90,
      hasilBumi: 86,
      selfiePoW: 92,
      inklusi: 95,
    },
  },
];

export default function CreditScoringPage() {
  const { activePekon } = useAuth();
  const [data, setData] = useState<CreditScoringItem[]>(MOCK_SCORING_ITEMS);
  const [gradeFilter, setGradeFilter] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<CreditScoringItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredData = data.filter((item) => {
    if (gradeFilter === "ALL") return true;
    return item.grade === gradeFilter;
  });

  const handleApproveLoan = (item: CreditScoringItem) => {
    setData((prev) =>
      prev.map((d) => (d.id === item.id ? { ...d, status: "APPROVED" } : d))
    );
    setSheetOpen(false);
    toast.success("Rekomendasi Modal Disetujui", {
      description: `Plafon Rp 1.500.000 untuk ${item.wargaName} siap diteruskan ke proses pencairan.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Rekomendasi Modal AHP-TOPSIS (S_kredit)
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-medium">
                {activePekon.namaPekon}
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Skor kelayakan kredit sirkular berbasis 5 kriteria perilaku produktif tanpa jaminan aset fisik.
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
            <Link href="/bumdes/disbursement">
              <span>Ke Meja Pencairan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Formula Explainer Card */}
        <Card className="border-border/60 bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                Rumus Multi-Kriteria AHP-TOPSIS Terverifikasi
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                S_kredit = (0.20 × Jastip) + (0.25 × MiniJob) + (0.20 × HasilBumi) + (0.20 × SelfiePoW) + (0.15 × Inklusi)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                Grade A &ge; 85: Plafon Rp1.5M
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
                Grade B 70-84: Pembinaan
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Grade Filter Tabs */}
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <Tabs value={gradeFilter} onValueChange={setGradeFilter} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full sm:w-auto h-9">
                <TabsTrigger value="ALL" className="text-xs">Semua Grade</TabsTrigger>
                <TabsTrigger value="GRADE_A_LAYAK_MODAL" className="text-xs">Grade A (Layak)</TabsTrigger>
                <TabsTrigger value="GRADE_B_PEMBINAAN" className="text-xs">Grade B</TabsTrigger>
                <TabsTrigger value="GRADE_C_AWAL" className="text-xs">Grade C</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Scoring Table */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Daftar Rekomendasi Warga ({filteredData.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Nama Pemohon</TableHead>
                    <TableHead className="text-xs">Skor S_kredit</TableHead>
                    <TableHead className="text-xs">Kategori Grade</TableHead>
                    <TableHead className="text-xs">Plafon Rekomendasi</TableHead>
                    <TableHead className="text-xs">Status Review</TableHead>
                    <TableHead className="text-xs text-right">Rincian 5 Pilar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {item.wargaName}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs">{item.skorFinal.toFixed(1)}</span>
                          <Progress value={item.skorFinal} className="w-20 h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.grade === "GRADE_A_LAYAK_MODAL" && (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            Grade A (Layak Modal)
                          </Badge>
                        )}
                        {item.grade === "GRADE_B_PEMBINAAN" && (
                          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                            Grade B (Pembinaan)
                          </Badge>
                        )}
                        {item.grade === "GRADE_C_AWAL" && (
                          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px]">
                            Grade C (Awal)
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {item.plafonRekomendasi}
                      </TableCell>
                      <TableCell className="text-xs">
                        {item.status === "APPROVED" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Disetujui BUMDes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Menunggu Persetujuan
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs gap-1 hover:bg-primary/10 hover:text-primary"
                          onClick={() => {
                            setSelectedItem(item);
                            setSheetOpen(true);
                          }}
                        >
                          <Sliders className="h-3.5 w-3.5" />
                          <span>Inspeksi</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Slide-over Sheet for 5 Pillar Breakdown */}
      {selectedItem && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-base font-bold flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Rincian 5 Pilar Skor ({selectedItem.skorFinal.toFixed(1)})
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Kalkulasi bobot preferensi AHP-TOPSIS pemohon {selectedItem.wargaName}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 py-2">
              {/* Radar Chart */}
              <SpkRadarChart
                title="Peta Pemenuhan Kriteria"
                description={`Skor Total: ${selectedItem.skorFinal.toFixed(1)} / 100`}
                data={[
                  { pilar: "Jastip", nilai: selectedItem.breakdown.jastip, bobot: 20 },
                  { pilar: "Mini-Job", nilai: selectedItem.breakdown.miniJob, bobot: 25 },
                  { pilar: "Hasil Bumi", nilai: selectedItem.breakdown.hasilBumi, bobot: 20 },
                  { pilar: "Selfie PoW", nilai: selectedItem.breakdown.selfiePoW, bobot: 20 },
                  { pilar: "Inklusi", nilai: selectedItem.breakdown.inklusi, bobot: 15 },
                ]}
              />

              {/* 5 Dimensions Details */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border/50 bg-muted/40 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-emerald-500" />
                      Mini-Job (Bobot 25%)
                    </span>
                    <span className="text-foreground">{selectedItem.breakdown.miniJob} Pts</span>
                  </div>
                  <Progress value={selectedItem.breakdown.miniJob} className="h-1.5" />
                </div>

                <div className="p-3 rounded-lg border border-border/50 bg-muted/40 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Car className="h-3.5 w-3.5 text-cyan-500" />
                      Nebeng-Jastip (Bobot 20%)
                    </span>
                    <span className="text-foreground">{selectedItem.breakdown.jastip} Pts</span>
                  </div>
                  <Progress value={selectedItem.breakdown.jastip} className="h-1.5" />
                </div>

                <div className="p-3 rounded-lg border border-border/50 bg-muted/40 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />
                      Hasil Bumi (Bobot 20%)
                    </span>
                    <span className="text-foreground">{selectedItem.breakdown.hasilBumi} Pts</span>
                  </div>
                  <Progress value={selectedItem.breakdown.hasilBumi} className="h-1.5" />
                </div>

                <div className="p-3 rounded-lg border border-border/50 bg-muted/40 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-purple-500" />
                      Selfie Proof-of-Work (Bobot 20%)
                    </span>
                    <span className="text-foreground">{selectedItem.breakdown.selfiePoW} Pts</span>
                  </div>
                  <Progress value={selectedItem.breakdown.selfiePoW} className="h-1.5" />
                </div>

                <div className="p-3 rounded-lg border border-border/50 bg-muted/40 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Coins className="h-3.5 w-3.5 text-rose-500" />
                      Inklusi Sosial (Bobot 15%)
                    </span>
                    <span className="text-foreground">{selectedItem.breakdown.inklusi} Pts</span>
                  </div>
                  <Progress value={selectedItem.breakdown.inklusi} className="h-1.5" />
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                {selectedItem.grade === "GRADE_A_LAYAK_MODAL" && selectedItem.status !== "APPROVED" && (
                  <Button
                    className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    onClick={() => handleApproveLoan(selectedItem)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Setujui Plafon Rp 1.500.000
                  </Button>
                )}
                {selectedItem.status === "APPROVED" && (
                  <Button variant="outline" asChild className="w-full text-xs">
                    <Link href="/bumdes/disbursement">
                      Lanjutkan ke Pencairan Dana
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </DashboardLayout>
  );
}
