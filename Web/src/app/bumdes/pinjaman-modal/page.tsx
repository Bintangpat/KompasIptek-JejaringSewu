"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Coins,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  FileCheck2,
  AlertCircle,
  Clock,
  UserCheck,
} from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { MOCK_LOAN_RECOMMENDATIONS } from "@/lib/mock-data";
import { LoanRecommendation } from "@/types";

export default function PinjamanModalPage() {
  const { isMockMode } = useAuth();
  const [loans, setLoans] = useState<LoanRecommendation[]>(MOCK_LOAN_RECOMMENDATIONS);
  const [selectedLoan, setSelectedLoan] = useState<LoanRecommendation | null>(null);
  const [approvedPlafond, setApprovedPlafond] = useState<number>(1500000);
  const [approvalNotes, setApprovalNotes] = useState<string>("");
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchEligibleLoans = async () => {
      if (isMockMode) return;
      try {
        const res = await apiClient.get("/credit-scoring/loans/eligible");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLoans(res.data);
        }
      } catch (e) {
        // Fallback to mock
      }
    };
    fetchEligibleLoans();
  }, [isMockMode]);

  const handleOpenApproveModal = (loan: LoanRecommendation) => {
    setSelectedLoan(loan);
    setApprovedPlafond(Number(loan.recommendedPlafond) || 1500000);
    setApprovalNotes("Disetujui berdasarkan reputasi kerja nyata & integritas Selfie PoW warga.");
    setFeedback(null);
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    setIsApproving(true);
    setFeedback(null);

    try {
      if (!isMockMode) {
        await apiClient.patch(`/credit-scoring/loans/${selectedLoan.id}/approve`, {
          approvedPlafond: Number(approvedPlafond),
          notes: approvalNotes.trim(),
        });
      }

      // Update state locally
      setLoans((prev) =>
        prev.map((l) =>
          l.id === selectedLoan.id
            ? {
                ...l,
                status: "APPROVED",
                approvedPlafond: approvedPlafond,
                approvedAt: new Date().toISOString(),
                notes: approvalNotes.trim(),
              }
            : l
        )
      );

      setFeedback({
        type: "success",
        message: `Pencairan modal ultra-mikro Rp ${approvedPlafond.toLocaleString(
          "id-ID"
        )} berhasil disetujui! Notifikasi FCM otomatis dikirim ke warga.`,
      });

      setTimeout(() => {
        setSelectedLoan(null);
      }, 1500);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "Gagal menyetujui pinjaman modal.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const pendingLoans = loans.filter((l) => l.status === "ELIGIBLE_WAITING_BUMDES");
  const approvedLoans = loans.filter((l) => l.status === "APPROVED");

  return (
    <DashboardLayout allowedRoles={["ADMIN_BUMDES", "SUPER_ADMIN"]}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-600" />
            Persetujuan Pinjaman Modal Usaha Tanpa Agunan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Program pembiayaan ultra-mikro BUMDes berbasis mesin SPK AHP-TOPSIS ($S_{'{'}kredit{'}'} \ge 85$).
          </p>
        </div>
      </div>

      {/* Info Notice Box */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Mekanisme Rekomendasi Otomatis (Zero-Collateral):</span>{" "}
          Warga yang berhasil mengumpulkan skor kredit $\ge 85$ dari 5 pilar ekonomi sirkular
          (*Jastip, Mini-Job, Bursa Panen, Selfie PoW, & Inklusi*) secara otomatis memperoleh rekomendasi
          plafon modal usaha Rp1.500.000 tanpa agunan sertifikat/BPKB. BUMDes bertindak sebagai otoritas penyalur.
        </div>
      </div>

      {/* Antrean Menunggu Persetujuan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Antrean Warga Grade A Menunggu Persetujuan ({pendingLoans.length})
          </h2>
        </div>

        {pendingLoans.length === 0 ? (
          <Card className="bg-slate-50/50 border-dashed">
            <CardContent className="p-8 text-center text-slate-500 text-xs">
              Tidak ada antrean pinjaman modal yang menunggu persetujuan saat ini.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLoans.map((loan) => (
              <Card key={loan.id} className="border-amber-200 bg-white hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="warning" className="text-xs font-semibold">
                      GRADE A (Skor: {loan.creditScoreSnapshot || "88.5"})
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(loan.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="text-base text-slate-900 mt-2">
                    {loan.user?.fullName || "Pak Slamet (Petani Singkong)"}
                  </CardTitle>
                  <CardDescription className="text-xs font-mono">
                    WA: {loan.user?.phoneNumber || "081234567894"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pb-3">
                  {/* Plafond recommendation */}
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-between">
                    <span className="text-xs text-amber-800 font-medium">
                      Plafon Rekomendasi SPK:
                    </span>
                    <span className="text-base font-bold text-amber-900">
                      {formatRupiah(loan.recommendedPlafond)}
                    </span>
                  </div>

                  {/* SPK Breakdown preview */}
                  <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="font-semibold text-slate-700 text-[11px] mb-1">
                      Komposisi 5 Variabel SPK AHP-TOPSIS:
                    </div>
                    <div className="flex justify-between">
                      <span>• Frekuensi Jastip (Bobot 20%):</span>
                      <span className="font-semibold text-emerald-600">85 / 100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Keberhasilan Mini-Job (Bobot 25%):</span>
                      <span className="font-semibold text-emerald-600">92 / 100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Bursa Panen (Bobot 20%):</span>
                      <span className="font-semibold text-emerald-600">80 / 100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Integritas Selfie PoW (Bobot 20%):</span>
                      <span className="font-semibold text-emerald-600">95 / 100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Inklusi & Solidaritas (Bobot 15%):</span>
                      <span className="font-semibold text-emerald-600">90 / 100</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 border-t border-slate-100 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => handleOpenApproveModal(loan)}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5 shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Setujui Pencairan Modal
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Riwayat Pinjaman yang Telah Disetujui */}
      <div className="space-y-3 pt-4">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          Riwayat Pinjaman Disetujui BUMDes ({approvedLoans.length})
        </h2>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Nama Warga Penerima</th>
                    <th className="px-4 py-3">Plafon Disetujui</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Tanggal Disetujui</th>
                    <th className="px-4 py-3">Catatan Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {approvedLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3.5 font-medium text-slate-900">
                        {loan.user?.fullName || "Mbah Suroto"}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-emerald-700">
                        {formatRupiah(loan.approvedPlafond || loan.recommendedPlafond)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          APPROVED
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {formatDate(loan.approvedAt || loan.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 max-w-xs truncate">
                        {loan.notes || "Penyaluran modal mikro untuk usaha mandiri."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Dialog Persetujuan Modal */}
      <Dialog open={!!selectedLoan} onOpenChange={(open) => !open && setSelectedLoan(null)}>
        {selectedLoan && (
          <form onSubmit={handleApproveSubmit}>
            <DialogHeader>
              <DialogTitle>Persetujuan Pencairan Modal Usaha</DialogTitle>
              <DialogDescription>
                Persetujuan penyaluran dana pinjaman BUMDes tanpa agunan berdasarkan Skor SPK AHP-TOPSIS.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Penerima:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedLoan.user?.fullName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Predikat SPK:</span>
                  <span className="font-semibold text-emerald-600">
                    GRADE A LAYAK MODAL (Skor {selectedLoan.creditScoreSnapshot || "88.5"})
                  </span>
                </div>
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                    feedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Nominal Plafon Disetujui (Rupiah)
                </label>
                <Input
                  type="number"
                  min={500000}
                  step={50000}
                  value={approvedPlafond}
                  onChange={(e) => setApprovedPlafond(Number(e.target.value))}
                  required
                  className="font-bold text-slate-900"
                />
                <p className="text-[10px] text-slate-400">
                  Standar rekomendasi sistem: Rp 1.500.000 (minimal Rp 500.000).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Catatan Otorisasi Pengurus BUMDes
                </label>
                <Input
                  type="text"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Catatan persetujuan pengurus..."
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedLoan(null)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isApproving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isApproving ? "Memproses Approval..." : "Sahkan & Cairkan"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </Dialog>
    </DashboardLayout>
  );
}
