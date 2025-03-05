/*
  Warnings:

  - The `amount` column on the `Contributor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Contributor" DROP COLUMN "amount",
ADD COLUMN     "amount" BIGINT NOT NULL DEFAULT 0;
