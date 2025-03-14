-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "raised" SET DEFAULT '0',
ALTER COLUMN "Goal" SET DEFAULT '0';

-- AlterTable
ALTER TABLE "CampaignMetadata" ALTER COLUMN "goal" SET DEFAULT '0';

-- AlterTable
ALTER TABLE "Contributor" ALTER COLUMN "amount" SET DEFAULT '0';
