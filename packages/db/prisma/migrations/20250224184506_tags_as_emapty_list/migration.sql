/*
  Warnings:

  - You are about to drop the column `location` on the `CampaignMetadata` table. All the data in the column will be lost.
  - Added the required column `country` to the `CampaignMetadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `CampaignMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CampaignMetadata" DROP COLUMN "location",
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];
