import { ForgetPasswordSchema } from "@repo/common/zod";
import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import bcrypt from "bcrypt";

export async function PUT(req: NextRequest) {
    try {
        // Parse and validate request body
        const body = await req.json();
        const parseBody = ForgetPasswordSchema.safeParse(body);

        if (!parseBody.success) {
            return NextResponse.json(
                { msg: "Invalid input data", errors: parseBody.error.errors },
                { status: 400 }
            );
        }

        const { email, password, otp } = parseBody.data;

        // Find the user
        const user = await db.user.findUnique({
            where: { 
                email,
                verified:true
            },
            select:{
                otp:true,
                id:true
            }
        });

        if (!user || !user.otp) {
            return NextResponse.json({ msg: "This user does not exist or has no OTP" }, { status: 403 });
        }
        const currentTime = new Date();
        const otpExpiryTime = new Date(user.otp.expired); 

        // Check if OTP is expired
        if (currentTime > otpExpiryTime) {
            return NextResponse.json({ msg: "OTP Expired" }, { status: 410 });
        }

        // Compare the entered OTP with the stored hashed OTP
        const isOtpValid = await bcrypt.compare(otp, user.otp.OTP);
        if (!isOtpValid) {
            return NextResponse.json({ msg: "Invalid OTP" }, { status: 401 });
        }
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password
        await db.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }, // Fix: Store the hashed password
        });

        return NextResponse.json({ msg: "Password reset successful" }, { status: 200 });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
    }
}
