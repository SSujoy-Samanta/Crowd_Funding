/*
  Warnings:

  - The `vote` column on the `Contributor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Vote" AS ENUM ('pending', 'yes', 'no');

-- AlterTable
ALTER TABLE "Contributor" DROP COLUMN "vote",
ADD COLUMN     "vote" "Vote" NOT NULL DEFAULT 'pending';
