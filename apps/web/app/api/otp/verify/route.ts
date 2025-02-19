import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import bcrypt from "bcrypt";
import { VerifyOtpSchema } from "@repo/common/zod";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parseBody=VerifyOtpSchema.safeParse(body);
        if (!parseBody.success) {
            return NextResponse.json(
                { msg: "Wrong Inputs", errors: parseBody.error.errors },
                { status: 411 },
            );
        }
        const { email, otp, exist } = parseBody.data;

        if(exist){
            // Find user with the provided email for existing user
            const user = await db.user.findUnique({
                where: { email },
                include: { otp: true }, 
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
            
        }else{
            // Find user with the provided email for non existing user
            const user = await db.verifyEmail.findUnique({
                where: { email }, 
            });

            if (!user || !user.OTP) {
                return NextResponse.json({ msg: "This user does not exist or has no OTP" }, { status: 403 });
            }
            const currentTime = new Date();
            const otpExpiryTime = new Date(user.expired); 

            // Check if OTP is expired
            if (currentTime > otpExpiryTime) {
                return NextResponse.json({ msg: "OTP Expired" }, { status: 410 });
            }

            // Compare the entered OTP with the stored hashed OTP
            const isOtpValid = await bcrypt.compare(otp, user.OTP);
            if (!isOtpValid) {
                return NextResponse.json({ msg: "Invalid OTP" }, { status: 401 });
            }
            await db.verifyEmail.update({
                where:{
                    id:user.id
                },
                data:{
                    verified:true
                }
            })
        }

        // OTP verification successful
        return NextResponse.json({ msg: "OTP Verification Successfully", verified:true }, { status: 200 });
    } catch (error) {
        console.error("Error in OTP verification:", error);
        return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
    }
}
