import { z } from 'zod';

export const startRouteSchema = z.object({
  originName: z.string().min(3, 'Nama lokasi asal minimal 3 karakter'),
  destinationName: z.string().min(3, 'Nama lokasi tujuan minimal 3 karakter'),
  originLat: z.number().min(-90).max(90),
  originLng: z.number().min(-180).max(180),
  destLat: z.number().min(-90).max(90),
  destLng: z.number().min(-180).max(180),
});

export const orderJastipSchema = z.object({
  itemDescription: z.string().min(3, 'Deskripsi barang titipan minimal 3 karakter'),
  fuelShareCost: z.number().min(1000, 'Ongkos patungan bensin minimal Rp 1.000'),
  pickupLat: z.number().min(-90).max(90),
  pickupLng: z.number().min(-180).max(180),
});

export type StartRouteFormData = z.infer<typeof startRouteSchema>;
export type OrderJastipFormData = z.infer<typeof orderJastipSchema>;
