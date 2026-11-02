"use client";

import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { creditScoringApi } from "./api";
import {
  ApproveLoanPayload,
  ApproveLoanResult,
  DisburseLoanResult,
  RepayLoanResult,
} from "./types";
import { CreditScoreDetail, LoanRecommendation } from "@/types";

export function useMyCreditScore() {
  const fallbackScore: CreditScoreDetail = {
    id: "snapshot-01",
    userId: "user-01",
    totalSkredit: 92.5,
    score: 92.5,
    grade: "GRADE_A_LAYAK_MODAL",
    details: {
      jastipScore: 80,
      miniJobScore: 100,
      harvestScore: 90,
      selfiePoWScore: 100,
      inclusionScore: 100,
      calculatedAt: new Date().toISOString(),
    },
    breakdown: {
      jastipScore: 80,
      minijobScore: 100,
      hasilbumiScore: 90,
      selfieScore: 100,
      inklusiScore: 100,
    },
    createdAt: new Date().toISOString(),
  };

  return useApiQuery<CreditScoreDetail>("/credit-scoring/me", {
    fallbackData: fallbackScore,
  });
}

export function usePekonCreditScores(pekonId: string) {
  return useApiQuery<any[]>(
    pekonId ? `/credit-scoring/pekon/${pekonId}` : null,
    {
      fallbackData: [],
    }
  );
}

export function useEligibleLoans(pekonId?: string) {
  return useApiQuery<LoanRecommendation[]>("/credit-scoring/loans/eligible", {
    params: pekonId ? { pekonId } : undefined,
    fallbackData: [],
  });
}

export function useActiveLoans(params?: { pekonId?: string; status?: string }) {
  return useApiQuery<LoanRecommendation[]>("/credit-scoring/loans/active", {
    params,
    fallbackData: [],
  });
}

export function useCreditScoringActions() {
  const approveMutation = useApiMutation<ApproveLoanResult, { loanId: string; payload: ApproveLoanPayload }>(
    ({ loanId, payload }) => creditScoringApi.approveLoan(loanId, payload),
    {
      successMessage: "Plafon modal kerja tanpa agunan berhasil disetujui BUMDes.",
    }
  );

  const disburseMutation = useApiMutation<DisburseLoanResult, string>(
    (loanId) => creditScoringApi.disburseLoan(loanId),
    {
      successMessage: "Pencairan modal kerja bergulir sukses disalurkan ke warga.",
    }
  );

  const repayMutation = useApiMutation<RepayLoanResult, string>(
    (loanId) => creditScoringApi.repayLoan(loanId),
    {
      successMessage: "Pencatatan pengembalian/pelunasan modal bergulir sukses.",
    }
  );

  return {
    approveLoan: approveMutation.mutate,
    isApproving: approveMutation.isLoading,
    disburseLoan: disburseMutation.mutate,
    isDisbursing: disburseMutation.isLoading,
    repayLoan: repayMutation.mutate,
    isRepaying: repayMutation.isLoading,
  };
}
