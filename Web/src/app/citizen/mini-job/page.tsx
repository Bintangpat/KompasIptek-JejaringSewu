"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { useMiniJobs, useMiniJobActions } from "@/features/mini-job/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Briefcase,
  Accessibility,
  Camera,
  Coins,
  Wallet,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface CitizenJobItem {
  id: string;
  title: string;
  category: string;
  description: string;
  rewardCash: number;
  rewardPoints: number;
  isDisabilityFriendly: boolean;
  status: "OPEN" | "CLAIMED_BY_ME" | "COMPLETED";
}

const INITIAL_CITIZEN_JOBS: CitizenJobItem[] = [
  {
    id: "JOB-401",
    title: "Pemilahan & Sortasi Singkong Panen BUMDes",
    category: "Pertanian & Logistik",
    description: "Memisahkan singkong kualitas prima dari sisa panen untuk pengiriman ke pengepul jujur.",
    rewardCash: 75000,
    rewardPoints: 10,
    isDisabilityFriendly: true,
    status: "OPEN",
  },
  {
    id: "JOB-402",
    title: "Pengemasan Telur Organik Paket Stunting",
    category: "Pangan & Nutrisi",
    description: "Menimbang dan memasukkan telur ayam kampung ke dalam boks karton higienis.",
    rewardCash: 50000,
    rewardPoints: 8,
    isDisabilityFriendly: true,
    status: "OPEN",
  },
  {
    id: "JOB-403",
    title: "Kurir Pengantaran Sayuran ke Dapur Gizi",
    category: "Logistik Nebeng",
    description: "Mengantarkan paket sayur segar dari kebun warga ke posko BUMDes Pagelaran.",
    rewardCash: 45000,
    rewardPoints: 6,
    isDisabilityFriendly: false,
    status: "OPEN",
  },
];

export default function CitizenMiniJobPage() {
  const { activePekon, user } = useAuth();
  const { data: realJobs, refetch: refetchJobs } = useMiniJobs();
  const { claimJob, isClaiming } = useMiniJobActions();
  const [jobs, setJobs] = useState<CitizenJobItem[]>(INITIAL_CITIZEN_JOBS);

  React.useEffect(() => {
    if (realJobs && realJobs.length > 0) {
      const mapped: CitizenJobItem[] = realJobs.map((j) => ({
        id: j.id,
        title: j.title,
        category: "Tugas Mikro Desa",
        description: j.description,
        rewardCash: Number(j.wageAmount),
        rewardPoints: 10,
        isDisabilityFriendly: j.isDisabilityFriendly,
        status: j.workerId === user.id ? "CLAIMED_BY_ME" : (j.status as any) || "OPEN",
      }));
      setJobs(mapped);
    }
  }, [realJobs, user.id]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleClaim = async (job: CitizenJobItem) => {
    try {
      await claimJob(job.id);
      refetchJobs();
    } catch {
      // Local fallback
    }

    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: "CLAIMED_BY_ME" } : j))
    );
    toast.success("Tugas Mini-Job Berhasil Diklaim!", {
      description: `Tugas "${job.title}" kini aktif. Selesaikan pekerjaan dan unggah bukti di Studio Selfie PoW.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Feed Mini-Job Inklusif (Pekerjaan Mikro)
              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/30 font-medium">
                Warga {activePekon.namaPekon}
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Ambil tugas produktif di sekitarmu, dapatkan upah kas langsung dan poin tambahan untuk penukaran paket gizi.
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs gap-1.5 border-primary/40 text-primary">
            <Link href="/citizen/pow">
              <Camera className="h-3.5 w-3.5" />
              <span>Buka Studio Selfie PoW</span>
            </Link>
          </Button>
        </div>

        {/* Jobs Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border-border/60 bg-card/60 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  {job.isDisabilityFriendly ? (
                    <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10 gap-1">
                      <Accessibility className="h-3 w-3" />
                      Inklusif & Ramah Disabilitas
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/80">
                      Fisik Lapangan
                    </Badge>
                  )}
                  <span className="text-[10px] font-mono text-muted-foreground">{job.id}</span>
                </div>
                <CardTitle className="text-sm font-bold text-foreground mt-2 leading-tight">
                  {job.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {job.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Upah Kas:</span>
                    <span className="font-bold text-foreground text-sm font-mono">
                      {formatRupiah(job.rewardCash)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[11px]">Bonus Poin:</span>
                    <span className="font-bold text-amber-500 text-sm font-mono">
                      +{job.rewardPoints} Pts
                    </span>
                  </div>
                </div>

                {job.status === "OPEN" && (
                  <Button
                    size="sm"
                    className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleClaim(job)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    <span>Klaim Tugas Ini</span>
                  </Button>
                )}

                {job.status === "CLAIMED_BY_ME" && (
                  <div className="space-y-2">
                    <Badge className="w-full justify-center bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-xs py-1">
                      Sedang Anda Kerjakan
                    </Badge>
                    <Button
                      asChild
                      size="sm"
                      className="w-full text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                    >
                      <Link href="/citizen/pow">
                        <Camera className="h-3.5 w-3.5" />
                        <span>Kirim Bukti PoW (Kamera)</span>
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
