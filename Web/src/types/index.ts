// Standard API Response & Envelope Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
  path?: string;
}

export interface ApiError {
  success: false;
  errorCode: string;
  message: string;
  timestamp?: string;
  path?: string;
  statusCode?: number;
}

// User Roles & Enums
export type UserRole =
  | "WARGA"
  | "PENGEPUL"
  | "PENGUMPUL_JUJUR"
  | "UMKM"
  | "ADMIN_BUMDES"
  | "ADMIN_BAPPERIDA"
  | "SUPER_ADMIN";

export type VulnerabilityFlag =
  | "NONE"
  | "DISABILITAS_FISIK"
  | "DISABILITAS_SENSORIK"
  | "DISABILITAS_SENSORIK_NETRA"
  | "DISABILITAS_RUNGU_WICARA"
  | "LANSIA"
  | "LANSIA_PRODUKTIF"
  | "PEKKA_IBU_RUMAH_TANGGA"
  | "KELUARGA_PRA_SEJAHTERA"
  | "KELUARGA_RISIKO_STUNTING";

export type TransactionType =
  | "HARVEST_DEAL"
  | "NEBENG_JASTIP"
  | "MINI_JOB"
  | "NUTRITION_REDEEM";

export type TransactionStatus =
  | "INITIATED"
  | "LOCKED_ASSIGNED"
  | "IN_PROGRESS"
  | "AWAITING_SELFIE_POW"
  | "VERIFIED_COMPLETED"
  | "DISPUTED"
  | "CANCELLED";

export type CreditGrade =
  | "GRADE_A_LAYAK_MODAL"
  | "GRADE_B_PEMBINAAN"
  | "GRADE_C_AWAL";

// Pekon & Territory
export interface Pekon {
  id: string;
  kodeKemendagri?: string;
  namaPekon: string;
  kecamatan: string;
  kabupaten?: string;
  latitude: number;
  longitude: number;
  namaBumdes?: string | null;
  totalWarga?: number;
  totalLoansApproved?: number;
  avgCreditScore?: number;
  stuntingRiskCount?: number;
  createdAt?: string;
}

// Wallet & Ledger
export interface Wallet {
  id: string;
  userId: string;
  pointsBalance: string | number;
  cashBalance: string | number;
  updatedAt?: string;
  ledgerEntries?: LedgerEntry[];
}

export interface LedgerEntry {
  id: string;
  walletId: string;
  transactionId: string;
  entryType: "DEBIT" | "CREDIT";
  currency: "POINTS" | "IDR";
  amount: string | number;
  balanceBefore: string | number;
  balanceAfter: string | number;
  integritySignature: string;
  isIntegrityValid?: boolean;
  createdAt: string;
  user?: Partial<UserProfile>;
  transaction?: Partial<UnifiedTransaction>;
}

// User Profile
export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  role: UserRole;
  isNikVerified: boolean;
  vulnerabilityFlags: VulnerabilityFlag[];
  hasToddler: boolean;
  referralCode?: string;
  isTrustedCollector: boolean;
  employerInclusionCount?: number;
  isDeleted?: boolean;
  deletedAt?: string | null;
  status?: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  pekonId?: string;
  pekon?: Pekon;
  wallet?: {
    pointsBalance: string | number;
    cashBalance: string | number;
  };
  createdAt: string;
}

export interface SkippedUserDetail {
  row: number;
  name: string;
  identifier: string;
  reason: string;
}

export interface AdminImportResult {
  totalProcessed: number;
  successCount: number;
  skippedCount: number;
  skippedDetails: SkippedUserDetail[];
  message: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

// Bursa Panen (Harvest)
export interface HarvestListing {
  id: string;
  farmerId: string;
  farmer?: UserProfile;
  pekonId: string;
  pekon?: Pekon;
  commodityName: string;
  estimatedKg: number | string;
  minPricePerKg: number | string;
  status: "OPEN_BIDDING" | "DEAL_LOCKED" | "COMPLETED" | string;
  bids?: HarvestBid[];
  createdAt: string;
}

export interface HarvestBid {
  id: string;
  listingId: string;
  listing?: HarvestListing;
  collectorId: string;
  collector?: UserProfile;
  offeredPricePerKg: number | string;
  isAccepted: boolean;
  referralUsedCode?: string | null;
  createdAt: string;
}

// Tebeng-Jastip (Commuter)
export interface CommuterRoute {
  id: string;
  commuterId: string;
  commuter?: UserProfile;
  originName: string;
  destinationName: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  currentLat?: number | null;
  currentLng?: number | null;
  isActive: boolean;
  orders?: JastipOrder[];
  startedAt: string;
  endedAt?: string | null;
}

export interface JastipOrder {
  id: string;
  routeId: string;
  route?: CommuterRoute;
  requesterId: string;
  requester?: UserProfile;
  itemDescription: string;
  fuelShareCost: number | string;
  pickupLat: number;
  pickupLng: number;
  status: "REQUESTED" | "ACCEPTED" | "DELIVERED" | "CANCELLED" | string;
  createdAt: string;
}

// Mini Job (Zero Discrimination)
export interface MiniJob {
  id: string;
  employerId: string;
  employer?: UserProfile;
  workerId?: string | null;
  worker?: UserProfile | null;
  title: string;
  description: string;
  wageAmount: number | string;
  isDisabilityFriendly: boolean;
  autoAcceptLock: boolean;
  status: "OPEN" | "LOCKED_BY_PRIORITY" | "COMPLETED" | string;
  createdAt: string;
  lockedAt?: string | null;
}

// Unified Transaction & Proof of Work
export interface SelfieProofOfWork {
  id: string;
  transactionId: string;
  imageStorageUrl: string;
  imageSha256Hash: string;
  gpsLatitude: number;
  gpsLongitude: number;
  gpsAccuracyMeters: number;
  pekonNameOverlay: string;
  serverTimestamp?: string;
  isCameraDirect: boolean;
  validityScore: number;
}

export interface UnifiedTransaction {
  id: string;
  idempotencyKey?: string;
  transactionToken?: string;
  type: TransactionType;
  referenceEntityId: string;
  initiatorId: string;
  initiator?: UserProfile;
  counterpartyId: string;
  counterparty?: UserProfile;
  grossAmount: number | string;
  status: TransactionStatus;
  selfieProof?: SelfieProofOfWork | null;
  ledgerEntries?: LedgerEntry[];
  createdAt: string;
  completedAt?: string | null;
}

// SPK Credit Scoring (AHP-TOPSIS)
export interface CreditScoreDetail {
  id: string;
  userId: string;
  totalSkredit: number;
  score?: number; // UI compatibility
  grade: CreditGrade;
  details: {
    jastipScore: number;
    miniJobScore: number;
    harvestScore: number;
    selfiePoWScore: number;
    inclusionScore: number;
    calculatedAt?: string;
  };
  breakdown?: {
    jastipScore: string | number;
    minijobScore: string | number;
    hasilbumiScore: string | number;
    selfieScore: string | number;
    inklusiScore: string | number;
    calculatedAt?: string;
  };
  loanRecommendation?: LoanRecommendation;
  createdAt: string;
}

export interface LoanRecommendation {
  id: string;
  userId: string;
  user?: {
    id: string;
    fullName: string;
    phoneNumber: string;
    isNikVerified?: boolean;
    vulnerabilityFlags: VulnerabilityFlag[];
    pekon?: Pekon;
  };
  recommendedPlafond: number | string;
  approvedPlafond?: number | string | null;
  status: "ELIGIBLE_WAITING_BUMDES" | "APPROVED" | "DISBURSED" | "REPAID" | "REJECTED" | string;
  approvedByBumdesId?: string | null;
  approvedAt?: string | null;
  creditScoreSnapshot?: number;
  notes?: string | null;
  createdAt: string;
}

// Paket Gizi & Stunting
export interface NutritionPackage {
  id: string;
  pekonId: string;
  packageName: string;
  description?: string;
  pointsCost: number | string;
  stockCount: number;
  pekon?: Pekon;
}

export interface NutritionRedemption {
  id: string;
  userId: string;
  packageId: string;
  pointsSpent: number | string;
  status?: "CLAIMED" | "COMPLETED" | "PENDING" | "VERIFIED_PICKED_UP" | string;
  beneficiaryName?: string;
  toddlerAgeMonths?: number;
  user?: Partial<UserProfile>;
  package?: Partial<NutritionPackage>;
  redeemedAt?: string;
  createdAt?: string;
}
