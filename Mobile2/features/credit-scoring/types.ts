import { CreditGrade } from '@/types/enums';
import { LoanRecommendation } from '@/types/entities';

export interface ScoreBreakdown {
  jastipScore: number | string;
  minijobScore: number | string;
  hasilbumiScore: number | string;
  selfieScore: number | string;
  inklusiScore: number | string;
  calculatedAt: string;
}

export interface CreditScoreResponse {
  currentScore: number | string;
  grade: CreditGrade;
  breakdown: ScoreBreakdown;
  loanRecommendation?: LoanRecommendation | null;
}
