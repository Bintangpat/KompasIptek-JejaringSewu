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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Coins,
  Apple,
  PackageCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  QrCode,
  HeartPulse,
} from "lucide-react";

interface NutritionCatalogItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  availableStock: number;
}

const CATALOG: NutritionCatalogItem[] = [
  {
    id: "PKG-01",
    name: "Paket Protein Telur & Lele Segar",
    description: "1 kg Telur Ayam Kampung Pekon & 1 kg Ikan Lele Budidaya Warga Pagelaran.",
    pointsCost: 30,
    availableStock: 45,
  },
  {
    id: "PKG-02",
    name: "Paket Sayur Segar & Tempe Non-GMO",
    description: "Bayam, wortel, labu siam segar petik dari kebun organik warga sekitar.",
    pointsCost: 20,
    availableStock: 28,
  },
  {
    id: "PKG-03",
    name: "Paket Sari Kedelai & Madu Murni",
    description: "Minuman protein tinggi untuk balita kurus dan ibu hamil dari BUMDes.",
    pointsCost: 40,
    availableStock: 12,
  },
];

export default function CitizenPoinPage() {
  const { user } = useAuth();
  const [points, setPoints] = useState<number>(Number(user.wallet?.pointsBalance || 185));
  const [selectedPkg, setSelectedPkg] = useState<NutritionCatalogItem | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [claimCode, setClaimCode] = useState("");

  const handleRedeem = () => {
    if (!selectedPkg) return;
    if (points < selectedPkg.pointsCost) {
      toast.error("Poin Tidak Mencukupi", {
        description: `Anda membutuhkan ${selectedPkg.pointsCost} Pts, saldo saat ini ${points} Pts.`,
      });
      return;
    }

    setPoints((prev) => prev - selectedPkg.pointsCost);
    const code = `GIZI-${Math.floor(1000 + Math.random() * 9000)}`;
    setClaimCode(code);
    setConfirmOpen(false);
    setSuccessOpen(true);
    toast.success("Penukaran Poin Berhasil!", {
      description: `${selectedPkg.pointsCost} Poin berhasil ditukar dengan ${selectedPkg.name}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Penukaran Poin Kebaikan & Paket Gizi
              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/30 font-medium">
                Poin Nutrisi
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Gunakan poin hasil kontribusi jastip dan mini-job untuk menebus komoditas pangan hewani dan nabati sehat.
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="border-border/60 bg-gradient-to-r from-amber-500/10 via-primary/5 to-card border-amber-500/20">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-amber-500" />
                Saldo Poin Kebaikan Anda
              </span>
              <div className="text-3xl font-extrabold text-foreground font-mono flex items-baseline gap-2">
                <span>{points}</span>
                <span className="text-sm font-semibold text-amber-500">Poin Aktif</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground sm:max-w-xs text-left sm:text-right">
              Poin diperoleh otomatis dari setiap penyelesaian order jastip, panen bursa, dan pekerjaan inklusif terverifikasi PoW.
            </div>
          </CardContent>
        </Card>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATALOG.map((pkg) => {
            const canAfford = points >= pkg.pointsCost;
            return (
              <Card key={pkg.id} className="border-border/60 bg-card/60 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="text-xs font-mono font-bold text-amber-500 border-amber-500/40 bg-amber-500/5 gap-1"
                    >
                      <Coins className="h-3.5 w-3.5" />
                      {pkg.pointsCost} Pts
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">Stok: {pkg.availableStock}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-2 leading-tight">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button
                    size="sm"
                    disabled={!canAfford}
                    className={`w-full text-xs h-9 font-medium gap-1.5 ${
                      canAfford
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground"
                    }`}
                    onClick={() => {
                      setSelectedPkg(pkg);
                      setConfirmOpen(true);
                    }}
                  >
                    <PackageCheck className="h-4 w-4" />
                    <span>{canAfford ? "Tukar Paket Ini" : "Poin Belum Cukup"}</span>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {selectedPkg && (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-500" />
                Konfirmasi Penukaran Poin
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Tukar {selectedPkg.pointsCost} poin dengan {selectedPkg.name}?
              </DialogDescription>
            </DialogHeader>

            <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saldo Saat Ini:</span>
                <span className="font-mono font-bold">{points} Pts</span>
              </div>
              <div className="flex justify-between text-rose-500">
                <span>Poin Terpotong:</span>
                <span className="font-mono font-bold">-{selectedPkg.pointsCost} Pts</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border/40 font-semibold">
                <span>Sisa Saldo Nanti:</span>
                <span className="font-mono text-emerald-500">{points - selectedPkg.pointsCost} Pts</span>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button size="sm" onClick={handleRedeem} className="text-xs">
                Ya, Konfirmasi Tukar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Success Pickup Dialog with Barcode/PIN */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-base font-bold">Klaim Paket Berhasil!</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tunjukkan kode ini saat mengambil paket di kantor BUMDes
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-primary/40 inline-block shadow-lg">
              <QrCode className="h-28 w-28 text-primary mx-auto" />
            </div>
            <div className="font-mono text-lg font-extrabold text-foreground tracking-widest bg-muted/60 p-2 rounded-lg border border-border/60">
              {claimCode}
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setSuccessOpen(false)} className="w-full text-xs">
              Selesai & Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
