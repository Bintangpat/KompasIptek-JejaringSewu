import { NutritionPackage, NutritionRedemption } from "@/types";

export interface RedeemPackagePayload {
  packageId: string;
}

export interface RedeemPackageResult {
  redemptionId: string;
  packageName: string;
  pointsSpent: string | number;
  remainingPoints: string | number;
  message: string;
}

export interface RestockPackagePayload {
  packageId: string;
  additionalStock: number;
}

export interface RestockPackageResult {
  success: boolean;
  packageId: string;
  packageName: string;
  newStockCount: number;
  message: string;
}

export interface CompleteRedemptionResult {
  success: boolean;
  redemptionId: string;
  status: string;
  message: string;
}
