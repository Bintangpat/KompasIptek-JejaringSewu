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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ShoppingBag,
  PlusCircle,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Scale,
  Sparkles,
} from "lucide-react";

interface CommodityItem {
  id: string;
  name: string;
  farmerName: string;
  pekon: string;
  quantity: string;
  pricePerKg: number;
  marketPricePerKg: number;
  trustedCollector: string;
  postedAt: string;
}

const INITIAL_COMMODITIES: CommodityItem[] = [
  {
    id: "BRS-101",
    name: "Singkong Gajah Organik",
    farmerName: "Pak Slamet Riyadi",
    pekon: "Pagelaran",
    quantity: "1.200 Kg",
    pricePerKg: 1650,
    marketPricePerKg: 1350,
    trustedCollector: "Haji Rohmat (Pengepul Jujur)",
    postedAt: "Hari ini, 07:15",
  },
  {
    id: "BRS-102",
    name: "Jagung Pipil Kering Hibrida",
    farmerName: "Pak Teguh Santoso",
    pekon: "Pringsewu Barat",
    quantity: "850 Kg",
    pricePerKg: 5200,
    marketPricePerKg: 4800,
    trustedCollector: "Koperasi Tani Sejahtera",
    postedAt: "Hari ini, 08:30",
  },
  {
    id: "BRS-103",
    name: "Kopi Robusta Petik Merah",
    farmerName: "Ibu Maryati",
    pekon: "Sukoharjo",
    quantity: "320 Kg",
    pricePerKg: 42000,
    marketPricePerKg: 38000,
    trustedCollector: "Haji Rohmat (Pengepul Jujur)",
    postedAt: "Kemarin",
  },
  {
    id: "BRS-104",
    name: "Pisang Cavendish Matang Pohon",
    farmerName: "Kelompok Tani Rejo",
    pekon: "Gading Rejo",
    quantity: "450 Kg",
    pricePerKg: 8500,
    marketPricePerKg: 7500,
    trustedCollector: "UMKM Keripik Barokah",
    postedAt: "26 Okt 2026",
  },
];

export default function CitizenBursaPage() {
  const { activePekon } = useAuth();
  const [commodities, setCommodities] = useState<CommodityItem[]>(INITIAL_COMMODITIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newPrice, setNewPrice] = useState("2000");

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const item: CommodityItem = {
      id: `BRS-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      farmerName: "Warga Terdaftar",
      pekon: activePekon.namaPekon,
      quantity: newQty,
      pricePerKg: Number(newPrice),
      marketPricePerKg: Math.round(Number(newPrice) * 0.85),
      trustedCollector: "Haji Rohmat (Pengepul Jujur)",
      postedAt: "Baru saja",
    };
    setCommodities([item, ...commodities]);
    setModalOpen(false);
    setNewName("");
    setNewQty("");
    toast.success("Bursa Hasil Panen Berhasil Dipasang", {
      description: `Komoditas ${item.name} telah terdaftar dan terhubung ke pengepul jujur.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Bursa Hasil Bumi & Pengepul Jujur
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-medium">
                {activePekon.namaPekon}
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Hub komoditas panen langsung tanpa tengkulak dengan harga wajar terverifikasi timbangan jujur.
            </p>
          </div>
          <Button
            size="sm"
            className="text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setModalOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Pasang Bursa Panen</span>
          </Button>
        </div>

        {/* Commodity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {commodities.map((item) => {
            const margin = item.pricePerKg - item.marketPricePerKg;
            return (
              <Card key={item.id} className="border-border/60 bg-card/60 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/40 bg-primary/5">
                      Pengepul Jujur
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">{item.postedAt}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-2 leading-tight">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Petani: <span className="text-foreground font-medium">{item.farmerName}</span> ({item.pekon})
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Kuantitas Siap Kirim:</span>
                      <span className="font-bold text-foreground">{item.quantity}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Harga BUMDes:</span>
                      <span className="font-bold text-emerald-500 font-mono">
                        {formatRupiah(item.pricePerKg)} / kg
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5 border-t border-border/30">
                      <span>Harga Pasar Umum:</span>
                      <span className="line-through">{formatRupiah(item.marketPricePerKg)}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Untung Petani: +{formatRupiah(margin)} / kg
                  </div>

                  <Button
                    size="sm"
                    className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => {
                      toast.success("Kontrak Pembelian Diterima", {
                        description: `Permintaan pasokan ${item.quantity} ${item.name} diteruskan ke ${item.trustedCollector}`,
                      });
                    }}
                  >
                    <span>Hubungkan ke Pengepul</span>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dialog Pasang Bursa Panen */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateListing}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Pasang Bursa Hasil Panen
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Tawarkan hasil panen ke jaringan pengepul jujur dan BUMDes
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="comm-name" className="text-xs">Nama Komoditas</Label>
                <Input
                  id="comm-name"
                  required
                  placeholder="Contoh: Singkong Gajah Panen Minggu Ini"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="comm-qty" className="text-xs">Estimasi Berat / Kuantitas</Label>
                  <Input
                    id="comm-qty"
                    required
                    placeholder="Contoh: 1.500 Kg"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="comm-price" className="text-xs">Target Harga Wajar (Rp / Kg)</Label>
                  <Input
                    id="comm-price"
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Tayangkan ke Bursa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
