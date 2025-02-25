import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import {  MetadataStep2Schema } from "@repo/common/zod";


export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        const validatedData = MetadataStep2Schema.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json(
                { msg: "Invalid input data", errors: validatedData.error.errors },
                { status: 400 }
            );
        }

        const { userId, metadataId, goal } = validatedData.data;

        const user = await db.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ msg: "This user does not exist." }, { status: 403 });
        }

        const metadata = await db.campaignMetadata.findUnique({
            where: { id: metadataId }
        });

        if (!metadata) {
            return NextResponse.json({ msg: "This Campaign does not exist." }, { status: 403 });
        }

        await db.campaignMetadata.update({
            where: { id: metadataId },
            data: { goal }
        });

        return NextResponse.json({ msg: "Step 2 data saved." }, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}