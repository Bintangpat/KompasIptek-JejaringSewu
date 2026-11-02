"use client";

import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { harvestApi } from "./api";
import { CreateHarvestPayload, PlaceBidPayload, AcceptBidResult } from "./types";
import { HarvestListing, UserProfile } from "@/types";

export function useHarvestListings(params?: { pekonId?: string; commodityName?: string; status?: string }) {
  return useApiQuery<HarvestListing[]>("/harvests/listings", {
    params,
    fallbackData: [],
  });
}

export function useTrustedCollectors() {
  return useApiQuery<UserProfile[]>("/harvests/collectors/trusted", {
    fallbackData: [],
  });
}

export function useHarvestActions() {
  const createListingMutation = useApiMutation<HarvestListing, CreateHarvestPayload>(
    (vars) => harvestApi.createListing(vars),
    {
      successMessage: "Komoditas panen sukses diterbitkan ke bursa desa.",
    }
  );

  const placeBidMutation = useApiMutation<any, PlaceBidPayload>(
    (vars) => harvestApi.placeBid(vars),
    {
      successMessage: "Tawaran harga pengepul berhasil diajukan.",
    }
  );

  const acceptBidMutation = useApiMutation<AcceptBidResult, string>(
    (bidId) => harvestApi.acceptBid(bidId),
    {
      successMessage: "Tawaran berhasil diterima! Kesepakatan transaksi terkunci.",
    }
  );

  return {
    createListing: createListingMutation.mutate,
    isCreating: createListingMutation.isLoading,
    placeBid: placeBidMutation.mutate,
    isBidding: placeBidMutation.isLoading,
    acceptBid: acceptBidMutation.mutate,
    isAccepting: acceptBidMutation.isLoading,
  };
}
