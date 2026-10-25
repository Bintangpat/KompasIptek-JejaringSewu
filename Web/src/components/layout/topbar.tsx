"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  User,
  Shield,
  Radio,
  Building,
  RefreshCw,
} from "lucide-react";

export function Topbar() {
  const { user, isMockMode, setMockMode, loginAsDemo, logout } = useAuth();

  const handleRoleToggle = () => {
    if (user?.role === "ADMIN_BUMDES") {
      loginAsDemo("ADMIN_BAPPERIDA");
    } else {
      loginAsDemo("ADMIN_BUMDES");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10">
      {/* Left Info: Pekon or Scope */}
      <div className="flex items-center gap-3">
        {user?.pekon ? (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-sm text-slate-800">
              {user.pekon.namaPekon}
            </span>
            <span className="text-xs text-slate-400">
              ({user.pekon.kecamatan}, Kab. Pringsewu)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-sm text-slate-800">
              BAPPERIDA Kab. Pringsewu
            </span>
            <span className="text-xs text-slate-400">
              (Otoritas Perencanaan & Riset Inovasi)
            </span>
          </div>
        )}

        {/* Mock / Online Indicator */}
        <div className="hidden md:flex items-center gap-1.5 ml-4">
          <span
            className={`w-2 h-2 rounded-full ${
              isMockMode ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
            }`}
          />
          <span className="text-xs text-slate-500 font-medium">
            {isMockMode ? "Mode Demo / Offline" : "Live API Server (Port 4000)"}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Switch Role Demo button for presentation */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRoleToggle}
          className="text-xs h-8 gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-50"
          title="Beralih peran untuk demo presentasi juri Kompas Iptek"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Ganti Peran:</span>
          <span className="font-semibold text-emerald-700">
            {user?.role === "ADMIN_BUMDES" ? "BAPPERIDA" : "BUMDes"}
          </span>
        </Button>

        {/* User Role Badge */}
        <Badge
          variant={user?.role === "ADMIN_BUMDES" ? "default" : "secondary"}
          className="text-xs font-semibold"
        >
          {user?.role === "ADMIN_BUMDES" ? "Admin BUMDes" : "BAPPERIDA"}
        </Badge>

        {/* User Profile Info */}
        <div className="hidden lg:flex flex-col text-right">
          <span className="text-xs font-semibold text-slate-800">
            {user?.fullName || "Administrator"}
          </span>
          <span className="text-[10px] text-slate-400">
            {user?.phoneNumber || "-"}
          </span>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="text-slate-500 hover:text-red-600 hover:bg-red-50 h-9 w-9"
          title="Keluar dari sesi"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
