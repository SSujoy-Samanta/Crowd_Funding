/*
  Warnings:

  - The `transactionHash` column on the `Contributor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Contributor_transactionHash_key";

-- AlterTable
ALTER TABLE "Contributor" DROP COLUMN "transactionHash",
ADD COLUMN     "transactionHash" TEXT[] DEFAULT ARRAY[]::TEXT[];
