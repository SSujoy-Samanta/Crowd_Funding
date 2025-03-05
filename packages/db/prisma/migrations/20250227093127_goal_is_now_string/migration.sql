/*
  Warnings:

  - You are about to alter the column `raised` on the `Campaign` table. The data in that column could be lost. The data in that column will be cast from `Decimal(78,18)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "raised" SET DEFAULT 0,
ALTER COLUMN "raised" SET DATA TYPE BIGINT,
ALTER COLUMN "Goal" SET DEFAULT '0.0',
ALTER COLUMN "Goal" SET DATA TYPE TEXT;
