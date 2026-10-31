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
import { Input } from "@/components/ui/input";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  KeyRound,
} from "lucide-react";

interface VerificationItem {
  id: string;
  fullName: string;
  maskedNik: string;
  nikHash: string;
  nikEncrypted: string;
  phoneNumber: string;
  vulnerability: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  submittedAt: string;
}

const INITIAL_VERIFICATIONS: VerificationItem[] = [
  {
    id: "verif-01",
    fullName: "Pak Slamet Riyadi",
    maskedNik: "180410******0002",
    nikHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    nikEncrypted: "enc_gcm_9f83a21b...[AES-256]",
    phoneNumber: "081234567894",
    vulnerability: "UMUM (Petani Singkong)",
    status: "VERIFIED",
    submittedAt: "2026-10-24 09:30",
  },
  {
    id: "verif-02",
    fullName: "Mbah Suroto",
    maskedNik: "180410******0005",
    nikHash: "7d1a54127b222502f5b79b5fb0803061152a44f92b37e23c65dd0e336d10e8dd",
    nikEncrypted: "enc_gcm_aa44bc19...[AES-256]",
    phoneNumber: "081234567895",
    vulnerability: "DISABILITAS_FISIK (Prioritas Kerja)",
    status: "PENDING",
    submittedAt: "2026-10-28 14:15",
  },
  {
    id: "verif-03",
    fullName: "Ibu Siti Rohmah",
    maskedNik: "180410******0012",
    nikHash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    nikEncrypted: "enc_gcm_bb8821cf...[AES-256]",
    phoneNumber: "085211223344",
    vulnerability: "LANSIA_PRODUKTIF",
    status: "PENDING",
    submittedAt: "2026-10-29 08:45",
  },
  {
    id: "verif-04",
    fullName: "Budi Santoso",
    maskedNik: "180410******0088",
    nikHash: "9f83a21b222502f5b79b5fb0803061152a44f92b37e23c65dd0e336d10e8ddbb",
    nikEncrypted: "enc_gcm_77aacc01...[AES-256]",
    phoneNumber: "087799001122",
    vulnerability: "UMUM",
    status: "REJECTED",
    submittedAt: "2026-10-22 11:20",
  },
  {
    id: "verif-05",
    fullName: "Dewi Lestari",
    maskedNik: "180410******0091",
    nikHash: "c4ca4238a0b923820dcc509a6f75849b27ae41e4649b934ca495991b7852b855",
    nikEncrypted: "enc_gcm_1234abcd...[AES-256]",
    phoneNumber: "081388990011",
    vulnerability: "KELUARGA_PRA_SEJAHTERA",
    status: "PENDING",
    submittedAt: "2026-10-29 11:00",
  },
];

export default function VerifikasiNikPage() {
  const { activePekon } = useAuth();
  const [data, setData] = useState<VerificationItem[]>(INITIAL_VERIFICATIONS);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<VerificationItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);
  const [confirmRejectOpen, setConfirmRejectOpen] = useState(false);

  const filteredData = data.filter((item) => {
    const matchesFilter = filterStatus === "ALL" || item.status === filterStatus;
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.maskedNik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phoneNumber.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const handleApprove = () => {
    if (!selectedItem) return;
    setData((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "VERIFIED" } : item
      )
    );
    setConfirmApproveOpen(false);
    setDetailModalOpen(false);
    toast.success("Verifikasi NIK Disetujui", {
      description: `Akun warga ${selectedItem.fullName} kini berstatus terverifikasi resmi.`,
    });
  };

  const handleReject = () => {
    if (!selectedItem) return;
    setData((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "REJECTED" } : item
      )
    );
    setConfirmRejectOpen(false);
    setDetailModalOpen(false);
    toast.error("Pengajuan NIK Ditolak", {
      description: `Pengajuan verifikasi untuk ${selectedItem.fullName} telah ditandai ditolak.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Meja Verifikasi NIK Warga
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-medium">
                {activePekon.namaPekon}
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Validasi kesesuaian fisik KTP/KK dengan data terenkripsi AES-256 dan NIK Hash SHA-256.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, NIK bertopeng, atau HP..."
                className="pl-9 text-xs h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-4 w-full md:w-auto h-9">
                <TabsTrigger value="ALL" className="text-xs">Semua</TabsTrigger>
                <TabsTrigger value="PENDING" className="text-xs">Menunggu</TabsTrigger>
                <TabsTrigger value="VERIFIED" className="text-xs">Diterima</TabsTrigger>
                <TabsTrigger value="REJECTED" className="text-xs">Ditolak</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Table List */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>Daftar Pengajuan Verifikasi ({filteredData.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Nama Lengkap</TableHead>
                    <TableHead className="text-xs">NIK (Masked)</TableHead>
                    <TableHead className="text-xs">Kategori Inklusi / Kerentanan</TableHead>
                    <TableHead className="text-xs">No. WhatsApp</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Tanggal</TableHead>
                    <TableHead className="text-xs text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {item.fullName}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                        <Lock className="h-3 w-3 text-primary/70" />
                        {item.maskedNik}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px] font-normal border-border/80">
                          {item.vulnerability}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{item.phoneNumber}</TableCell>
                      <TableCell className="text-xs">
                        {item.status === "VERIFIED" && (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            Terverifikasi
                          </Badge>
                        )}
                        {item.status === "PENDING" && (
                          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                            Menunggu Review
                          </Badge>
                        )}
                        {item.status === "REJECTED" && (
                          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px]">
                            Ditolak
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.submittedAt}</TableCell>
                      <TableCell className="text-xs text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs gap-1 hover:bg-primary/10 hover:text-primary"
                          onClick={() => {
                            setSelectedItem(item);
                            setDetailModalOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Review</span>
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

      {/* Detail Dialog */}
      {selectedItem && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                Review Dokumen Identitas
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Periksa data fisik identitas dengan data kriptografi backend
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama Warga:</span>
                  <span className="font-semibold text-foreground">{selectedItem.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nomor Telepon:</span>
                  <span className="font-mono text-foreground">{selectedItem.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NIK Bertopeng:</span>
                  <span className="font-mono font-semibold text-primary">{selectedItem.maskedNik}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inklusi:</span>
                  <span>{selectedItem.vulnerability}</span>
                </div>
              </div>

              {/* Data Kriptografi Backend */}
              <div className="p-3 rounded-lg bg-background/80 border border-border/60 space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-[11px] text-muted-foreground">
                  <KeyRound className="h-3.5 w-3.5 text-primary" />
                  Kriptografi Zero-Trust (Backend NestJS)
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground">SHA-256 NIK Hash (Pencarian Unik):</div>
                  <div className="font-mono text-[10px] text-foreground break-all bg-muted/60 p-1.5 rounded">
                    {selectedItem.nikHash}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground">AES-256-GCM Payload (Privasi Aman):</div>
                  <div className="font-mono text-[10px] text-foreground break-all bg-muted/60 p-1.5 rounded">
                    {selectedItem.nikEncrypted}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              {selectedItem.status === "PENDING" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-rose-500 border-rose-500/40 hover:bg-rose-500/10"
                    onClick={() => setConfirmRejectOpen(true)}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Tolak Verifikasi
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => setConfirmApproveOpen(true)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Setujui NIK Warga
                  </Button>
                </>
              )}
              {selectedItem.status !== "PENDING" && (
                <Button variant="ghost" size="sm" onClick={() => setDetailModalOpen(false)}>
                  Tutup
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Alert Dialog Konfirmasi Setuju */}
      <AlertDialog open={confirmApproveOpen} onOpenChange={setConfirmApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Konfirmasi Persetujuan NIK
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Apakah Anda yakin telah memverifikasi dokumen fisik asli untuk <b>{selectedItem?.fullName}</b>? Akun ini akan segera dapat mengajukan modal dan membuka bursa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Batal</AlertDialogCancel>
            <AlertDialogAction className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleApprove}>
              Ya, Setujui NIK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog Konfirmasi Tolak */}
      <AlertDialog open={confirmRejectOpen} onOpenChange={setConfirmRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-rose-500 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Konfirmasi Penolakan NIK
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              Apakah Anda yakin data fisik tidak sesuai untuk <b>{selectedItem?.fullName}</b>? Warga harus mengajukan ulang foto dokumen yang jelas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Batal</AlertDialogCancel>
            <AlertDialogAction className="text-xs bg-rose-600 hover:bg-rose-700 text-white" onClick={handleReject}>
              Tolak Pengajuan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
