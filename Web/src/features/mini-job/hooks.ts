"use client";

import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { miniJobApi } from "./api";
import { CreateMiniJobPayload, ClaimJobResult } from "./types";
import { MiniJob } from "@/types";

export function useMiniJobs(params?: { status?: string; isDisabilityFriendly?: boolean }) {
  return useApiQuery<MiniJob[]>("/mini-jobs", {
    params,
    fallbackData: [],
  });
}

export function useMiniJobActions() {
  const createJobMutation = useApiMutation<MiniJob, CreateMiniJobPayload>(
    (vars) => miniJobApi.createJob(vars),
    {
      successMessage: "Tugas mini-job berhasil diterbitkan ke bursa kerja desa.",
    }
  );

  const claimJobMutation = useApiMutation<ClaimJobResult, string>(
    (jobId) => miniJobApi.claimJob(jobId),
    {
      successMessage: "Tugas berhasil diklaim secara otomatis (Auto-Accept Lock aktif).",
    }
  );

  return {
    createJob: createJobMutation.mutate,
    isCreating: createJobMutation.isLoading,
    claimJob: claimJobMutation.mutate,
    isClaiming: claimJobMutation.isLoading,
  };
}
