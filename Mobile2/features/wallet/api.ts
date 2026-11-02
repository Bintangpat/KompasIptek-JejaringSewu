import { apiClient } from '@/services/api';
import { WalletResponse } from './types';

export const walletApi = {
  // 1. Saldo Kas Mikro, Poin Reputasi, & 20 Riwayat Mutasi Buku Besar Terkini
  async getMyWallet(): Promise<WalletResponse> {
    const res: any = await apiClient.get('/wallets/me');
    return res.data || res;
  },
};
