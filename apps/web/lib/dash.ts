import { ethers } from "ethers";
import db from "@repo/db/db";
import { DashboardData } from "@/utils/dashboard";
import { Campaign, Contributor, CampaignMetadata } from "@prisma/client";

// Define type with relations from Prisma
type CampaignWithRelations = Campaign & {
  metadata: CampaignMetadata | null;
  contributors: Contributor[];
};

export async function getUserCampaignData(userId: number): Promise<DashboardData> {
    try {
        const campaigns: CampaignWithRelations[] = await db.campaign.findMany({
            where: { userId },
            include: {
                metadata: true,
                contributors: true,
            },
        });

        if (!campaigns || campaigns.length === 0) {
            return {
                activeCampaigns: 0,
                completedCampaigns: 0,
                totalRaised: "0",
                pendingWithdrawals: "0",
                campaigns: [],
            };
        }

        const transformedData: DashboardData = {
            activeCampaigns: campaigns.filter((c: CampaignWithRelations) => c.votingStatus !== "Completed").length,

            completedCampaigns: campaigns.filter((c: CampaignWithRelations) => c.votingStatus === "Completed").length,

            totalRaised: ethers.formatEther(
                campaigns
                .filter((c: CampaignWithRelations) => c.withdrawn === true)
                .reduce((sum: bigint, c: CampaignWithRelations) => sum + BigInt(c.raised || "0"), BigInt(0))
            ),

            pendingWithdrawals: ethers.formatEther(
                campaigns
                .filter((c: CampaignWithRelations) => c.VotingSuccess && !c.withdrawn)
                .reduce((sum: bigint, c: CampaignWithRelations) => sum + BigInt(c.raised || "0"), BigInt(0))
            ),

            campaigns: campaigns.map((c: CampaignWithRelations) => ({
                id: c.id,
                name: c.metadata?.title || "Unnamed Campaign",
                wallet: c.walletAddress || "N/A",
                contract: c.deployedAddress || "N/A",
                status:
                c.votingStatus === "Completed"
                    ? c.VotingSuccess
                    ? "success"
                    : "failed"
                    : "pending",
                raised: ethers.formatEther(BigInt(c.raised || "0")),
                goal: ethers.formatEther(BigInt(c.Goal || "0")),
                votingStatus: c.votingStatus.toLowerCase(),
                VotingSuccess: c.VotingSuccess,
                totalVotes: c.contributors.filter((ctb) => ctb.vote !== "pending").length,
                yesVote: c.contributors.filter((ctb) => ctb.vote === "yes").length,
                noVote: c.contributors.filter((ctb) => ctb.vote === "no").length,
                backers: c.contributors.length,
                category: c.metadata?.category || "Uncategorized",
                withdrawals: {
                    status: c.withdrawn
                        ? "completed"
                        : c.votingStatus === "Completed" && c.VotingSuccess
                        ? "pending"
                        : "Not permitted",
                    amount: c.withdrawn ? ethers.formatEther(BigInt(c.raised || "0")) : "0",
                },
            })),
        };

        return transformedData;
    } catch (error) {
        console.error("Error fetching user campaign data:", error);
        return {
        activeCampaigns: 0,
        completedCampaigns: 0,
        totalRaised: "0",
        pendingWithdrawals: "0",
        campaigns: [],
        };
    }
}
