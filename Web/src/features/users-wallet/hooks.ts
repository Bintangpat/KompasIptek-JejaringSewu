"use client";

import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { usersWalletApi } from "./api";
import { UpdateProfilePayload, VerifyNikPayload, WalletWithLedger } from "./types";
import { UserProfile } from "@/types";
import { useAuth } from "@/context/auth-context";

export function useMyProfile() {
  const { user } = useAuth();
  return useApiQuery<UserProfile>("/users/me", {
    fallbackData: user,
  });
}

export function useMyWallet() {
  const { user } = useAuth();
  const fallbackWallet: WalletWithLedger = {
    id: "wallet-mock-01",
    walletId: "wallet-mock-01",
    userId: user.id,
    pointsBalance: user.wallet?.pointsBalance || "185",
    cashBalance: user.wallet?.cashBalance || "450000",
    recentLedgerEntries: [],
  };

  return useApiQuery<WalletWithLedger>("/wallets/me", {
    fallbackData: fallbackWallet,
  });
}

export function usePekonCitizens(pekonId: string, isNikVerified?: boolean) {
  return useApiQuery<UserProfile[]>(
    pekonId ? `/users/pekon/${pekonId}` : null,
    {
      params: isNikVerified !== undefined ? { isNikVerified: String(isNikVerified) } : undefined,
      fallbackData: [],
    }
  );
}

export function useUnverifiedCitizens(pekonId?: string) {
  return useApiQuery<UserProfile[]>("/users/unverified", {
    params: pekonId ? { pekonId } : undefined,
    fallbackData: [],
  });
}

export function useUserWalletActions() {
  const verifyNikMutation = useApiMutation<any, VerifyNikPayload>(
    (vars) => usersWalletApi.verifyNik(vars),
    {
      successMessage: "Identitas NIK fisik warga berhasil diverifikasi secara sah.",
    }
  );

  const updateProfileMutation = useApiMutation<UserProfile, UpdateProfilePayload>(
    (vars) => usersWalletApi.updateMyProfile(vars),
    {
      successMessage: "Data profil berhasil diperbarui.",
    }
  );

  return {
    verifyNik: verifyNikMutation.mutate,
    isVerifyingNik: verifyNikMutation.isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isLoading,
  };
}
