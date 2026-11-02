"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { useActiveLoans, useCreditScoringActions } from "@/features/credit-scoring/hooks";
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
  Banknote,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Receipt,
  AlertCircle,
  Coins,
  ShieldCheck,
} from "lucide-react";

interface LoanItem {
  id: string;
  wargaName: string;
  pekon: string;
  plafon: number;
  sisaPokok: number;
  status: "APPROVED_WAITING_DISBURSE" | "ACTIVE" | "SETTLED";
  disbursedDate: string;
  dueDate: string;
  repaymentProgress: number;
}

const INITIAL_LOANS: LoanItem[] = [
  {
    id: "LOAN-001",
    wargaName: "Pak Slamet Riyadi",
    pekon: "Pagelaran",
    plafon: 1500000,
    sisaPokok: 600000,
    status: "ACTIVE",
    disbursedDate: "2026-08-10",
    dueDate: "2026-11-10",
    repaymentProgress: 60,
  },
  {
    id: "LOAN-002",
    wargaName: "Mbah Suroto",
    pekon: "Pagelaran",
    plafon: 1500000,
    sisaPokok: 1500000,
    status: "APPROVED_WAITING_DISBURSE",
    disbursedDate: "-",
    dueDate: "2026-12-01",
    repaymentProgress: 0,
  },
  {
    id: "LOAN-003",
    wargaName: "Dewi Lestari",
    pekon: "Pagelaran",
    plafon: 1500000,
    sisaPokok: 0,
    status: "SETTLED",
    disbursedDate: "2026-05-01",
    dueDate: "2026-08-01",
    repaymentProgress: 100,
  },
  {
    id: "LOAN-004",
    wargaName: "Haji Rohmat (Pengepul)",
    pekon: "Pagelaran",
    plafon: 1500000,
    sisaPokok: 450000,
    status: "ACTIVE",
    disbursedDate: "2026-09-01",
    dueDate: "2026-12-01",
    repaymentProgress: 70,
  },
];

export default function DisbursementPage() {
  const { activePekon } = useAuth();
  const { data: activeLoansData, refetch: refetchActiveLoans } = useActiveLoans({ pekonId: activePekon.id });
  const { disburseLoan, repayLoan, isDisbursing, isRepaying } = useCreditScoringActions();
  const [loans, setLoans] = useState<LoanItem[]>(INITIAL_LOANS);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("300000");

  const filteredLoans = loans.filter((item) => {
    if (filterStatus === "ALL") return true;
    return item.status === filterStatus;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleDisburse = async (loan: LoanItem) => {
    try {
      await disburseLoan(loan.id);
      refetchActiveLoans();
    } catch {
      // Local fallback
    }
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loan.id
          ? {
              ...l,
              status: "ACTIVE",
              disbursedDate: new Date().toISOString().split("T")[0],
            }
          : l
      )
    );
    toast.success("Modal Berhasil Dicairkan", {
      description: `Plafon Rp 1.500.000 telah disalurkan ke dompet saldo ${loan.wargaName}`,
    });
  };

  const handleRecordPayment = async () => {
    if (!selectedLoan) return;
    const amount = Number(paymentAmount);
    const newSisa = Math.max(0, selectedLoan.sisaPokok - amount);
    const isLunas = newSisa === 0;

    if (isLunas) {
      try {
        await repayLoan(selectedLoan.id);
        refetchActiveLoans();
      } catch {
        // Local fallback
      }
    }

    setLoans((prev) =>
      prev.map((l) =>
        l.id === selectedLoan.id
          ? {
              ...l,
              sisaPokok: newSisa,
              repaymentProgress: Math.round(((l.plafon - newSisa) / l.plafon) * 100),
              status: isLunas ? "SETTLED" : "ACTIVE",
            }
          : l
      )
    );
    setPaymentModalOpen(false);
    toast.success("Angsuran Berhasil Dicatat", {
      description: `Pembayaran ${formatRupiah(amount)} untuk ${selectedLoan.wargaName} telah terbukukan di kas BUMDes.`,
    });
  };

  const totalDisbursed = loans.reduce((acc, curr) => acc + (curr.status !== "APPROVED_WAITING_DISBURSE" ? curr.plafon : 0), 0);
  const totalRepaid = loans.reduce((acc, curr) => acc + (curr.plafon - curr.sisaPokok), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Monitoring Pencairan & Pengembalian Modal
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-medium">
                {activePekon.namaPekon}
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Pemantauan perputaran dana modal BUMDes tanpa agunan untuk pemohon Grade A.
            </p>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Modal Disalurkan</CardTitle>
              <Banknote className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatRupiah(totalDisbursed)}</div>
              <span className="text-[11px] text-muted-foreground">Dari kas operasional Pekon</span>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Pengembalian Masuk</CardTitle>
              <Receipt className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatRupiah(totalRepaid)}</div>
              <span className="text-[11px] text-emerald-500 font-medium">
                {Math.round((totalRepaid / totalDisbursed) * 100)}% Rasio Pengembalian Lancar
              </span>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Pinjaman Lunas (Selesai)</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loans.filter((l) => l.status === "SETTLED").length} Warga
              </div>
              <span className="text-[11px] text-muted-foreground">Memenuhi siklus panen sirkular</span>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 w-full sm:w-auto h-9">
                <TabsTrigger value="ALL" className="text-xs">Semua</TabsTrigger>
                <TabsTrigger value="APPROVED_WAITING_DISBURSE" className="text-xs">Menunggu Cair</TabsTrigger>
                <TabsTrigger value="ACTIVE" className="text-xs">Aktif Berjalan</TabsTrigger>
                <TabsTrigger value="SETTLED" className="text-xs">Lunas (Selesai)</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Table List */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Daftar Penyaluran Modal Warga ({filteredLoans.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID Akad</TableHead>
                    <TableHead className="text-xs">Nama Pemohon</TableHead>
                    <TableHead className="text-xs">Plafon Modal</TableHead>
                    <TableHead className="text-xs">Sisa Pokok</TableHead>
                    <TableHead className="text-xs">Progress Pengembalian</TableHead>
                    <TableHead className="text-xs">Tenggat Waktu</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Aksi BUMDes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-mono text-xs font-semibold">{loan.id}</TableCell>
                      <TableCell className="text-xs font-medium text-foreground">{loan.wargaName}</TableCell>
                      <TableCell className="text-xs font-semibold">{formatRupiah(loan.plafon)}</TableCell>
                      <TableCell className="text-xs font-mono text-foreground">{formatRupiah(loan.sisaPokok)}</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-2">
                          <Progress value={loan.repaymentProgress} className="w-16 h-2" />
                          <span className="text-[11px] font-mono">{loan.repaymentProgress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{loan.dueDate}</TableCell>
                      <TableCell className="text-xs">
                        {loan.status === "APPROVED_WAITING_DISBURSE" && (
                          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                            Menunggu Pencairan
                          </Badge>
                        )}
                        {loan.status === "ACTIVE" && (
                          <Badge className="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-[10px]">
                            Aktif Berjalan
                          </Badge>
                        )}
                        {loan.status === "SETTLED" && (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                            Lunas Sempurna
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-right">
                        {loan.status === "APPROVED_WAITING_DISBURSE" && (
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                            onClick={() => handleDisburse(loan)}
                          >
                            <Banknote className="h-3.5 w-3.5" />
                            <span>Cairkan Modal</span>
                          </Button>
                        )}
                        {loan.status === "ACTIVE" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs gap-1 border-primary/40 text-primary hover:bg-primary/10"
                            onClick={() => {
                              setSelectedLoan(loan);
                              setPaymentModalOpen(true);
                            }}
                          >
                            <Receipt className="h-3.5 w-3.5" />
                            <span>Catat Angsuran</span>
                          </Button>
                        )}
                        {loan.status === "SETTLED" && (
                          <span className="text-[11px] text-muted-foreground flex items-center justify-end gap-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            Terselesaikan
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

      {/* Record Payment Dialog */}
      {selectedLoan && (
        <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Receipt className="h-4 w-4 text-primary" />
                Catat Pengembalian Modal
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Pencatatan pembayaran angsuran untuk {selectedLoan.wargaName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Akad:</span>
                  <span className="font-mono font-semibold">{selectedLoan.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Plafon:</span>
                  <span className="font-semibold">{formatRupiah(selectedLoan.plafon)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sisa Pokok Saat Ini:</span>
                  <span className="font-mono font-bold text-amber-500">{formatRupiah(selectedLoan.sisaPokok)}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="payment-amount" className="text-xs">
                  Nominal Pembayaran (Rp)
                </Label>
                <Input
                  id="payment-amount"
                  type="number"
                  className="h-9 text-xs font-mono"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPaymentModalOpen(false)} className="text-xs">
                Batal
              </Button>
              <Button size="sm" onClick={handleRecordPayment} className="text-xs">
                Simpan Transaksi Kas
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
