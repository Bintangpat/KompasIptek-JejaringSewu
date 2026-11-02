import { MiniJob } from "@/types";

export interface CreateMiniJobPayload {
  title: string;
  description: string;
  wageAmount: number;
  isDisabilityFriendly: boolean;
}

export interface ClaimJobResult {
  job: MiniJob;
  transactionId: string;
  transactionToken: string;
  status: string;
  message: string;
}
