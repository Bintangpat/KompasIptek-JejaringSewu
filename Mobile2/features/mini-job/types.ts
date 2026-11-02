import { MiniJob } from '@/types/entities';

export interface CreateMiniJobRequest {
  title: string;
  description: string;
  wageAmount: number;
  isDisabilityFriendly?: boolean;
}

export interface MiniJobQuery {
  status?: string;
  isDisabilityFriendly?: boolean;
}

export interface ClaimJobResponse {
  job: MiniJob;
  transactionId: string;
  transactionToken: string;
  status: string;
  message: string;
}
