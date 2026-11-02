"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/auth-context";
import { MOCK_PEKON_LIST } from "@/lib/mock-data";
import { UserRole } from "@/types";
import {
  MapPin,
  ChevronDown,
  ShieldCheck,
  Building2,
  Users,
  Compass,
} from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const { activePekon, switchPekon, activeRole, switchRole } = useAuth();

  const getPageTitle = (path?: string) => {
    if (!path || path === "/") return "Beranda Inovasi";
    if (path.includes("/bumdes/overview")) return "Overview Operasional Pekon";
    if (path.includes("/bumdes/verifikasi-nik")) return "Verifikasi NIK Warga";
    if (path.includes("/bumdes/credit-scoring")) return "Rekomendasi Modal AHP-TOPSIS";
    if (path.includes("/bumdes/disbursement")) return "Monitoring Pencairan Modal";
    if (path.includes("/bumdes/nutrition")) return "Penyaluran Paket Gizi & Stunting";
    if (path.includes("/bumdes/bursa-kerja")) return "Bursa Mini-Job Inklusif";
    if (path.includes("/bapperida/overview")) return "Executive Heatmap Regional";
    if (path.includes("/bapperida/spk-radar")) return "Radar Sensitivitas SPK 5-Pilar";
    if (path.includes("/bapperida/stunting-map")) return "Peta Sebaran Stunting";
    if (path.includes("/bapperida/audit-trail")) return "Forensik Audit Trail";
    if (path.includes("/citizen/bursa")) return "Bursa Hasil Bumi";
    if (path.includes("/citizen/jastip")) return "Nebeng-Jastip Searah";
    if (path.includes("/citizen/mini-job")) return "Feed Mini-Job Inklusif";
    if (path.includes("/citizen/pow")) return "Studio Kamera Selfie PoW";
    if (path.includes("/citizen/poin")) return "Tukar Poin & Paket Gizi";
    if (path.includes("/citizen/profile")) return "Profil & Skor Kredit";
    if (path.includes("/login")) return "Login Otoritas & Demo";
    return "JEJARING-SEWU";
  };

  const roleLabels: Record<UserRole, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
    ADMIN_BUMDES: { label: "BUMDes Pekon", icon: Building2, color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" },
    ADMIN_BAPPERIDA: { label: "BAPPERIDA", icon: Compass, color: "text-cyan-500 border-cyan-500/30 bg-cyan-500/10" },
    WARGA: { label: "Warga Desa", icon: Users, color: "text-amber-500 border-amber-500/30 bg-amber-500/10" },
    PENGEPUL: { label: "Pengepul Jujur", icon: Users, color: "text-blue-500 border-blue-500/30 bg-blue-500/10" },
    PENGUMPUL_JUJUR: { label: "Pengepul Jujur", icon: Users, color: "text-blue-500 border-blue-500/30 bg-blue-500/10" },
    UMKM: { label: "Pelaku UMKM", icon: Users, color: "text-purple-500 border-purple-500/30 bg-purple-500/10" },
    SUPER_ADMIN: { label: "Super Admin", icon: ShieldCheck, color: "text-rose-500 border-rose-500/30 bg-rose-500/10" },
  };

  const currentRoleInfo = roleLabels[activeRole] || roleLabels.ADMIN_BUMDES;
  const RoleIcon = currentRoleInfo.icon;

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/40 bg-background/80 backdrop-blur-md px-4 lg:px-6 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="mx-1 h-4 bg-border/60" />
        <h1 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Pekon Switcher Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium border-border/60 hover:bg-muted/80 bg-background/50"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline-block max-w-36 truncate">{activePekon.namaPekon}</span>
              <span className="sm:hidden">{activePekon.namaPekon.replace("Pekon ", "")}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Pilih Pekon Aktif:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {MOCK_PEKON_LIST.map((p) => (
              <DropdownMenuItem
                key={p.id}
                className="cursor-pointer text-xs flex items-center justify-between"
                onClick={() => switchPekon(p.id)}
              >
                <div>
                  <div className="font-medium text-foreground">{p.namaPekon}</div>
                  <div className="text-[10px] text-muted-foreground">Kec. {p.kecamatan}</div>
                </div>
                {activePekon.id === p.id && (
                  <Badge variant="outline" className="text-[9px] h-4 text-primary border-primary">
                    Aktif
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Role Switcher Badge Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 gap-1.5 text-xs font-medium border ${currentRoleInfo.color}`}
            >
              <RoleIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden md:inline-block">{currentRoleInfo.label}</span>
              <ChevronDown className="h-3 w-3 opacity-70 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-1">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Beralih Peran (Zero-Auth):</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-xs flex items-center justify-between"
              onClick={() => switchRole("ADMIN_BUMDES")}
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>BUMDes Pekon</span>
              </div>
              {activeRole === "ADMIN_BUMDES" && <Badge variant="outline" className="text-[9px] h-4 text-emerald-500 border-emerald-500">Aktif</Badge>}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-xs flex items-center justify-between"
              onClick={() => switchRole("ADMIN_BAPPERIDA")}
            >
              <div className="flex items-center gap-2">
                <Compass className="h-3.5 w-3.5 text-cyan-500" />
                <span>BAPPERIDA Regional</span>
              </div>
              {activeRole === "ADMIN_BAPPERIDA" && <Badge variant="outline" className="text-[9px] h-4 text-cyan-500 border-cyan-500">Aktif</Badge>}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-xs flex items-center justify-between"
              onClick={() => switchRole("WARGA")}
            >
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-amber-500" />
                <span>Warga Desa (PWA)</span>
              </div>
              {activeRole === "WARGA" && <Badge variant="outline" className="text-[9px] h-4 text-amber-500 border-amber-500">Aktif</Badge>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle className="h-8 w-8 text-muted-foreground hover:text-foreground" />
      </div>
    </header>
  );
}
