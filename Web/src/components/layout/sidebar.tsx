"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  ShieldCheck,
  Coins,
  HeartHandshake,
  Building2,
  MapPin,
  BarChart3,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isBumdes = user?.role === "ADMIN_BUMDES";
  const isBapperida =
    user?.role === "ADMIN_BAPPERIDA" || user?.role === "SUPER_ADMIN";

  const bumdesNav = [
    {
      title: "Overview Pekon",
      href: "/bumdes/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Verifikasi Fisik NIK",
      href: "/bumdes/verifikasi-nik",
      icon: ShieldCheck,
      badge: "KTP",
    },
    {
      title: "Pinjaman Modal Rp1.5M",
      href: "/bumdes/pinjaman-modal",
      icon: Coins,
      badge: "SPK A",
    },
    {
      title: "Paket Gizi Stunting",
      href: "/bumdes/gizi-stunting",
      icon: HeartHandshake,
    },
  ];

  const bapperidaNav = [
    {
      title: "Command Center Makro",
      href: "/bapperida/overview",
      icon: Building2,
    },
    {
      title: "Peta Geospasial Pekon",
      href: "/bapperida/peta-pekon",
      icon: MapPin,
      badge: "5 Pekon",
    },
    {
      title: "Analitik SPK TOPSIS",
      href: "/bapperida/analitik-spk",
      icon: BarChart3,
    },
    {
      title: "Audit Trail Penyaluran",
      href: "/bapperida/audit-trail",
      icon: FileCheck2,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wide text-white">
            JEJARING-SEWU
          </h1>
          <p className="text-[10px] text-emerald-400 font-medium">
            SINERGI-PEKON PRINGSEWU
          </p>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
        {isBumdes && (
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Portal BUMDes ({user?.pekon?.namaPekon || "Pekon Pagelaran"})
            </div>
            <nav className="space-y-1">
              {bumdesNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-slate-400"
                      )}
                    />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-semibold",
                          isActive
                            ? "bg-emerald-700 text-emerald-100"
                            : "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {isBapperida && (
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              BAPPERIDA Kab. Pringsewu
            </div>
            <nav className="space-y-1">
              {bapperidaNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-slate-400"
                      )}
                    />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-semibold",
                          isActive
                            ? "bg-emerald-700 text-emerald-100"
                            : "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300">Kompas Iptek 2026</p>
        <p className="text-[10px] text-slate-500">Pemkab Pringsewu - Inovasi Desa</p>
      </div>
    </aside>
  );
}
