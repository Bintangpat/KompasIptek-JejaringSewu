import { api } from "@/lib/api-client";
import { CreditScoreDetail, LoanRecommendation } from "@/types";
import { ApproveLoanPayload, ApproveLoanResult, DisburseLoanResult, RepayLoanResult } from "./types";

export const creditScoringApi = {
  getMyScore: (): Promise<CreditScoreDetail> => {
    return api.get<CreditScoreDetail>("/credit-scoring/me");
  },

  getPekonScores: (pekonId: string): Promise<any[]> => {
    return api.get(`/credit-scoring/pekon/${pekonId}`);
  },

  getEligibleLoans: (pekonId?: string): Promise<LoanRecommendation[]> => {
    const params = pekonId ? { pekonId } : undefined;
    return api.get<LoanRecommendation[]>("/credit-scoring/loans/eligible", params);
  },

  approveLoan: (loanId: string, payload: ApproveLoanPayload): Promise<ApproveLoanResult> => {
    return api.patch<ApproveLoanResult>(`/credit-scoring/loans/${loanId}/approve`, payload);
  },

  getActiveLoans: (params?: { pekonId?: string; status?: string }): Promise<LoanRecommendation[]> => {
    return api.get<LoanRecommendation[]>("/credit-scoring/loans/active", params);
  },

  disburseLoan: (loanId: string): Promise<DisburseLoanResult> => {
    return api.post<DisburseLoanResult>(`/credit-scoring/loans/${loanId}/disburse`, {});
  },

  repayLoan: (loanId: string): Promise<RepayLoanResult> => {
    return api.post<RepayLoanResult>(`/credit-scoring/loans/${loanId}/repay`, {});
  },
};
