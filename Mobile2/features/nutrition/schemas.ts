import { z } from 'zod';

export const redeemNutritionSchema = z.object({
  packageId: z.string().min(1, 'Paket pangan bergizi wajib dipilih'),
});

export type RedeemNutritionFormData = z.infer<typeof redeemNutritionSchema>;
