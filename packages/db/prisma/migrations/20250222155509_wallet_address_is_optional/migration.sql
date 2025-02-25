/*
  Warnings:

  - A unique constraint covering the columns `[deployedAddress]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Campaign_walletAddress_key";

-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "walletAddress" DROP NOT NULL,
ALTER COLUMN "Goal" DROP NOT NULL,
ALTER COLUMN "deployedAddress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Contributor" ADD COLUMN     "walletAddress" TEXT,
ALTER COLUMN "amount" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_deployedAddress_key" ON "Campaign"("deployedAddress");
