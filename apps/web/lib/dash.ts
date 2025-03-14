
import { ethers } from "ethers";
import db from "@repo/db/db";
import { DashboardData } from "@/utils/dashboard";

export async function getUserCampaignData(userId: number):Promise<DashboardData> {
    try {
        const campaigns = await db.campaign.findMany({
            where: { userId },
            include: {
                metadata: true,
                contributors: true,
            },
        });

        if (!campaigns || campaigns.length === 0) {
            // Return default values if no campaigns exist
            return {
                activeCampaigns: 0,
                completedCampaigns: 0,
                totalRaised: "0",
                pendingWithdrawals: "0",
                campaigns: [],
            };
        }

        const transformedData = {
            
            activeCampaigns: campaigns.filter(c => c.votingStatus!=="Completed").length,
            completedCampaigns: campaigns.filter(c => c.votingStatus === "Completed").length,
            totalRaised: ethers.formatEther(
                campaigns
                .filter(c => c.withdrawn==true)
                .reduce((sum, campaign) => sum + BigInt(campaign.raised|| "0"), BigInt(0))
            ),
            pendingWithdrawals: ethers.formatEther(
                campaigns
                    .filter(c => c.VotingSuccess && !c.withdrawn)
                    .reduce((sum, campaign) => sum + BigInt(campaign.raised || "0"), BigInt(0))
            ),
            campaigns: campaigns.map(campaign => ({
                id: campaign.id,
                name: campaign.metadata?.title || "Unnamed Campaign",
                wallet: campaign.walletAddress || "N/A",
                contract: campaign.deployedAddress || "N/A",
                status: campaign.votingStatus === "Completed" ? campaign.VotingSuccess? "success" : "failed" : "pending",
                raised: ethers.formatEther(BigInt(campaign.raised || "0")),
                goal: ethers.formatEther(BigInt(campaign.Goal || "0")),
                votingStatus: campaign.votingStatus.toLowerCase(),
                VotingSuccess:campaign.VotingSuccess,
                totalVotes: campaign.contributors.filter(contributor => contributor.vote!=="pending").length,
                yesVote:campaign.contributors.filter(contributor => contributor.vote==="yes").length,
                noVote:campaign.contributors.filter(contributor => contributor.vote==="no").length,
                backers: campaign.contributors.length,
                category: campaign.metadata?.category || "Uncategorized",
                withdrawals: {
                    status:campaign.withdrawn?"completed":campaign.votingStatus==='Completed'&& campaign.VotingSuccess?"pending":"Not permitted",
                    amount:campaign.withdrawn? ethers.formatEther(BigInt(campaign.raised || "0")): "0",
                }
            })),
        };

        return transformedData;
    } catch (error) {
        console.log(error)
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