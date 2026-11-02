import { Wallet, LedgerEntry } from '@/types/entities';

export interface WalletResponse {
  walletId: string;
  pointsBalance: number | string;
  cashBalance: number | string;
  recentLedgerEntries?: LedgerEntry[];
}

export type LedgerFilterType = 'ALL' | 'IDR' | 'POINTS';
