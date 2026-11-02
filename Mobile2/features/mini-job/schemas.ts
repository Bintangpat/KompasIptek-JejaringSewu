import { z } from 'zod';

export const createMiniJobSchema = z.object({
  title: z.string().min(3, 'Judul pekerjaan minimal 3 karakter (contoh: Kupas Singkong 50kg)'),
  description: z.string().min(5, 'Deskripsi rincian tugas dan lokasi kerja minimal 5 karakter'),
  wageAmount: z.number().min(5000, 'Upah tunai tugas minimal Rp 5.000'),
  isDisabilityFriendly: z.boolean().default(false),
});

export type CreateMiniJobFormData = z.infer<typeof createMiniJobSchema>;
