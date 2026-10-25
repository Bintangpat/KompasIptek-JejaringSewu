"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Search,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { MOCK_USERS_PAGELARAN } from "@/lib/mock-data";
import { UserProfile } from "@/types";

export default function VerifikasiNikPage() {
  const { isMockMode } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS_PAGELARAN);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [nikInput, setNikInput] = useState("");
  const [notes, setNotes] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phoneNumber.includes(searchQuery)
  );

  const handleOpenDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setNikInput("");
    setNotes(`Pemeriksaan KTP fisik asli di Kantor BUMDes oleh admin.`);
    setFeedback(null);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (!/^\d{16}$/.test(nikInput.trim())) {
      setFeedback({
        type: "error",
        message: "NIK wajib terdiri dari tepat 16 digit angka sesuai KTP.",
      });
      return;
    }

    setIsVerifying(true);
    setFeedback(null);

    try {
      if (!isMockMode) {
        await apiClient.post("/users/verify-nik", {
          userId: selectedUser.id,
          nikInput: nikInput.trim(),
          notes: notes.trim(),
        });
      }

      // Update state locally
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, isNikVerified: true } : u
        )
      );

      setFeedback({
        type: "success",
        message: `Identitas fisik NIK warga "${selectedUser.fullName}" berhasil diverifikasi dan disahkan!`,
      });

      setTimeout(() => {
        setSelectedUser(null);
      }, 1500);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message:
          err.message ||
          "NIK fisik yang dimasukkan tidak cocok dengan data pendaftaran warga.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={["ADMIN_BUMDES", "SUPER_ADMIN"]}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            Verifikasi Fisik NIK Warga
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Validasi identitas KTP warga sebelum pencairan modal BUMDes dan partisipasi bursa panen.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Cari nama atau no. WA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs"
          />
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Protokol Keamanan Zero-Knowledge Kependudukan:</span>{" "}
          Database backend menyimpan NIK dalam bentuk hash HMAC-SHA256 dan terenkripsi AES-256-GCM.
          Admin BUMDes wajib memeriksa KTP fisik asli warga lalu memasukkan 16 digit NIK untuk pencocokan kriptografis satu arah.
        </div>
      </div>

      {/* Citizens Table */}
      <Card>
        <CardHeader>
          <CardTitle>Antrean Warga Pekon Pagelaran</CardTitle>
          <CardDescription>
            Menampilkan daftar warga yang terdaftar di database pekon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Lengkap</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Kelompok Inklusi</th>
                  <th className="px-4 py-3">Status Verifikasi</th>
                  <th className="px-4 py-3 text-right">Aksi BUMDes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      {user.fullName}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 font-mono">
                      {user.phoneNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      {user.vulnerabilityFlags.includes("DISABILITAS_FISIK") ? (
                        <Badge variant="warning" className="text-[10px]">
                          Disabilitas Fisik
                        </Badge>
                      ) : user.vulnerabilityFlags.includes("KELUARGA_PRA_SEJAHTERA") ? (
                        <Badge variant="secondary" className="text-[10px]">
                          Pra-Sejahtera
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-500">Warga Umum</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {user.isNikVerified ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Menunggu Validasi
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {user.isNikVerified ? (
                        <span className="text-xs text-slate-400 font-medium">
                          Selesai
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleOpenDialog(user)}
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          Verifikasi NIK
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog Verifikasi NIK */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        {selectedUser && (
          <form onSubmit={handleVerifySubmit}>
            <DialogHeader>
              <DialogTitle>Verifikasi Fisik KTP Warga</DialogTitle>
              <DialogDescription>
                Masukkan 16 digit NIK asli dari KTP fisik milik warga untuk dilakukan pencocokan hash.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Profile summary */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Warga:</span>
                  <span className="font-semibold text-slate-800">{selectedUser.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. WhatsApp:</span>
                  <span className="font-mono text-slate-700">{selectedUser.phoneNumber}</span>
                </div>
              </div>

              {/* Feedback Alert inside dialog */}
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

              {/* NIK Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  16 Digit NIK KTP Asli
                </label>
                <Input
                  type="text"
                  maxLength={16}
                  placeholder="Contoh: 1810012304850001"
                  value={nikInput}
                  onChange={(e) => setNikInput(e.target.value.replace(/\D/g, ""))}
                  required
                  className="font-mono text-sm tracking-wider"
                />
                <p className="text-[10px] text-slate-400">
                  Periksa angka pada fisik e-KTP warga secara teliti.
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Catatan Verifikator BUMDes
                </label>
                <Input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan verifikasi..."
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedUser(null)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isVerifying || nikInput.length !== 16}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isVerifying ? "Mencocokkan Hash..." : "Sahkan Verifikasi"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </Dialog>
    </DashboardLayout>
  );
}
