import { api } from "@/lib/api-client";
import { UnifiedTransaction } from "@/types";
import { SubmitSelfiePoWPayload, PoWVerificationResult, AuditTrailEntry } from "./types";

export const transactionApi = {
  getMyTransactions: (params?: { type?: string; status?: string }): Promise<UnifiedTransaction[]> => {
    return api.get<UnifiedTransaction[]>("/transactions/me", params);
  },

  getTransactionToken: (txId: string): Promise<{ transactionId: string; transactionToken: string; status: string }> => {
    return api.get(`/transactions/${txId}/token`);
  },

  submitSelfiePoW: (txId: string, payload: SubmitSelfiePoWPayload): Promise<PoWVerificationResult> => {
    return api.post<PoWVerificationResult>(`/transactions/${txId}/selfie-pow`, payload, {
      "X-Image-Hash": payload.imageSha256Hash,
    });
  },

  getPekonTransactions: (pekonId: string, limit = 20): Promise<UnifiedTransaction[]> => {
    return api.get<UnifiedTransaction[]>(`/transactions/pekon/${pekonId}`, { limit });
  },

  getAuditTrail: (limit = 50): Promise<AuditTrailEntry[]> => {
    return api.get<AuditTrailEntry[]>("/transactions/audit-trail", { limit });
  },
};
