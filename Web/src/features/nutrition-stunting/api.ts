import { api } from "@/lib/api-client";
import { NutritionPackage, NutritionRedemption } from "@/types";
import {
  RedeemPackagePayload,
  RedeemPackageResult,
  RestockPackagePayload,
  RestockPackageResult,
  CompleteRedemptionResult,
} from "./types";

export const nutritionApi = {
  getPackages: (pekonId?: string): Promise<NutritionPackage[]> => {
    const params = pekonId ? { pekonId } : undefined;
    return api.get<NutritionPackage[]>("/nutrition/packages", params);
  },

  getMyRedemptions: (): Promise<NutritionRedemption[]> => {
    return api.get<NutritionRedemption[]>("/nutrition/redemptions/me");
  },

  redeemPackage: (payload: RedeemPackagePayload): Promise<RedeemPackageResult> => {
    return api.post<RedeemPackageResult>("/nutrition/redeem", payload);
  },

  restockPackage: (payload: RestockPackagePayload): Promise<RestockPackageResult> => {
    return api.patch<RestockPackageResult>(`/nutrition/packages/${payload.packageId}/restock`, {
      additionalStock: payload.additionalStock,
    });
  },

  getPekonRedemptions: (pekonId: string): Promise<NutritionRedemption[]> => {
    return api.get<NutritionRedemption[]>(`/nutrition/redemptions/pekon/${pekonId}`);
  },

  completeRedemption: (redemptionId: string): Promise<CompleteRedemptionResult> => {
    return api.patch<CompleteRedemptionResult>(`/nutrition/redemptions/${redemptionId}/complete`, {});
  },
};
