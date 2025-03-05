/*
  Warnings:

  - The `Goal` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `raised` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `goal` on table `CampaignMetadata` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "Goal",
ADD COLUMN     "Goal" BIGINT NOT NULL DEFAULT 0,
ALTER COLUMN "raised" SET NOT NULL;

-- AlterTable
ALTER TABLE "CampaignMetadata" ALTER COLUMN "goal" SET NOT NULL,
ALTER COLUMN "goal" SET DEFAULT '';
