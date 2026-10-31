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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Apple,
  Package,
  PlusCircle,
  Coins,
  CheckCircle2,
  Clock,
  HeartPulse,
  Fish,
  Egg,
  Sparkles,
} from "lucide-react";

interface NutritionPackageItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  stockCount: number;
  maxStock: number;
  targetGroup: string;
}

interface RedemptionItem {
  id: string;
  wargaName: string;
  balitaName: string;
  packageName: string;
  pointsDeducted: number;
  status: "WAITING_PICKUP" | "COMPLETED";
  redeemedAt: string;
}

const INITIAL_PACKAGES: NutritionPackageItem[] = [
  {
    id: "PKG-01",
    name: "Paket Protein Hewani (Telur + Lele Segar)",
    description: "1 kg Telur Ayam Kampung Pekon & 1 kg Ikan Lele Budidaya Warga",
    pointsCost: 30,
    stockCount: 45,
    maxStock: 60,
    targetGroup: "Balita Stunting (Usia 6-24 Bulan)",
  },
  {
    id: "PKG-02",
    name: "Paket Sayur Pekon & Tempe Higienis",
    description: "Bayam organik, wortel, labu siam, dan tempe non-rekayasa",
    pointsCost: 20,
    stockCount: 28,
    maxStock: 40,
    targetGroup: "Ibu Hamil & Menyusui",
  },
  {
    id: "PKG-03",
    name: "Paket Susu Kedelai Lokal & Madu Hutan",
    description: "1 liter Sari Kedelai segar BUMDes dan 250ml Madu Asli Pringsewu",
    pointsCost: 40,
    stockCount: 12,
    maxStock: 25,
    targetGroup: "Pemulihan Gizi Buruk Akut",
  },
];

const INITIAL_REDEMPTIONS: RedemptionItem[] = [
  {
    id: "RDM-1092",
    wargaName: "Ibu Anisa",
    balitaName: "Adik Fikri (14 bln)",
    packageName: "Paket Protein Hewani (Telur + Lele)",
    pointsDeducted: 30,
    status: "WAITING_PICKUP",
    redeemedAt: "Hari ini, 08:30",
  },
  {
    id: "RDM-1091",
    wargaName: "Ibu Maryani",
    balitaName: "Adik Danu (20 bln)",
    packageName: "Paket Sayur Pekon & Tempe",
    pointsDeducted: 20,
    status: "COMPLETED",
    redeemedAt: "Kemarin, 15:40",
  },
  {
    id: "RDM-1090",
    wargaName: "Pak Slamet (Kakek)",
    balitaName: "Cucu Raka (18 bln)",
    packageName: "Paket Protein Hewani (Telur + Lele)",
    pointsDeducted: 30,
    status: "COMPLETED",
    redeemedAt: "26 Okt 2026",
  },
];

export default function NutritionPage() {
  const { activePekon } = useAuth();
  const [packages, setPackages] = useState<NutritionPackageItem[]>(INITIAL_PACKAGES);
  const [redemptions, setRedemptions] = useState<RedemptionItem[]>(INITIAL_REDEMPTIONS);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<NutritionPackageItem | null>(null);
  const [restockQty, setRestockQty] = useState("10");

  const handleRestock = () => {
    if (!selectedPkg) return;
    const qty = Number(restockQty);
    setPackages((prev) =>
      prev.map((p) =>
        p.id === selectedPkg.id ? { ...p, stockCount: p.stockCount + qty } : p
      )
    );
    setRestockModalOpen(false);
    toast.success("Stok Paket Nutrisi Berhasil Ditambahkan", {
      description: `+${qty} unit stok ditambahkan untuk ${selectedPkg.name}`,
    });
  };

  const handleHandover = (rdm: RedemptionItem) => {
    setRedemptions((prev) =>
      prev.map((r) =>
        r.id === rdm.id ? { ...r, status: "COMPLETED" } : r
      )
    );
    toast.success("Penyerahan Paket Selesai", {
      description: `Paket ${rdm.packageName} telah diserahkan langsung kepada ${rdm.wargaName}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Penyaluran Paket Nutrisi & Stunting
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-medium">
                {activePekon.namaPekon}
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Program konversi poin sirkular warga menjadi komoditas pangan hewani & nabati bergizi tinggi.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                setSelectedPkg(packages[0]);
                setRestockModalOpen(true);
              }}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Tambah Stok Paket</span>
            </Button>
          </div>
        </div>

        {/* Package Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const percentage = Math.round((pkg.stockCount / pkg.maxStock) * 100);
            return (
              <Card key={pkg.id} className="border-border/60 bg-card/60 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      Biaya: {pkg.pointsCost} Poin
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">ID: {pkg.id}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-2 leading-tight">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1 text-muted-foreground">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="text-[11px] text-muted-foreground">
                    Target: <b className="text-foreground">{pkg.targetGroup}</b>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Ketersediaan Stok:</span>
                      <span className="font-bold text-foreground">
                        {pkg.stockCount} / {pkg.maxStock} Paket
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-8 gap-1 border-border/80 hover:bg-muted"
                    onClick={() => {
                      setSelectedPkg(pkg);
                      setRestockModalOpen(true);
                    }}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Restock Paket Ini</span>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Redemption Queue Table */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-rose-500" />
                Antrean Penukaran Poin Nutrisi Warga ({redemptions.length})
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Verifikasi serah terima paket nutrisi fisik sebelum status penukaran diselesaikan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID Klaim</TableHead>
                    <TableHead className="text-xs">Penerima Manfaat / Warga</TableHead>
                    <TableHead className="text-xs">Nama Balita / Sasaran</TableHead>
                    <TableHead className="text-xs">Paket Nutrisi</TableHead>
                    <TableHead className="text-xs">Poin Terpotong</TableHead>
                    <TableHead className="text-xs">Waktu</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Aksi BUMDes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((rdm) => (
                    <TableRow key={rdm.id}>
                      <TableCell className="font-mono text-xs font-semibold">{rdm.id}</TableCell>
                      <TableCell className="text-xs font-medium text-foreground">{rdm.wargaName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{rdm.balitaName}</TableCell>
                      <TableCell className="text-xs font-medium">{rdm.packageName}</TableCell>
                      <TableCell className="text-xs font-bold text-amber-500 font-mono">
                        -{rdm.pointsDeducted} Pts
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{rdm.redeemedAt}</TableCell>
                      <TableCell className="text-xs">
                        {rdm.status === "WAITING_PICKUP" ? (
                          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                            Siap Diambil
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            Telah Diterima
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        {rdm.status === "WAITING_PICKUP" && (
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                            onClick={() => handleHandover(rdm)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Serah Terima</span>
                          </Button>
                        )}
                        {rdm.status === "COMPLETED" && (
                          <span className="text-[11px] text-muted-foreground flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            Selesai
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

      {/* Restock Dialog */}
      {selectedPkg && (
        <Dialog open={restockModalOpen} onOpenChange={setRestockModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Tambah Stok Paket Gizi
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Tambah kuota paket {selectedPkg.name} di BUMDes {activePekon.namaPekon}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="qty-input" className="text-xs">Jumlah Paket yang Ditambahkan</Label>
                <Input
                  id="qty-input"
                  type="number"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="ghost" size="sm" onClick={() => setRestockModalOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button size="sm" onClick={handleRestock} className="text-xs">
                Simpan Penambahan Stok
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
