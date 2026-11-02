import { UnifiedTransaction } from '@/types/entities';

export interface SelfiePoWSubmitRequest {
  imageStorageUrl: string;
  imageSha256Hash: string;
  gpsLatitude: number;
  gpsLongitude: number;
  gpsAccuracyMeters: number;
  pekonNameOverlay: string;
  isCameraDirect: boolean;
}

export interface SelfiePoWResponse {
  transactionId: string;
  status: string;
  creditScore?: {
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

export interface TransactionTokenResponse {
  transactionId: string;
  transactionToken: string;
  status: string;
  type: string;
  grossAmount: string | number;
}
