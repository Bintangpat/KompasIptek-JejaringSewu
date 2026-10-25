-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('WARGA', 'PENGEPUL', 'UMKM', 'ADMIN_BUMDES', 'ADMIN_BAPPERIDA', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "VulnerabilityStatus" AS ENUM ('NONE', 'DISABILITAS_FISIK', 'DISABILITAS_SENSORIK_NETRA', 'DISABILITAS_RUNGU_WICARA', 'LANSIA', 'PEKKA_IBU_RUMAH_TANGGA', 'KELUARGA_RISIKO_STUNTING');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('HARVEST_DEAL', 'NEBENG_JASTIP', 'MINI_JOB', 'NUTRITION_REDEEM');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('INITIATED', 'LOCKED_ASSIGNED', 'IN_PROGRESS', 'AWAITING_SELFIE_POW', 'VERIFIED_COMPLETED', 'DISPUTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CreditGrade" AS ENUM ('GRADE_A_LAYAK_MODAL', 'GRADE_B_PEMBINAAN', 'GRADE_C_AWAL');

-- CreateTable
CREATE TABLE "Pekon" (
    "id" UUID NOT NULL,
    "kodeKemendagri" TEXT NOT NULL,
    "namaPekon" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "namaBumdes" TEXT,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pekon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "nikHash" TEXT NOT NULL,
    "nikEncrypted" TEXT NOT NULL,
    "isNikVerified" BOOLEAN NOT NULL DEFAULT false,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'WARGA',
    "vulnerabilityFlags" "VulnerabilityStatus"[],
    "hasToddler" BOOLEAN NOT NULL DEFAULT false,
    "fcmToken" TEXT,
    "referralCode" TEXT NOT NULL,
    "isTrustedCollector" BOOLEAN NOT NULL DEFAULT false,
    "employerInclusionCount" INTEGER NOT NULL DEFAULT 0,
    "pekonId" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "tokenFamily" UUID NOT NULL,
    "deviceId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "pointsBalance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "cashBalance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" UUID NOT NULL,
    "walletId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "entryType" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "balanceBefore" DECIMAL(18,2) NOT NULL,
    "balanceAfter" DECIMAL(18,2) NOT NULL,
    "integritySignature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarvestListing" (
    "id" UUID NOT NULL,
    "farmerId" UUID NOT NULL,
    "pekonId" UUID NOT NULL,
    "commodityName" TEXT NOT NULL,
    "estimatedKg" DECIMAL(10,2) NOT NULL,
    "minPricePerKg" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN_BIDDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HarvestListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HarvestBid" (
    "id" UUID NOT NULL,
    "listingId" UUID NOT NULL,
    "collectorId" UUID NOT NULL,
    "offeredPricePerKg" DECIMAL(12,2) NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "referralUsedCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HarvestBid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectorReferral" (
    "id" UUID NOT NULL,
    "referrerId" UUID NOT NULL,
    "collectorId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "microCommission" DECIMAL(12,2) NOT NULL,
    "reputationPoints" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectorReferral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommuterRoute" (
    "id" UUID NOT NULL,
    "commuterId" UUID NOT NULL,
    "originName" TEXT NOT NULL,
    "destinationName" TEXT NOT NULL,
    "originLat" DECIMAL(10,8) NOT NULL,
    "originLng" DECIMAL(11,8) NOT NULL,
    "destLat" DECIMAL(10,8) NOT NULL,
    "destLng" DECIMAL(11,8) NOT NULL,
    "currentLat" DECIMAL(10,8),
    "currentLng" DECIMAL(11,8),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "CommuterRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JastipOrder" (
    "id" UUID NOT NULL,
    "routeId" UUID NOT NULL,
    "requesterId" UUID NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "fuelShareCost" DECIMAL(12,2) NOT NULL,
    "pickupLat" DECIMAL(10,8) NOT NULL,
    "pickupLng" DECIMAL(11,8) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JastipOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiniJob" (
    "id" UUID NOT NULL,
    "employerId" UUID NOT NULL,
    "workerId" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "wageAmount" DECIMAL(12,2) NOT NULL,
    "isDisabilityFriendly" BOOLEAN NOT NULL DEFAULT false,
    "autoAcceptLock" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),

    CONSTRAINT "MiniJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnifiedTransaction" (
    "id" UUID NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "transactionToken" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "referenceEntityId" UUID NOT NULL,
    "initiatorId" UUID NOT NULL,
    "counterpartyId" UUID NOT NULL,
    "grossAmount" DECIMAL(18,2) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'INITIATED',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "UnifiedTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfieProofOfWork" (
    "id" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "imageStorageUrl" TEXT NOT NULL,
    "imageSha256Hash" TEXT NOT NULL,
    "gpsLatitude" DECIMAL(10,8) NOT NULL,
    "gpsLongitude" DECIMAL(11,8) NOT NULL,
    "gpsAccuracyMeters" DECIMAL(6,2) NOT NULL,
    "pekonNameOverlay" TEXT NOT NULL,
    "serverTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCameraDirect" BOOLEAN NOT NULL DEFAULT true,
    "validityScore" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "SelfieProofOfWork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditScoreSnapshot" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "triggerTxId" UUID NOT NULL,
    "nJastipScore" DECIMAL(5,2) NOT NULL,
    "nMinijobScore" DECIMAL(5,2) NOT NULL,
    "nHasilbumiScore" DECIMAL(5,2) NOT NULL,
    "vSelfieScore" DECIMAL(5,2) NOT NULL,
    "iInklusiScore" DECIMAL(5,2) NOT NULL,
    "totalSkredit" DECIMAL(5,2) NOT NULL,
    "grade" "CreditGrade" NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditScoreSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanRecommendation" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "scoreAtApproval" DECIMAL(5,2) NOT NULL,
    "recommendedPlafond" DECIMAL(15,2) NOT NULL DEFAULT 1500000,
    "status" TEXT NOT NULL DEFAULT 'ELIGIBLE_WAITING_BUMDES',
    "approvedByBumdesId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "LoanRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionPackage" (
    "id" UUID NOT NULL,
    "pekonId" UUID NOT NULL,
    "packageName" TEXT NOT NULL,
    "pointsCost" DECIMAL(10,2) NOT NULL,
    "stockCount" INTEGER NOT NULL,

    CONSTRAINT "NutritionPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionRedemption" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "packageId" UUID NOT NULL,
    "pointsSpent" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CLAIMED',
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NutritionRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pekon_kodeKemendagri_key" ON "Pekon"("kodeKemendagri");

-- CreateIndex
CREATE UNIQUE INDEX "User_nikHash_key" ON "User"("nikHash");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "User_pekonId_role_idx" ON "User"("pekonId", "role");

-- CreateIndex
CREATE INDEX "User_phoneNumber_idx" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_refreshTokenHash_key" ON "UserSession"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "UserSession_userId_isRevoked_idx" ON "UserSession"("userId", "isRevoked");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE INDEX "LedgerEntry_walletId_createdAt_idx" ON "LedgerEntry"("walletId", "createdAt");

-- CreateIndex
CREATE INDEX "HarvestListing_pekonId_status_commodityName_idx" ON "HarvestListing"("pekonId", "status", "commodityName");

-- CreateIndex
CREATE UNIQUE INDEX "CollectorReferral_transactionId_key" ON "CollectorReferral"("transactionId");

-- CreateIndex
CREATE INDEX "CommuterRoute_isActive_originLat_originLng_idx" ON "CommuterRoute"("isActive", "originLat", "originLng");

-- CreateIndex
CREATE INDEX "MiniJob_status_isDisabilityFriendly_idx" ON "MiniJob"("status", "isDisabilityFriendly");

-- CreateIndex
CREATE UNIQUE INDEX "UnifiedTransaction_idempotencyKey_key" ON "UnifiedTransaction"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "UnifiedTransaction_transactionToken_key" ON "UnifiedTransaction"("transactionToken");

-- CreateIndex
CREATE INDEX "UnifiedTransaction_initiatorId_status_idx" ON "UnifiedTransaction"("initiatorId", "status");

-- CreateIndex
CREATE INDEX "UnifiedTransaction_counterpartyId_status_idx" ON "UnifiedTransaction"("counterpartyId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "SelfieProofOfWork_transactionId_key" ON "SelfieProofOfWork"("transactionId");

-- CreateIndex
CREATE INDEX "CreditScoreSnapshot_userId_calculatedAt_idx" ON "CreditScoreSnapshot"("userId", "calculatedAt" DESC);

-- CreateIndex
CREATE INDEX "OutboxEvent_status_createdAt_idx" ON "OutboxEvent"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pekonId_fkey" FOREIGN KEY ("pekonId") REFERENCES "Pekon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "UnifiedTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestListing" ADD CONSTRAINT "HarvestListing_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestListing" ADD CONSTRAINT "HarvestListing_pekonId_fkey" FOREIGN KEY ("pekonId") REFERENCES "Pekon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestBid" ADD CONSTRAINT "HarvestBid_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "HarvestListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HarvestBid" ADD CONSTRAINT "HarvestBid_collectorId_fkey" FOREIGN KEY ("collectorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectorReferral" ADD CONSTRAINT "CollectorReferral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectorReferral" ADD CONSTRAINT "CollectorReferral_collectorId_fkey" FOREIGN KEY ("collectorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectorReferral" ADD CONSTRAINT "CollectorReferral_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "UnifiedTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommuterRoute" ADD CONSTRAINT "CommuterRoute_commuterId_fkey" FOREIGN KEY ("commuterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JastipOrder" ADD CONSTRAINT "JastipOrder_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "CommuterRoute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JastipOrder" ADD CONSTRAINT "JastipOrder_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniJob" ADD CONSTRAINT "MiniJob_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniJob" ADD CONSTRAINT "MiniJob_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnifiedTransaction" ADD CONSTRAINT "UnifiedTransaction_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnifiedTransaction" ADD CONSTRAINT "UnifiedTransaction_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfieProofOfWork" ADD CONSTRAINT "SelfieProofOfWork_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "UnifiedTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditScoreSnapshot" ADD CONSTRAINT "CreditScoreSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanRecommendation" ADD CONSTRAINT "LoanRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionPackage" ADD CONSTRAINT "NutritionPackage_pekonId_fkey" FOREIGN KEY ("pekonId") REFERENCES "Pekon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionRedemption" ADD CONSTRAINT "NutritionRedemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionRedemption" ADD CONSTRAINT "NutritionRedemption_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "NutritionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
