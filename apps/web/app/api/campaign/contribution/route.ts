import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";

interface Contribution {
    amount: string;
    campaignId: number;
    vote: string;
    refunded: boolean;
    timestamp: Date;
    campaign: {
        metadata: {
            title: string;
        };
        withdrawn: boolean;
        votingStatus: string;
        deployedAddress: string | null; // <- updated here
        VotingSuccess: boolean;
    };
}

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
        const contributions: Contribution[] = await db.contributor.findMany({
            where: {
                walletAddress,
            },
            select: {
                campaign: {
                    select: {
                        metadata: {
                            select: {
                                title: true,
                            },
                        },
                        votingStatus: true,
                        withdrawn: true,
                        deployedAddress: true,
                        VotingSuccess: true,
                    },
                },
                campaignId: true,
                amount: true,
                vote: true,
                refunded: true,
                timestamp: true,
            },
        });

        if (contributions.length === 0) {
            return NextResponse.json({ msg: "You haven't contributed yet." }, { status: 404 });
        }

        // Correct typings here 👇
        const totalAmount = contributions.reduce(
            (sum: bigint, contribution: Contribution) => sum + BigInt(contribution.amount),
            BigInt(0)
        );
        const totalContributions = contributions.length;

        const ongoingVotes = contributions.filter((contribution: Contribution) =>
            contribution.campaign.votingStatus === "OnGoing"
        ).length;

        const pendingVotes = contributions.filter((contribution: Contribution) =>
            contribution.campaign.votingStatus === "Pending"
        ).length;

        const refundedCampaigns = contributions.filter((contribution: Contribution) =>
            contribution.refunded === true
        ).length;

        const responseObject = {
            totalAmount: totalAmount.toString(),
            totalContributions,
            ongoingVotes,
            pendingVotes,
            refundedCampaigns,
            contributions,
        };

        return NextResponse.json(responseObject, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
