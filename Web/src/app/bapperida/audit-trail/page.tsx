"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCheck2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";

const MOCK_AUDIT_LOGS = [
  {
    id: "audit-001",
    timestamp: "2026-10-21T07:30:00Z",
    actorName: "Budi Santoso (Admin BUMDes Pagelaran)",
    action: "APPROVE_LOAN_DISBURSEMENT",
    recipientName: "Mbah Suroto (Pekerja Inklusif Disabilitas)",
    pekon: "Pekon Pagelaran",
    plafond: 1500000,
    status: "APPROVED",
    ipAddress: "192.168.1.45",
    integrityHash: "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    notes: "Penyaluran modal untuk pengadaan alat bantu usaha bengkel kecil di rumah.",
  },
  {
    id: "audit-002",
    timestamp: "2026-10-21T06:05:00Z",
    actorName: "Siti Rahma (Admin BUMDes Pringsewu Barat)",
    action: "APPROVE_LOAN_DISBURSEMENT",
    recipientName: "Ahmad Dahlan (Driver Komuter Nebeng)",
    pekon: "Pekon Pringsewu Barat",
    plafond: 1500000,
    status: "APPROVED",
    ipAddress: "192.168.2.12",
    integrityHash: "sha256-4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    notes: "Tambahan modal usaha warung kelontong pekon setelah 35 kali sukses jastip.",
  },
  {
    id: "audit-003",
    timestamp: "2026-10-20T16:20:00Z",
    actorName: "Budi Santoso (Admin BUMDes Pagelaran)",
    action: "VERIFY_PHYSICAL_NIK",
    recipientName: "Pak Slamet (Petani Singkong)",
    pekon: "Pekon Pagelaran",
    plafond: null,
    status: "VERIFIED",
    ipAddress: "192.168.1.45",
    integrityHash: "sha256-ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    notes: "Pemeriksaan KTP fisik asli di kantor BUMDes Pagelaran.",
  },
  {
    id: "audit-004",
    timestamp: "2026-10-20T11:45:00Z",
    actorName: "Agus Triyono (Admin BUMDes Sukoharjo)",
    action: "APPROVE_LOAN_DISBURSEMENT",
    recipientName: "Ibu Mariyam (Pengrajin Tapis)",
    pekon: "Pekon Sukoharjo",
    plafond: 1500000,
    status: "APPROVED",
    ipAddress: "192.168.4.88",
    integrityHash: "sha256-8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    notes: "Penyaluran modal bahan baku kain & benang sulam tapis pekon.",
  },
];

export default function AuditTrailPage() {
  return (
    <DashboardLayout allowedRoles={["ADMIN_BAPPERIDA", "SUPER_ADMIN"]}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-blue-600" />
            Audit Trail & Akuntabilitas Penyaluran Modal Desa
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rekam jejak tidak dapat diubah (*immutable log*) setiap persetujuan modal usaha ultra-mikro BUMDes se-Kabupaten Pringsewu.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Log Otorisasi Dana Bergulir BUMDes</CardTitle>
          <CardDescription>
            Memuat identitas pejabat verifikator, alamat IP, timestamp, hash kriptografi, dan catatan persetujuan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Waktu Kejadian</th>
                  <th className="px-4 py-3">Aktor Otoritas</th>
                  <th className="px-4 py-3">Aktivitas / Aksi</th>
                  <th className="px-4 py-3">Penerima Manfaat</th>
                  <th className="px-4 py-3">Nominal Modal</th>
                  <th className="px-4 py-3">Integritas Checksum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      <div>{log.actorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">IP: {log.ipAddress}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={log.action === "APPROVE_LOAN_DISBURSEMENT" ? "default" : "secondary"}
                        className="text-[10px] font-mono"
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-800">
                      <div className="font-semibold">{log.recipientName}</div>
                      <div className="text-[10px] text-slate-500">{log.pekon}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-700">
                      {log.plafond ? formatRupiah(log.plafond) : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-[10px] font-mono text-slate-400 max-w-[120px] truncate" title={log.integrityHash}>
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        Valid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
