/*
  Warnings:

  - You are about to drop the column `campaignId` on the `CampaignMetadata` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[metadataId]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `metadataId` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CampaignMetadata" DROP CONSTRAINT "CampaignMetadata_campaignId_fkey";

-- DropIndex
DROP INDEX "CampaignMetadata_campaignId_key";

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "metadataId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CampaignMetadata" DROP COLUMN "campaignId";

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_metadataId_key" ON "Campaign"("metadataId");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "CampaignMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
