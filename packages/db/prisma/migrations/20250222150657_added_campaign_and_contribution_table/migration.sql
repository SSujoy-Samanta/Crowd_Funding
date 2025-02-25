-- CreateEnum
CREATE TYPE "VotingStatus" AS ENUM ('Pending', 'OnGoing', 'Completed');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "Goal" BIGINT NOT NULL,
    "deployedAddress" TEXT NOT NULL,
    "withdrawn" BOOLEAN NOT NULL DEFAULT false,
    "transactionHash" TEXT NOT NULL,
    "votingStatus" "VotingStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contributor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contributor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_walletAddress_key" ON "Campaign"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_transactionHash_key" ON "Campaign"("transactionHash");

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_transactionHash_key" ON "Contributor"("transactionHash");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contributor" ADD CONSTRAINT "Contributor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contributor" ADD CONSTRAINT "Contributor_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
