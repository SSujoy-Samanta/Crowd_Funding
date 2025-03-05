-- AlterTable
ALTER TABLE "Contributor" ADD COLUMN     "refunded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vote" BOOLEAN NOT NULL DEFAULT false;
