import { HarvestListing, HarvestBid, TrustedCollector } from '@/types/entities';

export interface CreateHarvestRequest {
  commodityName: string;
  estimatedKg: number;
  minPricePerKg: number;
}

export interface PlaceBidRequest {
  offeredPricePerKg: number;
  referralUsedCode?: string;
}

export interface AcceptBidResponse {
  transactionId: string;
  transactionToken: string;
  status: string;
  grossAmount: string | number;
  message: string;
}

export interface HarvestQuery {
  pekonId?: string;
  commodityName?: string;
  status?: string;
}
