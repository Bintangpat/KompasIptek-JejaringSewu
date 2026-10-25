export type UserRole =
  | "WARGA"
  | "PENGUMPUL_JUJUR"
  | "UMKM"
  | "ADMIN_BUMDES"
  | "ADMIN_BAPPERIDA"
  | "SUPER_ADMIN";

export type VulnerabilityFlag =
  | "NONE"
  | "DISABILITAS_FISIK"
  | "DISABILITAS_SENSORIK"
  | "LANSIA_PRODUKTIF"
  | "KELUARGA_PRA_SEJAHTERA";

export interface Pekon {
  id: string;
  namaPekon: string;
  kecamatan: string;
  kabupaten: string;
  latitude: number;
  longitude: number;
  namaBumdes?: string;
}

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
  pekon?: Pekon;
  wallet?: {
    pointsBalance: string | number;
    cashBalance: string | number;
  };
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

export interface CreditScoreDetail {
  id: string;
  userId: string;
  score: number;
  grade: "GRADE_A_LAYAK_MODAL" | "GRADE_B_PEMBINAAN" | "GRADE_C_AWAL";
  details: {
    jastipScore: number;
    miniJobScore: number;
    harvestScore: number;
    selfiePoWScore: number;
    inclusionScore: number;
  };
  createdAt: string;
}

export interface LoanRecommendation {
  id: string;
  userId: string;
  user?: {
    id: string;
    fullName: string;
    phoneNumber: string;
    vulnerabilityFlags: VulnerabilityFlag[];
    pekon?: Pekon;
  };
  recommendedPlafond: number | string;
  approvedPlafond?: number | string | null;
  status: "ELIGIBLE_WAITING_BUMDES" | "APPROVED" | "DISBURSED" | "REJECTED";
  approvedByBumdesId?: string | null;
  approvedAt?: string | null;
  creditScoreSnapshot?: number;
  notes?: string | null;
  createdAt: string;
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
  user?: {
    fullName: string;
    phoneNumber: string;
  };
  package?: {
    packageName: string;
  };
  createdAt: string;
}
