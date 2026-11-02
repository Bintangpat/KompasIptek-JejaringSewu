"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Pekon, UserProfile, UserRole } from "@/types";
import { MOCK_PEKON_LIST } from "@/lib/mock-data";
import { setAccessToken, getAccessToken, api } from "@/lib/api-client";

interface AuthContextType {
  user: UserProfile;
  token: string | null;
  isLoading: boolean;
  activeRole: UserRole;
  activePekon: Pekon;
  isLiveAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
  switchPekon: (pekonId: string) => void;
  login: (identifier: string, password?: string, deviceId?: string) => Promise<any>;
  sendOtp: (
    identifier: string,
    purpose?: "REGISTRATION" | "FORGOT_PASSWORD" | "VERIFY_ACTION"
  ) => Promise<any>;
  verifyOtpLogin: (identifier: string, otpCode: string) => Promise<UserProfile>;
  refreshProfile: () => Promise<void>;
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
    pekonId: DEFAULT_PEKON.id,
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
    pekonId: DEFAULT_PEKON.id,
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
    pekonId: DEFAULT_PEKON.id,
    pekon: DEFAULT_PEKON,
    wallet: {
      pointsBalance: "185",
      cashBalance: "450000",
    },
    createdAt: "2026-10-15T08:00:00Z",
  },
  PENGEPUL: {
    id: "pengumpul-01",
    fullName: "Haji Rohmat (Pengepul Jujur Komoditas)",
    phoneNumber: "081377889900",
    email: "rohmat.tani@gmail.com",
    role: "PENGEPUL",
    isNikVerified: true,
    vulnerabilityFlags: ["NONE"],
    hasToddler: false,
    referralCode: "ROHMAT-JUJUR",
    isTrustedCollector: true,
    pekonId: DEFAULT_PEKON.id,
    pekon: DEFAULT_PEKON,
    wallet: {
      pointsBalance: "420",
      cashBalance: "12800000",
    },
    createdAt: "2026-02-10T00:00:00Z",
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
    pekonId: DEFAULT_PEKON.id,
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
    pekonId: DEFAULT_PEKON.id,
    pekon: DEFAULT_PEKON,
    wallet: {
      pointsBalance: "310",
      cashBalance: "3400000",
    },
    createdAt: "2026-03-05T00:00:00Z",
  },
  SUPER_ADMIN: {
    id: "superadmin-bintang-01",
    fullName: "Bintang SuperAdmin",
    phoneNumber: "087888316935",
    email: "bintang.superadmin@pringsewukab.go.id",
    role: "SUPER_ADMIN",
    isNikVerified: true,
    vulnerabilityFlags: ["NONE"],
    hasToddler: false,
    referralCode: "SUPER-BINTANG",
    isTrustedCollector: true,
    pekonId: DEFAULT_PEKON.id,
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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveAuthenticated, setIsLiveAuthenticated] = useState<boolean>(false);

  // Set default in-memory token for demo mode initial state
  useEffect(() => {
    setAccessToken("demo-jwt-token-active");
    setToken("demo-jwt-token-active");
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setActiveRole(newRole);
    const profile = DEFAULT_PROFILES[newRole] || DEFAULT_PROFILES.ADMIN_BUMDES;
    setUser({ ...profile, pekon: activePekon, pekonId: activePekon.id });
  }, [activePekon]);

  const switchPekon = useCallback((pekonId: string) => {
    const found = MOCK_PEKON_LIST.find((p) => p.id === pekonId);
    if (found) {
      setActivePekon(found);
      setUser((prev) => ({ ...prev, pekon: found, pekonId: found.id }));
    }
  }, []);

  // Sync profile from backend if live token exists
  const refreshProfile = useCallback(async () => {
    try {
      const profile = await api.get<UserProfile>("/users/me");
      if (profile && profile.id) {
        setUser(profile);
        if (profile.role) {
          setActiveRole(profile.role);
        }
        if (profile.pekon) {
          setActivePekon(profile.pekon);
        }
      }
    } catch {
      // Keep existing profile if offline/demo
    }
  }, []);

  const login = async (identifier: string, password?: string, deviceId = "web-client-01") => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", {
        identifier,
        password,
        deviceId,
      });

      if (response && response.accessToken) {
        setAccessToken(response.accessToken);
        setToken(response.accessToken);
        setIsLiveAuthenticated(true);
        if (response.user) {
          setUser(response.user);
          setActiveRole(response.user.role);
          if (response.user.pekon) {
            setActivePekon(response.user.pekon);
          }
        }
        return response;
      }
      return response;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (
    identifier: string,
    purpose: "REGISTRATION" | "FORGOT_PASSWORD" | "VERIFY_ACTION" = "VERIFY_ACTION"
  ) => {
    return api.post("/auth/otp/send", { identifier, purpose });
  };

  const verifyOtpLogin = async (identifier: string, otpCode: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/otp/verify", {
        identifier,
        otpCode,
      });

      if (response && response.accessToken) {
        setAccessToken(response.accessToken);
        setToken(response.accessToken);
        setIsLiveAuthenticated(true);
        if (response.user) {
          setUser(response.user);
          setActiveRole(response.user.role);
          if (response.user.pekon) {
            setActivePekon(response.user.pekon);
          }
          return response.user;
        }
      }
      return user;
    } catch (err) {
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setToken(null);
    setIsLiveAuthenticated(false);
    switchRole("WARGA");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        activeRole,
        activePekon,
        isLiveAuthenticated,
        switchRole,
        switchPekon,
        login,
        sendOtp,
        verifyOtpLogin,
        refreshProfile,
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
