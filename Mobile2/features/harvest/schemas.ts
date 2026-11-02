import { z } from 'zod';

export const createHarvestSchema = z.object({
  commodityName: z.string().min(3, 'Nama komoditas minimal 3 karakter (contoh: Singkong Manis)'),
  estimatedKg: z.number().min(1, 'Estimasi berat minimal 1 kg'),
  minPricePerKg: z.number().min(100, 'Harga penawaran minimal Rp 100/kg'),
});

export const placeBidSchema = z.object({
  offeredPricePerKg: z.number().min(100, 'Harga penawaran minimal Rp 100/kg'),
  referralUsedCode: z.string().optional(),
});

export type CreateHarvestFormData = z.infer<typeof createHarvestSchema>;
export type PlaceBidFormData = z.infer<typeof placeBidSchema>;
