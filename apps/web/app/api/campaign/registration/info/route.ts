import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import {  MetadataStep3Schema } from "@repo/common/zod";
import { uploadImage } from "@/lib/cloudinary/upload";

export async function PUT(req: NextRequest) {
    try {
        const formData = await req.formData(); // Extract form data (Supports image)
        const userId = Number(formData.get("userId"));
        const metadataId = Number(formData.get("metadataId"));
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const image = formData.get("image") as File | null;

        // Validate Text Data
        const validatedData = MetadataStep3Schema.safeParse({  userId, metadataId, title, description });
        if (!validatedData.success) {
            return NextResponse.json({ error: "Invalid input data", details: validatedData.error.errors }, { status: 400 });
        }

        // Validate Image
        if (!image) {
            return NextResponse.json({ error: "Image file is required" }, { status: 400 });
        }
        if (!image.type.startsWith("image/")) {
            return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
        }

        let imageUrl: string | null = null;
        let data: any = null;
    
        // If there is an image, upload it to Cloudinary
        if (image) {
            try {
                data = await uploadImage(image, "Fund_Raise");
            } catch (uploadError:any) {
                console.error("Image upload failed:", uploadError);
                return NextResponse.json({ msg: "Image upload failed" }, { status: 500 });
            }
        }
    
        // Check if the image upload was successful and assign the URL
        if (data) {
          imageUrl = data.secure_url;
        }

        // Save Data to Database
        await db.campaignMetadata.update({
            where: { id: metadataId },
            data: { title, description, imageUrl },
        });

        return NextResponse.json({ msg: "Step 3 data saved" }, { status: 200 });
    
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}