import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import { CommentSchema } from "@repo/common/zod";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validatedData = CommentSchema.safeParse(body);
        
        if (!validatedData.success) {
            return NextResponse.json(
                { msg: "Invalid input data", errors: validatedData.error.errors },
                { status: 400 }
            );
        }

        const { walletAddress,comment,id } = validatedData.data;

        const campaign=await db.campaign.findUnique({
            where:{
                id
            }
        })

        if (!campaign) {
            return NextResponse.json({ msg: "This campaign does not exist." }, { status: 403 });
        }

        await db.comments.create({
            data:{
                campaignId:campaign.id,
                wallet:walletAddress,
                comment:comment
            }
        })
        return NextResponse.json({ msg: "Comment Succesfull." }, { status: 200 });
       
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

