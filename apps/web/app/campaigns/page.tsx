import { AllCampaigns } from "@/components/Campaign";
import { FundraiserCard } from "@/components/Campaign/view/CampaignView";

import db from "@repo/db/db";

export default async function Campaigns({
    searchParams,
}: {
    searchParams?: { campaignId?: string };
}) {
    try {
        if (!searchParams?.campaignId) {
            // Fetch all campaigns if no campaignId is provided
            const campaigns = await db.campaign.findMany({
                select:{
                    id:true,
                    Goal:true,
                    user:{
                        select:{
                            username:true,
                        }
                    },
                    raised:true,
                    metadata:{
                        select:{
                            title:true,
                            goal:true,
                            category:true,
                            country:true,
                            state:true,
                            tags:true,
                            imageUrl:true
                        }
                    }
                }
            });
            return (
                <div className="flex min-h-screen w-full flex-col pt-28 ">

                    {campaigns.length > 0 ? (
                        <AllCampaigns campaigns={campaigns}/>
                    ) : (
                        <div className="flex justify-center items-center  w-full text-xl font-bold">
                            <p>No campaigns found.</p>
                        </div>
                    )}
                </div>
            );
        }

        // Validate and parse campaignId
        const campaignId = parseInt(searchParams.campaignId, 10);
        if (isNaN(campaignId)) {
            throw new Error("Invalid campaign ID.");
        }

        //Fetch single campaign
        const campaign = await db.campaign.findUnique({
            where: { id: campaignId },
            select:{
                id:true,
                user:{
                    select:{
                        username:true
                    }
                },
                walletAddress:true,
                Goal: true,
                deployedAddress: true,
                transactionHash: true,
                raised:true,
                metadata:{
                    select:{
                        title: true,
                        description: true,
                        category: true,
                        goal: true,
                        imageUrl:true,
                        country:true,
                        state:true,
                    }
                },
                contributors:{
                    select:{
                        amount:true,
                        walletAddress:true,
                        timestamp:true
                    },
                    orderBy:{
                        timestamp:"desc"
                    }
                },
                comments:{
                    select:{
                        wallet:true,
                        timestamp:true,
                        comment:true
                    },
                    orderBy:{
                        timestamp:"desc"
                    }
                }
            }
        });

        if (!campaign) {
            throw new Error(`Campaign with ID ${campaignId} not found.`);
        }

        return (
            <FundraiserCard campaign={campaign}/> 
        );
    } catch (error) {
        return <div className="flex justify-center items-center min-h-screen w-full">
            <p className="text-red-500 p-1">Error: {error instanceof Error ? error.message : "Something went wrong."}</p>
        </div>;
    }
}
