import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import { ContributorsEmailSchema } from "@repo/common/zod";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validatedData = ContributorsEmailSchema.safeParse(body);
        
        if (!validatedData.success) {
            return NextResponse.json(
                { msg: "Invalid input data", errors: validatedData.error.errors },
                { status: 400 }
            );
        }

        const { walletAddress,email,contractAddress } = validatedData.data;

        const campaign=await db.campaign.findUnique({
            where:{
                deployedAddress:contractAddress
            }
        })

        if (!campaign) {
            return NextResponse.json({ msg: "This campaign does not exist." }, { status: 403 });
        }

        const contributor=await db.contributor.findFirst({
            where:{
                campaignId:campaign.id,
                walletAddress,
            }
        })

        if(!contributor){
            await db.contributor.create({
                data: {
                    campaignId:campaign.id,
                    walletAddress,
                    email
                }
            });

            return NextResponse.json({ msg: "Email subscribed.", }, { status: 200 });
        }else{
            await db.contributor.update({
                where:{
                    id:contributor.id
                },
                data: {
                    email    
                }
            })
            return NextResponse.json({ msg:"Email subscribed."}, { status: 200 });
        }
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

