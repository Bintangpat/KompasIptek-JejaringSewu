"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { useCommuterActions, useNearbyRoutes } from "@/features/commuter-jastip/hooks";
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
  Car,
  Bike,
  PlusCircle,
  MapPin,
  Clock,
  Coins,
  ArrowRight,
  PackageCheck,
} from "lucide-react";

interface JastipTripItem {
  id: string;
  courierName: string;
  origin: string;
  destination: string;
  vehicle: "Motor" | "Pickup";
  departureTime: string;
  slotCapacity: string;
  fareEstimate: number;
  bonusPoints: number;
  status: "OPEN_FOR_BOOKING" | "FULL" | "COMPLETED";
}

const INITIAL_TRIPS: JastipTripItem[] = [
  {
    id: "JST-501",
    courierName: "Pak Slamet Riyadi",
    origin: "Pekon Pagelaran",
    destination: "Pasar Induk Pringsewu",
    vehicle: "Motor",
    departureTime: "Hari ini, 09:00 WIB",
    slotCapacity: "Sisa 2 Titipan (Maks 10 Kg)",
    fareEstimate: 15000,
    bonusPoints: 3,
    status: "OPEN_FOR_BOOKING",
  },
  {
    id: "JST-502",
    courierName: "Mas Hendra (Kurir Pekon)",
    origin: "Pekon Sukoharjo",
    destination: "RSUD Pringsewu / Apotek",
    vehicle: "Motor",
    departureTime: "Hari ini, 10:30 WIB",
    slotCapacity: "Sisa 3 Titipan Dokumen/Obat",
    fareEstimate: 12000,
    bonusPoints: 2,
    status: "OPEN_FOR_BOOKING",
  },
  {
    id: "JST-503",
    courierName: "Haji Rohmat (Armada Pickup)",
    origin: "Pekon Gading Rejo",
    destination: "Gudang Komoditas Bandar Lampung",
    vehicle: "Pickup",
    departureTime: "Siang ini, 13:00 WIB",
    slotCapacity: "Sisa 350 Kg Muatan",
    fareEstimate: 75000,
    bonusPoints: 10,
    status: "OPEN_FOR_BOOKING",
  },
];

export default function CitizenJastipPage() {
  const { activePekon } = useAuth();
  const { data: realRoutes, refetch: refetchRoutes } = useNearbyRoutes(
    { lat: Number(activePekon.latitude), lng: Number(activePekon.longitude) },
    Boolean(activePekon.latitude)
  );
  const { startRoute, createOrder, isStartingRoute, isCreatingOrder } = useCommuterActions();
  const [trips, setTrips] = useState<JastipTripItem[]>(INITIAL_TRIPS);
  const [modalOpen, setModalOpen] = useState(false);
  const [destination, setDestination] = useState("Pasar Pringsewu");
  const [departureTime, setDepartureTime] = useState("14:00 WIB");
  const [vehicle, setVehicle] = useState<"Motor" | "Pickup">("Motor");

  React.useEffect(() => {
    if (realRoutes && realRoutes.length > 0) {
      const mapped: JastipTripItem[] = realRoutes.map((r) => ({
        id: `JST-${r.id.substring(0, 4).toUpperCase()}`,
        courierName: r.commuter?.fullName || "Kurir Tebengan",
        origin: r.originName,
        destination: r.destinationName,
        vehicle: "Motor",
        departureTime: "Hari ini",
        slotCapacity: "Tersedia 2 slot titipan",
        fareEstimate: 15000,
        bonusPoints: 3,
        status: "OPEN_FOR_BOOKING",
      }));
      setTrips(mapped);
    }
  }, [realRoutes]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await startRoute({
        originName: activePekon.namaPekon,
        destinationName: destination,
        originLat: Number(activePekon.latitude),
        originLng: Number(activePekon.longitude),
        destLat: Number(activePekon.latitude) + 0.05,
        destLng: Number(activePekon.longitude) + 0.05,
      });
      refetchRoutes();
    } catch {
      // Local fallback
    }

    const newTrip: JastipTripItem = {
      id: `JST-${Math.floor(500 + Math.random() * 400)}`,
      courierName: "Warga Pelaku Tebengan",
      origin: activePekon.namaPekon,
      destination,
      vehicle,
      departureTime,
      slotCapacity: vehicle === "Motor" ? "Sisa 2 Titipan (Maks 8 Kg)" : "Sisa 200 Kg Muatan",
      fareEstimate: vehicle === "Motor" ? 15000 : 65000,
      bonusPoints: 3,
      status: "OPEN_FOR_BOOKING",
    };

    setTrips([newTrip, ...trips]);
    setModalOpen(false);
    toast.success("Rute Tebeng-Jastip Dibuka", {
      description: `Rute dari ${activePekon.namaPekon} menuju ${destination} siap menerima titipan warga.`,
    });
  };

  const handleBook = async (trip: JastipTripItem) => {
    try {
      await createOrder({
        routeId: trip.id,
        itemDescription: "Titipan belanja pangan dan obat",
        fuelShareCost: trip.fareEstimate,
        pickupLat: Number(activePekon.latitude),
        pickupLng: Number(activePekon.longitude),
      });
    } catch {
      // Local fallback
    }
    toast.success("Titipan Berhasil Dipesan", {
      description: `Anda menitipkan barang ke kurir ${trip.courierName}. Estimasi ongkir: ${formatRupiah(trip.fareEstimate)}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Nebeng-Jastip Searah (Logistik Pekon)
              <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-500 border-cyan-500/30 font-medium">
                {activePekon.namaPekon}
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Titip barang atau tebeng rute perjalanan warga yang searah, hemat biaya dan dapatkan poin sirkular.
            </p>
          </div>
          <Button
            size="sm"
            className="text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setModalOpen(true)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Buka Rute Perjalanan</span>
          </Button>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <Card key={trip.id} className="border-border/60 bg-card/60 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] text-cyan-600 dark:text-cyan-400 border-cyan-500/40 bg-cyan-500/5 gap-1">
                    {trip.vehicle === "Motor" ? <Bike className="h-3 w-3" /> : <Car className="h-3 w-3" />}
                    {trip.vehicle}
                  </Badge>
                  <span className="text-[10px] font-mono text-muted-foreground">{trip.id}</span>
                </div>
                <CardTitle className="text-sm font-bold text-foreground mt-2 leading-tight flex items-center gap-1.5">
                  <span>{trip.origin}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{trip.destination}</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Kurir: <span className="text-foreground font-medium">{trip.courierName}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      Jadwal Berangkat:
                    </span>
                    <span className="font-semibold text-foreground">{trip.departureTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Kapasitas Bagasi:</span>
                    <span className="text-foreground font-medium">{trip.slotCapacity}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-border/30">
                    <span className="text-muted-foreground">Ongkir Mulai:</span>
                    <span className="font-bold text-emerald-500 font-mono">
                      {formatRupiah(trip.fareEstimate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-500 font-semibold flex items-center gap-1">
                    <Coins className="h-3 w-3" />
                    +{trip.bonusPoints} Poin untuk Kurir
                  </span>
                </div>

                <Button
                  size="sm"
                  className="w-full text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => handleBook(trip)}
                >
                  <PackageCheck className="h-3.5 w-3.5 mr-1" />
                  <span>Pesan Titipan Sekarang</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Buka Rute */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateTrip}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Car className="h-4 w-4 text-primary" />
                Buka Rute Nebeng-Jastip Baru
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Tawarkan ruang bagasi kendaraan Anda kepada sesama warga Pekon
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="dest-input" className="text-xs">Tujuan Perjalanan</Label>
                <Input
                  id="dest-input"
                  required
                  placeholder="Contoh: Pasar Pringsewu / Toko Pertanian"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="time-input" className="text-xs">Jam Keberangkatan</Label>
                  <Input
                    id="time-input"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vehicle-select" className="text-xs">Jenis Kendaraan</Label>
                  <select
                    id="vehicle-select"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value as "Motor" | "Pickup")}
                  >
                    <option value="Motor">Sepeda Motor</option>
                    <option value="Pickup">Mobil Pickup / Bak</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Publikasikan Rute
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
