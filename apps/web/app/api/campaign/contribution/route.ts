import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const walletAddress = searchParams.get("walletAddress");

        if (!walletAddress) {
            return NextResponse.json(
                { msg: "Missing wallet address" },
                { status: 400 }
            );
        }

        // Fetch all contributions for the given walletAddress
        const contributions = await db.contributor.findMany({
            where: {
                walletAddress,
            },
            select: {
                campaign: {
                    select: {
                        metadata: {
                            select: {
                                title: true,
                            }
                        },
                        votingStatus: true,
                        withdrawn: true,
                        deployedAddress:true,
                        VotingSuccess:true
                    }
                },
                campaignId: true,
                amount: true,
                vote: true,
                refunded: true,
                timestamp: true,
                
            }
        });

        // If no contributions found, return a message
        if (contributions.length === 0) {
            return NextResponse.json({ msg: "You haven't contributed yet." }, { status: 404 });
        }

        // Calculate total amount contributed and number of contributions
        const totalAmount = contributions.reduce((sum:bigint, contribution) => sum + BigInt(contribution.amount), BigInt(0));
        const totalContributions = contributions.length;

        // Count votes in different states
        const ongoingVotes = contributions.filter(contribution => contribution.campaign.votingStatus === "OnGoing").length;
        const pendingVotes = contributions.filter(contribution => contribution.campaign.votingStatus === "Pending").length;
        const refundedCampaigns = contributions.filter(contribution => contribution.refunded === true).length;

        const responseObject = {
            totalAmount: totalAmount.toString(),
            totalContributions,
            ongoingVotes,
            pendingVotes,
            refundedCampaigns,
            contributions
        };

        return NextResponse.json(responseObject, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
