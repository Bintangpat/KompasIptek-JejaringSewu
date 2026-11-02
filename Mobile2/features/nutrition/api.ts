import { apiClient } from '@/services/api';
import { NutritionPackage, NutritionRedemption } from '@/types/entities';
import { RedeemPackageRequest, RedeemPackageResponse } from './types';

export const nutritionApi = {
  // 1. Katalog Paket Pangan Bergizi Lokal (Telur Bebek, Nila Segar, Bayam Organik)
  async getPackages(pekonId?: string): Promise<NutritionPackage[]> {
    const url = `/nutrition/packages${pekonId ? `?pekonId=${pekonId}` : ''}`;
    const res: any = await apiClient.get(url);
    return res.data || res || [];
  },

  // 2. Penukaran Poin ke Paket Gizi (Closed-Loop Circular Economy)
  async redeemPackage(payload: RedeemPackageRequest): Promise<RedeemPackageResponse> {
    const res: any = await apiClient.post('/nutrition/redeem', payload);
    return res.data || res;
  },

  // 3. Riwayat Penukaran Paket Gizi Saya (Sesuai Backend APIDocumentation.md 9.3)
  async getMyRedemptions(): Promise<NutritionRedemption[]> {
    const res: any = await apiClient.get('/nutrition/redemptions/me');
    return res.data || res || [];
  },
};
