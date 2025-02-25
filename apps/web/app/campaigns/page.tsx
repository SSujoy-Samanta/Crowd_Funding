import { AllCampaigns } from "@/components/Campaign";
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
                        <p>No campaigns found.</p>
                    )}
                </div>
            );
        }

        // Validate and parse campaignId
        const campaignId = parseInt(searchParams.campaignId, 10);
        if (isNaN(campaignId)) {
            throw new Error("Invalid campaign ID.");
        }

        // Fetch single campaign
        const campaign = await db.campaign.findUnique({
            where: { id: campaignId },
        });

        if (!campaign) {
            throw new Error(`Campaign with ID ${campaignId} not found.`);
        }

        return (
            <div className="flex justify-center items-center min-h-screen w-full flex-col">
                <div className="border p-4 rounded-lg shadow-md">
                    <h1 className="text-xl font-bold">{campaign.walletAddress}</h1>
                    <p className="text-gray-700">ID: {campaign.id}</p>
                    <p className="text-gray-600">{campaign.deployedAddress}</p>
                </div>
            </div>
            
        );
    } catch (error) {
        return <div className="flex justify-center items-center min-h-screen w-full">
            <p className="text-red-500 p-1">Error: {error instanceof Error ? error.message : "Something went wrong."}</p>
        </div>;
    }
}
