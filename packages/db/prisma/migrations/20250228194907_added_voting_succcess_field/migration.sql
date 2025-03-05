/*
  Warnings:

  - You are about to drop the column `refundStatus` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `withDrawStatus` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "refundStatus",
DROP COLUMN "withDrawStatus",
ADD COLUMN     "VotingSuccess" BOOLEAN NOT NULL DEFAULT false;
