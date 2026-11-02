import { api } from "@/lib/api-client";
import { HarvestListing, UserProfile } from "@/types";
import { CreateHarvestPayload, PlaceBidPayload, AcceptBidResult } from "./types";

export const harvestApi = {
  getListings: (params?: { pekonId?: string; commodityName?: string; status?: string }): Promise<HarvestListing[]> => {
    return api.get<HarvestListing[]>("/harvests/listings", params);
  },

  createListing: (payload: CreateHarvestPayload): Promise<HarvestListing> => {
    return api.post<HarvestListing>("/harvests/listings", payload);
  },

  placeBid: (payload: PlaceBidPayload): Promise<any> => {
    return api.post(`/harvests/listings/${payload.listingId}/bids`, {
      offeredPricePerKg: payload.offeredPricePerKg,
      referralUsedCode: payload.referralUsedCode,
    });
  },

  acceptBid: (bidId: string): Promise<AcceptBidResult> => {
    return api.post<AcceptBidResult>(`/harvests/bids/${bidId}/accept`, {});
  },

  getTrustedCollectors: (): Promise<UserProfile[]> => {
    return api.get<UserProfile[]>("/harvests/collectors/trusted");
  },
};
