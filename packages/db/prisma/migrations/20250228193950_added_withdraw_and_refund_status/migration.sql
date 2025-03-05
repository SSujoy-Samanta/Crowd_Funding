-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "refundStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "withDrawStatus" BOOLEAN NOT NULL DEFAULT false;
