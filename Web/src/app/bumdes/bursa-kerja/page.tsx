"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Briefcase,
  PlusCircle,
  Accessibility,
  Camera,
  Coins,
  Wallet,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
} from "lucide-react";

interface MiniJobItem {
  id: string;
  title: string;
  category: string;
  rewardCash: number;
  rewardPoints: number;
  isDisabilityFriendly: boolean;
  requiresPoW: boolean;
  status: "OPEN" | "LOCKED_BY_PRIORITY" | "COMPLETED";
  claimedBy?: string | null;
  pekon: string;
}

const INITIAL_JOBS: MiniJobItem[] = [
  {
    id: "JOB-401",
    title: "Pemilahan & Sortasi Singkong Panen BUMDes",
    category: "Pertanian & Logistik",
    rewardCash: 75000,
    rewardPoints: 10,
    isDisabilityFriendly: true,
    requiresPoW: true,
    status: "LOCKED_BY_PRIORITY",
    claimedBy: "Mbah Suroto (Disabilitas)",
    pekon: "Pagelaran",
  },
  {
    id: "JOB-402",
    title: "Pengemasan Telur Organik Paket Stunting",
    category: "Pangan & Nutrisi",
    rewardCash: 50000,
    rewardPoints: 8,
    isDisabilityFriendly: true,
    requiresPoW: true,
    status: "OPEN",
    claimedBy: null,
    pekon: "Pagelaran",
  },
  {
    id: "JOB-403",
    title: "Pembersihan Saluran Irigasi Tersier Blok C",
    category: "Infrastruktur Lingkungan",
    rewardCash: 90000,
    rewardPoints: 12,
    isDisabilityFriendly: false,
    requiresPoW: true,
    status: "COMPLETED",
    claimedBy: "Pak Slamet Riyadi",
    pekon: "Pagelaran",
  },
  {
    id: "JOB-404",
    title: "Kurir Pengantaran Hasil Panen ke Pengepul",
    category: "Nebeng-Jastip Logistik",
    rewardCash: 60000,
    rewardPoints: 10,
    isDisabilityFriendly: false,
    requiresPoW: true,
    status: "OPEN",
    claimedBy: null,
    pekon: "Pagelaran",
  },
];

export default function BursaKerjaPage() {
  const { activePekon } = useAuth();
  const [jobs, setJobs] = useState<MiniJobItem[]>(INITIAL_JOBS);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Pertanian & Pangan");
  const [newCash, setNewCash] = useState("65000");
  const [newPoints, setNewPoints] = useState("8");
  const [newDisability, setNewDisability] = useState(true);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: MiniJobItem = {
      id: `JOB-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      category: newCategory,
      rewardCash: Number(newCash),
      rewardPoints: Number(newPoints),
      isDisabilityFriendly: newDisability,
      requiresPoW: true,
      status: "OPEN",
      claimedBy: null,
      pekon: activePekon.namaPekon,
    };

    setJobs((prev) => [newJob, ...prev]);
    setCreateModalOpen(false);
    setNewTitle("");
    toast.success("Mini-Job Baru Berhasil Dipublikasikan", {
      description: `Tugas "${newJob.title}" aktif di bursa dengan prioritas inklusi otomatis.`,
    });
  };

  const handleApprovePoW = (job: MiniJobItem) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: "COMPLETED" } : j))
    );
    toast.success("Bukti Kerja PoW Divalidasi", {
      description: `Upah ${formatRupiah(job.rewardCash)} dan +${job.rewardPoints} Poin telah dilepaskan ke dompet ${job.claimedBy}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Bursa Mini-Job Inklusif
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-medium">
                {activePekon.namaPekon}
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Tugas produktif desa dengan prinsip zero-discrimination dan kunci prioritas inklusi disabilitas/lansia.
            </p>
          </div>
          <Button
            size="sm"
            className="text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setCreateModalOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Buat Tugas Baru</span>
          </Button>
        </div>

        {/* Info Banner Zero-Discrimination */}
        <Card className="border-border/60 bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <Accessibility className="h-4 w-4" />
              </div>
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-foreground">
                  Protokol Inklusi Auto-Lock Backend Aktif
                </div>
                <div className="text-muted-foreground text-[11px]">
                  Pekerjaan berlabel Disabilitas Friendly secara otomatis mengunci kuota 15 menit awal untuk warga berkebutuhan khusus terdaftar.
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-500 bg-background/50">
              Zero-Discrimination
            </Badge>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Daftar Tugas Mikro Aktif ({jobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID Tugas</TableHead>
                    <TableHead className="text-xs">Judul & Kategori Pekerjaan</TableHead>
                    <TableHead className="text-xs">Upah Kas (Rp)</TableHead>
                    <TableHead className="text-xs">Bonus Poin</TableHead>
                    <TableHead className="text-xs">Inklusi</TableHead>
                    <TableHead className="text-xs">Status / Pelaksana</TableHead>
                    <TableHead className="text-xs text-right">Aksi BUMDes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-mono text-xs font-semibold">{job.id}</TableCell>
                      <TableCell className="text-xs">
                        <div className="font-semibold text-foreground">{job.title}</div>
                        <div className="text-[10px] text-muted-foreground">{job.category}</div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground font-mono">
                        {formatRupiah(job.rewardCash)}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-amber-500 font-mono">
                        +{job.rewardPoints} Pts
                      </TableCell>
                      <TableCell className="text-xs">
                        {job.isDisabilityFriendly ? (
                          <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10 gap-1">
                            <Accessibility className="h-3 w-3" />
                            Ramah Disabilitas
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/80">
                            Fisik Umum
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {job.status === "OPEN" && (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            Terbuka untuk Diklaim
                          </Badge>
                        )}
                        {job.status === "LOCKED_BY_PRIORITY" && (
                          <div className="space-y-0.5">
                            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] gap-1">
                              <Lock className="h-2.5 w-2.5" />
                              Sedang Dikerjakan
                            </Badge>
                            <div className="text-[10px] text-muted-foreground">{job.claimedBy}</div>
                          </div>
                        )}
                        {job.status === "COMPLETED" && (
                          <div className="space-y-0.5">
                            <Badge className="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-[10px]">
                              Tuntas Selesai
                            </Badge>
                            <div className="text-[10px] text-muted-foreground">{job.claimedBy}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        {job.status === "LOCKED_BY_PRIORITY" && (
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                            onClick={() => handleApprovePoW(job)}
                          >
                            <Camera className="h-3.5 w-3.5" />
                            <span>Validasi PoW</span>
                          </Button>
                        )}
                        {job.status === "OPEN" && (
                          <span className="text-[11px] text-muted-foreground">Menunggu Warga</span>
                        )}
                        {job.status === "COMPLETED" && (
                          <span className="text-[11px] text-emerald-500 flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Upah Dilepas
                          </span>
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

      {/* Create Mini-Job Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateJob}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Buat Tugas Mini-Job Baru
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Publikasikan pekerjaan mikro yang dapat diambil oleh warga sekitar
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="title-input" className="text-xs">Judul Tugas Pekerjaan</Label>
                <Input
                  id="title-input"
                  required
                  placeholder="Contoh: Sortasi Kopi Lanang Grade 1"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cash-input" className="text-xs">Upah Kas Tunai (Rp)</Label>
                  <Input
                    id="cash-input"
                    type="number"
                    required
                    value={newCash}
                    onChange={(e) => setNewCash(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="points-input" className="text-xs">Bonus Poin Gizi</Label>
                  <Input
                    id="points-input"
                    type="number"
                    required
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/30">
                <div className="space-y-0.5">
                  <Label htmlFor="disability-toggle" className="text-xs font-medium">Prioritas Inklusi / Disabilitas Friendly</Label>
                  <div className="text-[10px] text-muted-foreground">Tugas dapat dikerjakan tanpa beban fisik berlebih</div>
                </div>
                <Switch
                  id="disability-toggle"
                  checked={newDisability}
                  onCheckedChange={setNewDisability}
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Terbitkan Tugas
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
