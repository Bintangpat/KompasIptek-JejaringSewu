import {
  Role,
  VulnerabilityStatus,
  TransactionType,
  TransactionStatus,
  CreditGrade,
  MiniJobStatus,
  HarvestStatus,
  LedgerEntryType,
  CurrencyType,
} from './enums';

export interface Pekon {
  id: string;
  kodeKemendagri: string;
  namaPekon: string;
  kecamatan: string;
  namaBumdes?: string | null;
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  nikHash: string;
  isNikVerified: boolean;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  role: Role;
  vulnerabilityFlags: VulnerabilityStatus[];
  hasToddler: boolean;
  pekonId: string;
  pekon?: Pekon;
  referralCode: string;
  isTrustedCollector: boolean;
  employerInclusionCount: number;
  fcmToken?: string | null;
  wallet?: Wallet;
  createdAt?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  pointsBalance: number;
  cashBalance: number;
  version?: number;
  recentLedgerEntries?: LedgerEntry[];
}

export interface LedgerEntry {
  id: string;
  walletId: string;
  transactionId?: string | null;
  entryType: LedgerEntryType;
  currency: CurrencyType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  integritySignature?: string;
  isIntegrityValid?: boolean;
  createdAt: string;
}

export interface HarvestListing {
  id: string;
  farmerId: string;
  pekonId: string;
  commodityName: string;
  estimatedKg: number;
  minPricePerKg: number;
  status: HarvestStatus;
  farmer?: {
    id: string;
    fullName: string;
    phoneNumber: string;
  };
  pekon?: Pekon;
  bids?: HarvestBid[];
  _count?: {
    bids: number;
  };
  createdAt: string;
}

export interface HarvestBid {
  id: string;
  listingId: string;
  collectorId: string;
  offeredPricePerKg: number;
  referralUsedCode?: string | null;
  collector?: {
    id: string;
    fullName: string;
    phoneNumber: string;
    isTrustedCollector: boolean;
  };
  createdAt: string;
}

export interface TrustedCollector {
  id: string;
  fullName: string;
  phoneNumber: string;
  isTrustedCollector: boolean;
  pekon?: Pekon;
  successfulDealsCount?: number;
}

export interface MiniJob {
  id: string;
  employerId: string;
  pekonId?: string;
  title: string;
  description: string;
  wageAmount: number;
  isDisabilityFriendly: boolean;
  status: MiniJobStatus;
  autoAcceptLock: boolean;
  workerId?: string | null;
  employer?: {
    id: string;
    fullName: string;
    employerInclusionCount: number;
  };
  worker?: {
    id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface CommuterRoute {
  id: string;
  commuterId: string;
  originName: string;
  destinationName: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  currentLat?: number;
  currentLng?: number;
  isActive: boolean;
  commuter?: {
    id: string;
    fullName: string;
    phoneNumber: string;
  };
  distance_meters?: number;
  createdAt: string;
}

export interface JastipOrder {
  id: string;
  routeId: string;
  requesterId: string;
  itemDescription: string;
  fuelShareCost: number;
  pickupLat: number;
  pickupLng: number;
  status: 'REQUESTED' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
  requester?: {
    id: string;
    fullName: string;
    phoneNumber: string;
  };
  createdAt: string;
}

export interface UnifiedTransaction {
  id: string;
  initiatorId: string;
  counterpartyId: string;
  type: TransactionType;
  status: TransactionStatus;
  grossAmount: number;
  transactionToken?: string;
  selfiePowId?: string | null;
  selfiePow?: SelfieProofOfWork | null;
  createdAt: string;
}

export interface SelfieProofOfWork {
  id: string;
  transactionId: string;
  imageStorageUrl: string;
  imageSha256Hash: string;
  gpsLatitude: number;
  gpsLongitude: number;
  gpsAccuracyMeters: number;
  pekonNameOverlay: string;
  isCameraDirect: boolean;
  createdAt: string;
}

export interface CreditScoreData {
  currentScore: string | number;
  grade: CreditGrade;
  breakdown: {
    jastipScore: number | string;
    minijobScore: number | string;
    hasilbumiScore: number | string;
    selfieScore: number | string;
    inklusiScore: number | string;
    calculatedAt: string;
  };
  loanRecommendation?: LoanRecommendation | null;
}

export interface LoanRecommendation {
  id: string;
  userId?: string;
  recommendedPlafond: number | string;
  status: 'ELIGIBLE_WAITING_BUMDES' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  createdAt: string;
  approvedAt?: string | null;
}

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
  package?: NutritionPackage;
  createdAt: string;
}
