import { HarvestListing, HarvestBid, UserProfile } from "@/types";

export interface CreateHarvestPayload {
  pekonId: string;
  commodityName: string;
  estimatedKg: number;
  minPricePerKg: number;
}

export interface PlaceBidPayload {
  listingId: string;
  offeredPricePerKg: number;
  referralUsedCode?: string;
}

export interface AcceptBidResult {
  transactionId: string;
  transactionToken: string;
  status: string;
  grossAmount: string | number;
  message: string;
}
