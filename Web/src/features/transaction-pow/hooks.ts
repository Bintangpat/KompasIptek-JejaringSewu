"use client";

import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { transactionApi } from "./api";
import { SubmitSelfiePoWPayload, PoWVerificationResult, AuditTrailEntry } from "./types";
import { UnifiedTransaction } from "@/types";

export function useMyTransactions(params?: { type?: string; status?: string }) {
  return useApiQuery<UnifiedTransaction[]>("/transactions/me", {
    params,
    fallbackData: [],
  });
}

export function usePekonTransactions(pekonId: string, limit = 20) {
  return useApiQuery<UnifiedTransaction[]>(
    pekonId ? `/transactions/pekon/${pekonId}` : null,
    {
      params: { limit },
      fallbackData: [],
    }
  );
}

export function useAuditTrail(limit = 50) {
  return useApiQuery<AuditTrailEntry[]>("/transactions/audit-trail", {
    params: { limit },
    fallbackData: [],
  });
}

export function useTransactionActions() {
  const submitPoWMutation = useApiMutation<PoWVerificationResult, { txId: string; payload: SubmitSelfiePoWPayload }>(
    ({ txId, payload }) => transactionApi.submitSelfiePoW(txId, payload),
    {
      successMessage: "Bukti Selfie PoW berhasil diverifikasi oleh sistem konsensus desa!",
    }
  );

  return {
    submitPoW: submitPoWMutation.mutate,
    isSubmittingPoW: submitPoWMutation.isLoading,
  };
}
