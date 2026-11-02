import { apiClient } from '@/services/api';
import { HarvestListing, HarvestBid, TrustedCollector } from '@/types/entities';
import {
  CreateHarvestRequest,
  PlaceBidRequest,
  AcceptBidResponse,
  HarvestQuery,
} from './types';

export const harvestApi = {
  // 1. Katalog Komoditas Panen Terbuka
  async getListings(query?: HarvestQuery): Promise<HarvestListing[]> {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.pekonId) params.append('pekonId', query.pekonId);
    if (query?.commodityName) params.append('commodityName', query.commodityName);

    const qs = params.toString();
    const url = `/harvests/listings${qs ? `?${qs}` : ''}`;
    const res: any = await apiClient.get(url);
    return res.data || res || [];
  },

  // 2. Petani Memasang Komoditas Panen Baru
  async createListing(payload: CreateHarvestRequest): Promise<HarvestListing> {
    const res: any = await apiClient.post('/harvests/listings', payload);
    return res.data || res;
  },

  // 3. Pengepul Mengajukan Penawaran Harga
  async placeBid(listingId: string, payload: PlaceBidRequest): Promise<HarvestBid> {
    const res: any = await apiClient.post(`/harvests/listings/${listingId}/bids`, payload);
    return res.data || res;
  },

  // 4. Petani Menyetujui Tawaran Pengepul (Deal Lock & Terbitkan Transaksi)
  async acceptBid(bidId: string): Promise<AcceptBidResponse> {
    const res: any = await apiClient.post(`/harvests/bids/${bidId}/accept`);
    return res.data || res;
  },

  // 5. Direktori Pengepul Jujur Terpercaya Pekon (Sesuai Backend APIDocumentation.md 4.5)
  async getTrustedCollectors(pekonId?: string): Promise<TrustedCollector[]> {
    const url = `/harvests/collectors/trusted${pekonId ? `?pekonId=${pekonId}` : ''}`;
    const res: any = await apiClient.get(url);
    return res.data || res || [];
  },
};
