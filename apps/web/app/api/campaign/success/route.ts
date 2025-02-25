import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import { CampaignSchema } from "@repo/common/zod";

export async function POST(req: NextRequest) {
    try {
        const body=await req.json();
        const parseBody=CampaignSchema.safeParse(body);
        if(!parseBody.success){
            return NextResponse.json(
                { msg: "Invalid input data", errors: parseBody.error.errors },
                { status: 400 }
            );
        }
        const {userId,transactionHash,metadataId,tags}=parseBody.data;

        const user=await db.user.findUnique({
            where:{id:userId}
        })
        if (!user) {
            return NextResponse.json({ msg: "This user does not exist." }, { status: 403 });
        }
        const metadata=await db.campaignMetadata.findUnique({
            where:{
                id:metadataId
            }
        })
        if(!metadata){
            return NextResponse.json({ msg: "There is no metadata of the campaign." }, { status: 403 });
        }
        await db.campaignMetadata.update({
            where:{
                id:metadataId
            },
            data:{
                tags
            }
        })
        const Campaign=await db.campaign.findUnique({
            where:{
                transactionHash
            }
        })
        if(Campaign){
            return NextResponse.json({ msg: "This Campaign(Transaction) Already exist." }, { status: 403 });
        }
        const newCampaign=await db.campaign.create({
            data:{
                userId:user.id,
                transactionHash,
                metadataId
            }
        })
        
        return NextResponse.json({ msg: "Campaigning successful.",campaignId:newCampaign.id }, { status: 200 });
    } catch (error:any) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
    }
}