import { api } from "@/lib/api-client";
import { MiniJob } from "@/types";
import { CreateMiniJobPayload, ClaimJobResult } from "./types";

export const miniJobApi = {
  getJobs: (params?: { status?: string; isDisabilityFriendly?: boolean }): Promise<MiniJob[]> => {
    return api.get<MiniJob[]>("/mini-jobs", params);
  },

  createJob: (payload: CreateMiniJobPayload): Promise<MiniJob> => {
    return api.post<MiniJob>("/mini-jobs", payload);
  },

  claimJob: (jobId: string): Promise<ClaimJobResult> => {
    return api.post<ClaimJobResult>(`/mini-jobs/${jobId}/claim`, {});
  },
};
