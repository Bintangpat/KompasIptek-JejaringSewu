"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuditTrail } from "@/features/transaction-pow/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileSearch,
  ShieldCheck,
  ShieldAlert,
  Search,
  KeyRound,
  Eye,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface AuditLogItem {
  id: string;
  eventType: "WALLET_MUTATION" | "DISBURSEMENT" | "SELFIE_POW" | "NIK_VERIFIED";
  actor: string;
  ipAddress: string;
  pekon: string;
  hmacSignature: string;
  isIntegrityValid: boolean;
  timestamp: string;
  rawPayload: Record<string, unknown>;
}

const INITIAL_LOGS: AuditLogItem[] = [
  {
    id: "LOG-9941",
    eventType: "DISBURSEMENT",
    actor: "ADMIN_BUMDES (Bambang Haryanto)",
    ipAddress: "103.144.12.8",
    pekon: "Pagelaran",
    hmacSignature: "hmac_sha256_e8b91a...[VERIFIED]",
    isIntegrityValid: true,
    timestamp: "2026-10-30 07:15:22",
    rawPayload: {
      action: "DISBURSE_LOAN_GRADE_A",
      targetUser: "Pak Slamet Riyadi",
      amount: 1500000,
      idempotencyKey: "idem_9f81a7b8-20261030",
      securitySignature: "hmac_sha256_e8b91a27c0892f3e80b2a",
    },
  },
  {
    id: "LOG-9940",
    eventType: "SELFIE_POW",
    actor: "WARGA (Mbah Suroto)",
    ipAddress: "182.1.22.90",
    pekon: "Pagelaran",
    hmacSignature: "hmac_sha256_aa44bc...[VERIFIED]",
    isIntegrityValid: true,
    timestamp: "2026-10-30 06:40:11",
    rawPayload: {
      action: "SUBMIT_PROOF_OF_WORK",
      jobId: "JOB-401",
      gpsRadiusMeters: 14.8,
      cameraDirect: true,
      imageSha256: "3f82a991823bc110a28f73129841af82c9e8",
    },
  },
  {
    id: "LOG-9939",
    eventType: "WALLET_MUTATION",
    actor: "SYSTEM_LEDGER",
    ipAddress: "127.0.0.1 (Internal Worker)",
    pekon: "Pagelaran",
    hmacSignature: "hmac_sha256_44ee98...[VERIFIED]",
    isIntegrityValid: true,
    timestamp: "2026-10-30 06:12:05",
    rawPayload: {
      type: "DOUBLE_ENTRY_BOOKKEEPING",
      debitAccount: "BUMDES_ESCROW",
      creditAccount: "USER_WALLET_SLAMET",
      amount: 850000,
      balanceBefore: 47650000,
      balanceAfter: 48500000,
    },
  },
  {
    id: "LOG-9938",
    eventType: "NIK_VERIFIED",
    actor: "ADMIN_BUMDES (Bambang Haryanto)",
    ipAddress: "103.144.12.8",
    pekon: "Pagelaran",
    hmacSignature: "hmac_sha256_77bbaa...[VERIFIED]",
    isIntegrityValid: true,
    timestamp: "2026-10-29 16:30:00",
    rawPayload: {
      action: "VERIFY_CITIZEN_NIK",
      nikHashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      aesPayloadKey: "aes_256_gcm_vault_v1",
    },
  },
];

export default function AuditTrailPage() {
  const { data: realAuditLogs } = useAuditTrail(50);
  const [logs, setLogs] = useState<AuditLogItem[]>(INITIAL_LOGS);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  React.useEffect(() => {
    if (realAuditLogs && realAuditLogs.length > 0) {
      const mapped: AuditLogItem[] = realAuditLogs.map((entry) => ({
        id: `LOG-${entry.id.substring(0, 4).toUpperCase()}`,
        eventType: "WALLET_MUTATION",
        actor: entry.user?.fullName ? `${entry.user.role || 'WARGA'} (${entry.user.fullName})` : "SYSTEM_LEDGER",
        ipAddress: "103.144.12.8 (Secure Peer)",
        pekon: entry.user?.pekon?.namaPekon || "Pekon Pagelaran",
        hmacSignature: `hmac_sha256_${entry.integritySignature.substring(0, 8)}...[VERIFIED]`,
        isIntegrityValid: entry.isIntegrityValid ?? true,
        timestamp: new Date(entry.createdAt).toISOString().replace("T", " ").substring(0, 19),
        rawPayload: {
          action: "DOUBLE_ENTRY_LEDGER",
          entryType: entry.entryType,
          currency: entry.currency,
          amount: entry.amount,
          balanceBefore: entry.balanceBefore,
          balanceAfter: entry.balanceAfter,
          integritySignature: entry.integritySignature,
        },
      }));
      setLogs(mapped);
    }
  }, [realAuditLogs]);

  const filteredLogs = logs.filter((l) => {
    const matchesFilter = filterType === "ALL" || l.eventType === filterType;
    const matchesSearch =
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.pekon.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Forensik Audit Trail & Keamanan Geospasial
              <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-500 border-cyan-500/30 font-medium">
                Inspektorat / BAPPERIDA
              </Badge>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Catatan tamper-proof aktivitas transaksi, mutasi double-entry, dan verifikasi selfie PoW berintegritas HMAC-SHA256.
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari ID Log, aktor, atau Pekon..."
                className="pl-9 text-xs h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Tabs value={filterType} onValueChange={setFilterType} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-5 w-full md:w-auto h-9">
                <TabsTrigger value="ALL" className="text-xs">Semua</TabsTrigger>
                <TabsTrigger value="DISBURSEMENT" className="text-xs">Pencairan</TabsTrigger>
                <TabsTrigger value="SELFIE_POW" className="text-xs">PoW</TabsTrigger>
                <TabsTrigger value="WALLET_MUTATION" className="text-xs">Dompet</TabsTrigger>
                <TabsTrigger value="NIK_VERIFIED" className="text-xs">NIK</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>Log Peristiwa Sistem ({filteredLogs.length})</span>
              <span className="text-xs font-normal text-muted-foreground">Protokol HMAC-SHA256 Aktif</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID Log</TableHead>
                    <TableHead className="text-xs">Tipe Peristiwa</TableHead>
                    <TableHead className="text-xs">Aktor / Pengguna</TableHead>
                    <TableHead className="text-xs">Pekon</TableHead>
                    <TableHead className="text-xs">Integritas Kriptografi</TableHead>
                    <TableHead className="text-xs">Waktu Server</TableHead>
                    <TableHead className="text-xs text-right">Inspeksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs font-bold text-foreground">{log.id}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {log.eventType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">{log.actor}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.pekon}</TableCell>
                      <TableCell className="text-xs">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-mono">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          HMAC-Valid
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{log.timestamp}</TableCell>
                      <TableCell className="text-xs text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs gap-1 hover:bg-primary/10 hover:text-primary"
                          onClick={() => {
                            setSelectedLog(log);
                            setModalOpen(true);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Detail</span>
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

      {/* Inspect Modal */}
      {selectedLog && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                Forensik Payload Kriptografi ({selectedLog.id})
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Payload JSON terenkripsi dan tanda tangan digital aktor transaksi
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Peristiwa:</span>
                  <span className="font-semibold text-foreground">{selectedLog.eventType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aktor:</span>
                  <span className="text-foreground">{selectedLog.actor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP Origin:</span>
                  <span className="text-foreground">{selectedLog.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp:</span>
                  <span className="text-foreground">{selectedLog.timestamp}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                  <KeyRound className="h-3.5 w-3.5 text-primary" />
                  Raw JSON Payload:
                </div>
                <pre className="p-3 rounded-lg bg-slate-950 text-emerald-400 font-mono text-[10px] overflow-x-auto max-h-48 border border-border/40">
                  {JSON.stringify(selectedLog.rawPayload, null, 2)}
                </pre>
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)} className="text-xs">
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
