import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import bcrypt from "bcrypt";
import { changePasswordSchema } from "@repo/common/zod";

export async function PUT(req: NextRequest) {
    try {
        // Parse and validate request body
        const body = await req.json();
        const parseBody = changePasswordSchema.safeParse(body);

        if (!parseBody.success) {
            return NextResponse.json(
                { msg: "Invalid input data", errors: parseBody.error.errors },
                { status: 400 }
            );
        }

        const { userId, password } = parseBody.data;

        // Find the user
        const user = await db.user.findUnique({
            where: { 
                id:userId
            }
        });

        if (!user) {
            return NextResponse.json({ msg: "This user does not exist." }, { status: 403 });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password
        await db.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }, // Fix: Store the hashed password
        });

        return NextResponse.json({ msg: "Successfully updated password." }, { status: 200 });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
    }
}
