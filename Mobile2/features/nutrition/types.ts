import { NutritionPackage, NutritionRedemption } from '@/types/entities';

export interface RedeemPackageRequest {
  packageId: string;
}

export interface RedeemPackageResponse {
  redemptionId: string;
  packageName: string;
  pointsSpent: number | string;
  remainingPoints: number | string;
  message: string;
}
