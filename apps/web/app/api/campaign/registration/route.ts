import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import { MetadataStep1Schema } from "@repo/common/zod";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validatedData = MetadataStep1Schema.safeParse(body);
        
        if (!validatedData.success) {
            return NextResponse.json(
                { msg: "Invalid input data", errors: validatedData.error.errors },
                { status: 400 }
            );
        }

        const { userId, country, state, category,metadataId } = validatedData.data;

        const user = await db.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ msg: "This user does not exist." }, { status: 403 });
        }

        if(!metadataId){
            const metadata = await db.campaignMetadata.create({
                data: {
                    userId,
                    category,
                    country,
                    state,
                    title: `Metadata of user id ${userId}`,
                    description: `Description of user id ${userId}`
                }
            });

            return NextResponse.json({ msg: "Step 1 data saved", metadataId: metadata.id }, { status: 200 });
        }else{
            await db.campaignMetadata.update({
                where:{
                    id:metadataId
                },
                data: {
                    category,
                    country,
                    state,
                }
            })
            return NextResponse.json({ msg: "Step 1 data updated"}, { status: 200 });
        }
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

