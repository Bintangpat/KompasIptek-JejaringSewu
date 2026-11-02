import { apiClient } from '@/services/api';
import { UnifiedTransaction } from '@/types/entities';
import {
  SelfiePoWSubmitRequest,
  SelfiePoWResponse,
  TransactionTokenResponse,
} from './types';

export const transactionApi = {
  // 1. Riwayat Transaksi Terpadu Saya
  async getMyTransactions(status?: string, type?: string): Promise<UnifiedTransaction[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);

    const qs = params.toString();
    const url = `/transactions/me${qs ? `?${qs}` : ''}`;
    const res: any = await apiClient.get(url);
    return res.data || res || [];
  },

  // 2. Ambil One-Time Transaction Token Ber-HMAC (Sesuai Backend APIDocumentation.md 7.2)
  async getTransactionToken(transactionId: string): Promise<TransactionTokenResponse> {
    const res: any = await apiClient.get(`/transactions/${transactionId}/token`);
    return res.data || res;
  },

  // 3. Unggah Selfie Proof-of-Work (Validasi Geotagging GPS, Hash SHA-256, & Auto-Scoring)
  async submitSelfiePoW(
    transactionId: string,
    payload: SelfiePoWSubmitRequest
  ): Promise<SelfiePoWResponse> {
    const res: any = await apiClient.post(`/transactions/${transactionId}/selfie-pow`, payload);
    return res.data || res;
  },
};
