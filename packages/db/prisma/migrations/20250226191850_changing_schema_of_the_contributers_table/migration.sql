/*
  Warnings:

  - You are about to drop the column `userId` on the `Contributor` table. All the data in the column will be lost.
  - Made the column `walletAddress` on table `Contributor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contributor" DROP CONSTRAINT "Contributor_userId_fkey";

-- AlterTable
ALTER TABLE "Contributor" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT,
ALTER COLUMN "amount" SET DATA TYPE TEXT,
ALTER COLUMN "transactionHash" DROP NOT NULL,
ALTER COLUMN "walletAddress" SET NOT NULL;
