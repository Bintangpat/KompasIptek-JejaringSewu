import { CreditScoreDetail, LoanRecommendation } from "@/types";

export interface ApproveLoanPayload {
  approvedPlafond?: number;
  notes?: string;
}

export interface ApproveLoanResult {
  loanId: string;
  status: string;
  approvedPlafond: string | number;
  message: string;
}

export interface DisburseLoanResult {
  loanId: string;
  status: string;
  message: string;
}

export interface RepayLoanResult {
  loanId: string;
  status: string;
  message: string;
}
