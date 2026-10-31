"use client";

import React, { createContext, useContext, useState } from "react";
import { Pekon, UserProfile, UserRole } from "@/types";
import { MOCK_PEKON_LIST } from "@/lib/mock-data";

interface AuthContextType {
  user: UserProfile;
  token: string | null;
  isLoading: boolean;
  activeRole: UserRole;
  activePekon: Pekon;
  switchRole: (role: UserRole) => void;
  switchPekon: (pekonId: string) => void;
  login: (identifier: string, password: string) => Promise<UserProfile>;
  verifyOtpLogin: (identifier: string, otpCode: string) => Promise<UserProfile>;
  logout: () => void;
}

const DEFAULT_PEKON = MOCK_PEKON_LIST[0];

const DEFAULT_PROFILES: Record<UserRole, UserProfile> = {
  ADMIN_BUMDES: {
    id: "bumdes-admin-01",
    fullName: "Bambang Haryanto",
    phoneNumber: "081298765432",
    email: "admin.bumdes@pagelaran.pekon.id",
    role: "ADMIN_BUMDES",
    isNikVerified: true,
    vulnerabilityFlags: ["NONE"],
    hasToddler: false,
    referralCode: "BUMDES-PGL",
    isTrustedCollector: true,
    pekon: DEFAULT_PEKON,
    wallet: {
      pointsBalance: "1250",
      cashBalance: "48500000",
    },
    createdAt: "2026-01-01T00:00:00Z",
  },
  ADMIN_BAPPERIDA: {
    id: "bapperida-admin-01",
    fullName: "Dr. Heri Kuswanto, M.Si",
    phoneNumber: "08117210088",
    email: "heri.kuswanto@pringsewukab.go.id",
    role: "ADMIN_BAPPERIDA",
    isNikVerified: true,
    vulnerabilityFlags: ["NONE"],
    hasToddler: false,
    referralCode: "BAPPERIDA-KAB",
    isTrustedCollector: false,
    pekon: DEFAULT_PEKON,
    wallet: {
      pointsBalance: "9999",
      cashBalance: "500000000",
    },
    createdAt: "2026-01-01T00:00:00Z",
  },
  WARGA: {
    id: "d456d59d-d98b-426a-a476-fe65b18482d5",
    fullName: "Pak Slamet (Petani & Kurir Jastip)",
    phoneNumber: "081234567894",
    email: "slamet.warga@gmail.com",
    role: "WARGA",
    isNikVerified: true,
    vulnerabilityFlags: ["NONE"],
    hasToddler: true,
    referralCode: "SLAMET-001",
    isTrustedCollector: true,
    pekon: DEFAULT_PEKON,
    wallet: {
      pointsBalance: "185",
      cashBalance: "450000",
    },
    createdAt: "2026-10-15T08:00:00Z",
  },
  PENGUMPUL_JUJUR: {
    id: "pengumpul-01",
    fullName: "Haji Rohmat (Pengepul Jujur Komoditas)",
    phoneNumber: "081377889900",
    email: "rohmat.tani@gmail.com",
    role: "PENGUMPUL_JUJUR",
    isNikVerified: true,
    vulnerabilityFlags: ["NONE"],
    hasToddler: false,
    referralCode: "ROHMAT-JUJUR",
    isTrustedCollector: true,
    pekon: DEFAULT_PEKON,
    wallet: {
      pointsBalance: "420",
      cashBalance: "12800000",
    },
    createdAt: "2026-02-10T00:00:00Z",
  },
  UMKM: {
    id: "umkm-01",
    fullName: "Warung Bu Siti (UMKM Keripik Pisang)",
    phoneNumber: "085266778899",
    email: "siti.keripik@gmail.com",
    role: "UMKM",
    isNikVerified: true,
    vulnerabilityFlags: ["NONE"],
    hasToddler: false,
    referralCode: "SITI-UMKM",
    isTrustedCollector: false,
    pekon: DEFAULT_PEKON,
    wallet: {
      pointsBalance: "310",
      cashBalance: "3400000",
    },
    createdAt: "2026-03-05T00:00:00Z",
  },
  SUPER_ADMIN: {
    id: "superadmin-01",
    fullName: "Super Administrator Diskominfo",
    phoneNumber: "081199990000",
    email: "root@pringsewukab.go.id",
    role: "SUPER_ADMIN",
    isNikVerified: true,
    vulnerabilityFlags: ["NONE"],
    hasToddler: false,
    referralCode: "ROOT-SEWU",
    isTrustedCollector: true,
    pekon: DEFAULT_PEKON,
    wallet: {
      pointsBalance: "99999",
      cashBalance: "999999999",
    },
    createdAt: "2026-01-01T00:00:00Z",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>("ADMIN_BUMDES");
  const [activePekon, setActivePekon] = useState<Pekon>(DEFAULT_PEKON);
  const [user, setUser] = useState<UserProfile>(DEFAULT_PROFILES.ADMIN_BUMDES);

  const switchRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    const profile = DEFAULT_PROFILES[newRole] || DEFAULT_PROFILES.ADMIN_BUMDES;
    setUser({ ...profile, pekon: activePekon });
  };

  const switchPekon = (pekonId: string) => {
    const found = MOCK_PEKON_LIST.find((p) => p.id === pekonId);
    if (found) {
      setActivePekon(found);
      setUser((prev) => ({ ...prev, pekon: found }));
    }
  };

  const login = async (): Promise<UserProfile> => {
    return user;
  };

  const verifyOtpLogin = async (): Promise<UserProfile> => {
    return user;
  };

  const logout = () => {
    switchRole("WARGA");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: "zero-auth-demo-token",
        isLoading: false,
        activeRole,
        activePekon,
        switchRole,
        switchPekon,
        login,
        verifyOtpLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
