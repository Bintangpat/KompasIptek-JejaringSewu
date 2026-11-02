import { apiClient } from '@/services/api';
import { MiniJob } from '@/types/entities';
import { CreateMiniJobRequest, MiniJobQuery, ClaimJobResponse } from './types';

export const miniJobApi = {
  // 1. Katalog Lowongan Kerja Mini-Job Aktif (Dukungan Server Filter isDisabilityFriendly)
  async getJobs(query?: MiniJobQuery): Promise<MiniJob[]> {
    const params = new URLSearchParams();
    if (query?.status) {
      params.append('status', query.status);
    } else {
      params.append('status', 'OPEN');
    }

    if (query?.isDisabilityFriendly !== undefined) {
      params.append('isDisabilityFriendly', String(query.isDisabilityFriendly));
    }

    const qs = params.toString();
    const url = `/mini-jobs${qs ? `?${qs}` : ''}`;
    const res: any = await apiClient.get(url);
    return res.data || res || [];
  },

  // 2. UMKM / Pelaku Usaha Pekon Pasang Lowongan Pekerjaan Harian
  async createJob(payload: CreateMiniJobRequest): Promise<MiniJob> {
    const res: any = await apiClient.post('/mini-jobs', payload);
    return res.data || res;
  },

  // 3. Pekerja Klaim Tugas Mini-Job (Atomic Auto-Accept Lock)
  async claimJob(jobId: string): Promise<ClaimJobResponse> {
    const res: any = await apiClient.post(`/mini-jobs/${jobId}/claim`);
    return res.data || res;
  },
};
