import { api } from "@/lib/api-client";
import { UserProfile } from "@/types";
import { UpdateProfilePayload, VerifyNikPayload, WalletWithLedger } from "./types";

export const usersWalletApi = {
  getMyProfile: (): Promise<UserProfile> => {
    return api.get<UserProfile>("/users/me");
  },

  updateMyProfile: (payload: UpdateProfilePayload): Promise<UserProfile> => {
    return api.patch<UserProfile>("/users/me", payload);
  },

  getUsersByPekon: (pekonId: string, isNikVerified?: boolean): Promise<UserProfile[]> => {
    const params = isNikVerified !== undefined ? { isNikVerified: String(isNikVerified) } : undefined;
    return api.get<UserProfile[]>(`/users/pekon/${pekonId}`, params);
  },

  getUnverifiedUsers: (pekonId?: string): Promise<UserProfile[]> => {
    const params = pekonId ? { pekonId } : undefined;
    return api.get<UserProfile[]>("/users/unverified", params);
  },

  verifyNik: (payload: VerifyNikPayload): Promise<{ success: boolean; userId: string; isNikVerified: boolean; message: string }> => {
    return api.post("/users/verify-nik", payload);
  },

  getMyWallet: (): Promise<WalletWithLedger> => {
    return api.get<WalletWithLedger>("/wallets/me");
  },
};
