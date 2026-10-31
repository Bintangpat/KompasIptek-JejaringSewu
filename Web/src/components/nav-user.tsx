"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import {
  EllipsisVerticalIcon,
  CircleUserRoundIcon,
  WalletIcon,
  CoinsIcon,
  ShieldCheckIcon,
  RepeatIcon,
} from "lucide-react";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const { user: authUser, activeRole, switchRole } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const roleColors: Record<UserRole, string> = {
    ADMIN_BUMDES: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    ADMIN_BAPPERIDA: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    WARGA: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    PENGUMPUL_JUJUR: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    UMKM: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    SUPER_ADMIN: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
  };

  const formatRupiah = (val?: string | number) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-border/40 rounded-lg p-2"
            >
              <Avatar className="h-8 w-8 rounded-md border border-primary/30">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-md bg-primary/20 text-primary font-bold text-xs">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-semibold text-foreground">{user.name}</span>
                <span className="truncate text-[11px] text-muted-foreground flex items-center gap-1">
                  <Badge variant="outline" className={`text-[9px] px-1 py-0 h-3.5 border ${roleColors[activeRole] || ""}`}>
                    {activeRole}
                  </Badge>
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-xl p-2 shadow-xl border border-border/60"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-1 font-normal">
              <div className="flex items-center gap-2.5 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-md border border-primary/40">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-md bg-primary/20 text-primary font-bold text-sm">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-semibold text-foreground text-sm">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Ringkasan Saldo Dompet & Poin */}
            <div className="rounded-lg bg-muted/60 p-2.5 my-1 space-y-1.5 border border-border/40">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <WalletIcon className="h-3.5 w-3.5 text-emerald-500" />
                  Saldo Kas
                </span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(authUser.wallet?.cashBalance)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CoinsIcon className="h-3.5 w-3.5 text-amber-500" />
                  Poin Gizi
                </span>
                <span className="font-bold text-amber-500">
                  {authUser.wallet?.pointsBalance || 0} Pts
                </span>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Quick Role Switcher */}
            <DropdownMenuLabel className="text-[11px] font-medium text-muted-foreground px-2 py-1">
              Ganti Peran Akun (Zero-Auth):
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center justify-between"
                onClick={() => switchRole("ADMIN_BUMDES")}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-500" />
                  <span>BUMDes Pekon</span>
                </div>
                {activeRole === "ADMIN_BUMDES" && (
                  <Badge variant="outline" className="text-[10px] h-4 text-emerald-500 border-emerald-500">Aktif</Badge>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center justify-between"
                onClick={() => switchRole("ADMIN_BAPPERIDA")}
              >
                <div className="flex items-center gap-2">
                  <CircleUserRoundIcon className="h-3.5 w-3.5 text-cyan-500" />
                  <span>BAPPERIDA Regional</span>
                </div>
                {activeRole === "ADMIN_BAPPERIDA" && (
                  <Badge variant="outline" className="text-[10px] h-4 text-cyan-500 border-cyan-500">Aktif</Badge>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer text-xs flex items-center justify-between"
                onClick={() => switchRole("WARGA")}
              >
                <div className="flex items-center gap-2">
                  <RepeatIcon className="h-3.5 w-3.5 text-amber-500" />
                  <span>Warga Desa / UMKM</span>
                </div>
                {activeRole === "WARGA" && (
                  <Badge variant="outline" className="text-[10px] h-4 text-amber-500 border-amber-500">Aktif</Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
