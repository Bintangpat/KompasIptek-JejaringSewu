"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, UserRole } from "@/types";
import { apiClient } from "@/lib/api-client";
import { MOCK_PEKON_LIST } from "@/lib/mock-data";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isMockMode: boolean;
  setMockMode: (val: boolean) => void;
  login: (identifier: string, password: string) => Promise<UserProfile>;
  loginAsDemo: (role: "ADMIN_BUMDES" | "ADMIN_BAPPERIDA") => UserProfile;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    // Check saved session in localStorage
    const savedToken = localStorage.getItem("jejaring_access_token");
    const savedUser = localStorage.getItem("jejaring_user");
    const savedMockMode = localStorage.getItem("jejaring_mock_mode");

    if (savedMockMode === "true") {
      setIsMockMode(true);
    }

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("jejaring_access_token");
        localStorage.removeItem("jejaring_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", {
        identifier,
        password,
        deviceId: "web-dashboard-client",
      });

      const data = response.data;
      const accessToken = data.accessToken;
      const userProfile = data.user;

      localStorage.setItem("jejaring_access_token", accessToken);
      localStorage.setItem("jejaring_user", JSON.stringify(userProfile));
      localStorage.removeItem("jejaring_mock_mode");

      setToken(accessToken);
      setUser(userProfile);
      setIsMockMode(false);
      return userProfile;
    } catch (err: any) {
      // Fallback to offline mock login if server unreachable and using demo credentials
      if (
        (identifier === "081234567891" || identifier === "bumdes@pekon.id") &&
        password === "AdminBumdes123!"
      ) {
        return loginAsDemo("ADMIN_BUMDES");
      } else if (
        (identifier === "081234567892" || identifier === "bapperida@pringsewukab.go.id") &&
        password === "BapperidaPringsewu123!"
      ) {
        return loginAsDemo("ADMIN_BAPPERIDA");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = (role: "ADMIN_BUMDES" | "ADMIN_BAPPERIDA"): UserProfile => {
    const demoUser: UserProfile =
      role === "ADMIN_BUMDES"
        ? {
            id: "d456d59d-d98b-426a-a476-fe65b18482d1",
            fullName: "Budi Santoso (Admin BUMDes Pagelaran)",
            phoneNumber: "081234567891",
            email: "bumdes@pekon.id",
            role: "ADMIN_BUMDES",
            isNikVerified: true,
            vulnerabilityFlags: ["NONE"],
            hasToddler: false,
            isTrustedCollector: false,
            pekon: MOCK_PEKON_LIST[0],
            createdAt: "2026-10-21T00:00:00Z",
          }
        : {
            id: "d456d59d-d98b-426a-a476-fe65b18482d2",
            fullName: "Ir. H. Hendra, M.Si (Admin BAPPERIDA)",
            phoneNumber: "081234567892",
            email: "bapperida@pringsewukab.go.id",
            role: "ADMIN_BAPPERIDA",
            isNikVerified: true,
            vulnerabilityFlags: ["NONE"],
            hasToddler: false,
            isTrustedCollector: false,
            createdAt: "2026-10-21T00:00:00Z",
          };

    const mockToken = `mock-token-${role.toLowerCase()}-${Date.now()}`;
    localStorage.setItem("jejaring_access_token", mockToken);
    localStorage.setItem("jejaring_user", JSON.stringify(demoUser));
    localStorage.setItem("jejaring_mock_mode", "true");

    setToken(mockToken);
    setUser(demoUser);
    setIsMockMode(true);
    return demoUser;
  };

  const logout = () => {
    try {
      if (!isMockMode) {
        apiClient.post("/auth/logout").catch(() => {});
      }
    } finally {
      localStorage.removeItem("jejaring_access_token");
      localStorage.removeItem("jejaring_user");
      localStorage.removeItem("jejaring_mock_mode");
      setUser(null);
      setToken(null);
      setIsMockMode(false);
      window.location.href = "/login";
    }
  };

  const handleSetMockMode = (val: boolean) => {
    setIsMockMode(val);
    localStorage.setItem("jejaring_mock_mode", val ? "true" : "false");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isMockMode,
        setMockMode: handleSetMockMode,
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
