import { UnifiedTransaction, LedgerEntry } from "@/types";

export interface SubmitSelfiePoWPayload {
  imageStorageUrl: string;
  imageSha256Hash: string;
  gpsLatitude: number;
  gpsLongitude: number;
  gpsAccuracyMeters: number;
  pekonNameOverlay: string;
  isCameraDirect: boolean;
}

export interface PoWVerificationResult {
  transactionId: string;
  status: string;
  creditScore: {
    totalSkredit: string | number;
    grade: string;
  };
  loanRecommendation?: {
    id: string;
    plafond: string | number;
    status: string;
  };
  message: string;
}

export interface AuditTrailEntry extends LedgerEntry {
  isIntegrityValid: boolean;
}
