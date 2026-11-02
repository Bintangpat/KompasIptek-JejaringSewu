import { apiClient } from '@/services/api';
import { CreditScoreResponse } from './types';

export const creditScoringApi = {
  // 1. Skor Kredit Terkini Saya (SPK AHP-TOPSIS & Rekomendasi Pinjaman Modal BUMDes)
  async getMyScore(): Promise<CreditScoreResponse> {
    const res: any = await apiClient.get('/credit-scoring/me');
    return res.data || res;
  },
};
