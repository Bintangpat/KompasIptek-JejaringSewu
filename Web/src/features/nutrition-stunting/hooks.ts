"use client";

import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { nutritionApi } from "./api";
import {
  RedeemPackagePayload,
  RedeemPackageResult,
  RestockPackagePayload,
  RestockPackageResult,
  CompleteRedemptionResult,
} from "./types";
import { NutritionPackage, NutritionRedemption } from "@/types";

export function useNutritionPackages(pekonId?: string) {
  return useApiQuery<NutritionPackage[]>("/nutrition/packages", {
    params: pekonId ? { pekonId } : undefined,
    fallbackData: [],
  });
}

export function useMyRedemptions() {
  return useApiQuery<NutritionRedemption[]>("/nutrition/redemptions/me", {
    fallbackData: [],
  });
}

export function usePekonRedemptions(pekonId: string) {
  return useApiQuery<NutritionRedemption[]>(
    pekonId ? `/nutrition/redemptions/pekon/${pekonId}` : null,
    {
      fallbackData: [],
    }
  );
}

export function useNutritionActions() {
  const redeemMutation = useApiMutation<RedeemPackageResult, RedeemPackagePayload>(
    (vars) => nutritionApi.redeemPackage(vars),
    {
      successMessage: "Paket pangan gizi lokal berhasil ditukarkan. Silakan ambil paket di BUMDes.",
    }
  );

  const restockMutation = useApiMutation<RestockPackageResult, RestockPackagePayload>(
    (vars) => nutritionApi.restockPackage(vars),
    {
      successMessage: "Stok paket pangan gizi desa berhasil ditambahkan.",
    }
  );

  const completeRedemptionMutation = useApiMutation<CompleteRedemptionResult, string>(
    (redemptionId) => nutritionApi.completeRedemption(redemptionId),
    {
      successMessage: "Serah terima fisik paket gizi ke warga telah tuntas diverifikasi.",
    }
  );

  return {
    redeemPackage: redeemMutation.mutate,
    isRedeeming: redeemMutation.isLoading,
    restockPackage: restockMutation.mutate,
    isRestocking: restockMutation.isLoading,
    completeRedemption: completeRedemptionMutation.mutate,
    isCompletingRedemption: completeRedemptionMutation.isLoading,
  };
}
