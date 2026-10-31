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
}

export interface Wallet {
  id: string;
  userId: string;
  pointsBalance: number;
  cashBalance: number;
  version: number;
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
  integritySignature: string;
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
  farmer?: User;
  pekon?: Pekon;
  bids?: HarvestBid[];
  createdAt: string;
}

export interface HarvestBid {
  id: string;
  listingId: string;
  collectorId: string;
  offeredPricePerKg: number;
  isAccepted: boolean;
  referralUsedCode?: string | null;
  collector?: User;
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
  currentLat?: number | null;
  currentLng?: number | null;
  isActive: boolean;
  startedAt: string;
  endedAt?: string | null;
  commuter?: User;
  orders?: JastipOrder[];
}

export interface JastipOrder {
  id: string;
  routeId: string;
  requesterId: string;
  itemDescription: string;
  fuelShareCost: number;
  pickupLat: number;
  pickupLng: number;
  status: string;
  requester?: User;
  createdAt: string;
}

export interface MiniJob {
  id: string;
  employerId: string;
  workerId?: string | null;
  title: string;
  description: string;
  wageAmount: number;
  isDisabilityFriendly: boolean;
  autoAcceptLock: boolean;
  status: MiniJobStatus;
  version: number;
  lockedAt?: string | null;
  employer?: User;
  worker?: User | null;
  createdAt: string;
}

export interface UnifiedTransaction {
  id: string;
  idempotencyKey: string;
  transactionToken: string;
  type: TransactionType;
  referenceEntityId: string;
  initiatorId: string;
  counterpartyId: string;
  grossAmount: number;
  status: TransactionStatus;
  completedAt?: string | null;
  initiator?: User;
  counterparty?: User;
  selfiePoW?: SelfieProofOfWork | null;
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
  serverTimestamp: string;
  isCameraDirect: boolean;
  validityScore: number;
}

export interface CreditScoreSnapshot {
  id: string;
  userId: string;
  triggerTxId?: string | null;
  nJastipScore: number;
  nMinijobScore: number;
  nHasilbumiScore: number;
  vSelfieScore: number;
  iInklusiScore: number;
  totalSkredit: number;
  grade: CreditGrade;
  createdAt: string;
}

export interface LoanRecommendation {
  id: string;
  userId: string;
  scoreAtApproval: number;
  recommendedPlafond: number;
  status: 'ELIGIBLE_WAITING_BUMDES' | 'APPROVED' | 'DISBURSED';
  approvedByBumdesId?: string | null;
  approvedAt?: string | null;
}

export interface NutritionPackage {
  id: string;
  pekonId: string;
  packageName: string;
  pointsCost: number;
  stockCount: number;
}

export interface NutritionRedemption {
  id: string;
  userId: string;
  packageId: string;
  pointsSpent: number;
  status: string;
  redeemedAt: string;
  package?: NutritionPackage;
}
