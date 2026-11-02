import { UserProfile, VulnerabilityFlag, Wallet, LedgerEntry } from "@/types";

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  vulnerabilityFlags?: VulnerabilityFlag[];
  hasToddler?: boolean;
}

export interface VerifyNikPayload {
  userId: string;
  nikInput: string;
  notes?: string;
}

export interface WalletWithLedger extends Wallet {
  walletId: string;
  recentLedgerEntries: LedgerEntry[];
}
