"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { NavUser } from "@/components/nav-user";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ShieldCheck,
  Scale,
  Banknote,
  Apple,
  Briefcase,
  TrendingUp,
  Radar,
  MapPin,
  FileSearch,
  ShoppingBag,
  Car,
  Camera,
  Coins,
  UserCheck,
  Sparkles,
  Layers,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, activeRole, activePekon } = useAuth();

  const bumdesLinks = [
    { title: "Overview Pekon", url: "/bumdes/overview", icon: LayoutDashboard },
    { title: "Verifikasi NIK Warga", url: "/bumdes/verifikasi-nik", icon: ShieldCheck },
    { title: "Rekomendasi Modal (AHP)", url: "/bumdes/credit-scoring", icon: Scale },
    { title: "Monitoring Pencairan", url: "/bumdes/disbursement", icon: Banknote },
    { title: "Paket Nutrisi & Stunting", url: "/bumdes/nutrition", icon: Apple },
    { title: "Bursa Mini-Job Inklusif", url: "/bumdes/bursa-kerja", icon: Briefcase },
  ];

  const bapperidaLinks = [
    { title: "Regional Heatmap & KPI", url: "/bapperida/overview", icon: TrendingUp },
    { title: "Radar Sensitivitas SPK", url: "/bapperida/spk-radar", icon: Radar },
    { title: "Peta Sebaran Stunting", url: "/bapperida/stunting-map", icon: MapPin },
    { title: "Forensik Audit Trail", url: "/bapperida/audit-trail", icon: FileSearch },
  ];

  const citizenLinks = [
    { title: "Bursa Hasil Bumi", url: "/citizen/bursa", icon: ShoppingBag },
    { title: "Nebeng-Jastip Searah", url: "/citizen/jastip", icon: Car },
    { title: "Feed Mini-Job Inklusif", url: "/citizen/mini-job", icon: Briefcase },
    { title: "Studio Kamera Selfie PoW", url: "/citizen/pow", icon: Camera },
    { title: "Tukar Poin & Paket Gizi", url: "/citizen/poin", icon: Coins },
    { title: "Profil & Skor Kredit", url: "/citizen/profile", icon: UserCheck },
  ];

  const normalize = (path: string) => path.replace(/\/+$/, "") || "/";

  const isActive = (url: string) => {
    if (!pathname || !url) return false;
    const cleanPath = normalize(pathname);
    const cleanUrl = normalize(url);
    if (cleanUrl === "/") {
      return cleanPath === "/";
    }
    return cleanPath === cleanUrl || cleanPath.startsWith(cleanUrl + "/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-sidebar" {...props}>
      <SidebarHeader className="border-b border-border/40 px-3 py-3 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-primary/10">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                    JEJARING-SEWU
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                  </span>
                  <span className="truncate text-xs text-muted-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                    {activePekon.namaPekon}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 space-y-4 bg-sidebar">
        {/* Kelompok BUMDes */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 px-2 flex items-center justify-between">
            <span>BUMDes Pekon</span>
            {activeRole === "ADMIN_BUMDES" && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-emerald-500/50 text-emerald-600 dark:text-emerald-400">
                Aktif
              </Badge>
            )}
          </SidebarGroupLabel>
          <SidebarMenu className="mt-1 space-y-1">
            {bumdesLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className={cn(
                      "transition-all duration-150 rounded-md font-medium text-xs",
                      active
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/30 hover:bg-primary hover:text-primary-foreground [&_svg]:text-primary-foreground"
                        : "bg-sidebar text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground [&_svg]:text-sidebar-foreground/70"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-2.5 w-full">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate flex-1">{item.title}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground shrink-0 shadow-xs" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="my-1 opacity-50" />

        {/* Kelompok BAPPERIDA */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 px-2 flex items-center justify-between">
            <span>BAPPERIDA Regional</span>
            {activeRole === "ADMIN_BAPPERIDA" && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-cyan-500/50 text-cyan-600 dark:text-cyan-400">
                Aktif
              </Badge>
            )}
          </SidebarGroupLabel>
          <SidebarMenu className="mt-1 space-y-1">
            {bapperidaLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className={cn(
                      "transition-all duration-150 rounded-md font-medium text-xs",
                      active
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/30 hover:bg-primary hover:text-primary-foreground [&_svg]:text-primary-foreground"
                        : "bg-sidebar text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground [&_svg]:text-sidebar-foreground/70"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-2.5 w-full">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate flex-1">{item.title}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground shrink-0 shadow-xs" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="my-1 opacity-50" />

        {/* Kelompok Warga / Citizen PWA */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 px-2 flex items-center justify-between">
            <span>Portal Warga (PWA)</span>
            {activeRole === "WARGA" && (
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-amber-500/50 text-amber-600 dark:text-amber-400">
                Aktif
              </Badge>
            )}
          </SidebarGroupLabel>
          <SidebarMenu className="mt-1 space-y-1">
            {citizenLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className={cn(
                      "transition-all duration-150 rounded-md font-medium text-xs",
                      active
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs shadow-primary/30 hover:bg-primary hover:text-primary-foreground [&_svg]:text-primary-foreground"
                        : "bg-sidebar text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground [&_svg]:text-sidebar-foreground/70"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-2.5 w-full">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate flex-1">{item.title}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground shrink-0 shadow-xs" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2 bg-sidebar">
        <NavUser
          user={{
            name: user.fullName,
            email: user.email || user.phoneNumber,
            avatar: "/avatars/user-avatar.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
