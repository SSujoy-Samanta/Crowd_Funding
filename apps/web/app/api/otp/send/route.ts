import { NextRequest, NextResponse } from "next/server";
import db from "@repo/db/db";
import { SentOtp } from "@repo/common/zod";
import { Otp } from "@/utils/otp";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
    
        const parseBody = SentOtp.safeParse(body);
        if (!parseBody.success) {
            return NextResponse.json(
                { msg: "Wrong Inputs", errors: parseBody.error.errors },
                { status: 411 },
            );
        }
        const { email, exist } = parseBody.data;
        let otpRes:boolean;

        if(exist){
            const user = await db.user.findUnique({
                where: { email },
                select: { id: true },
            });
    
            if (!user) {
                return NextResponse.json(
                    { msg: "User does not exist", otp: false },
                    { status: 404 }
                );
            }
            otpRes=await Otp("Email Verification",parseBody.data?.email,true,user.id);
           
        }else{
            otpRes=await Otp("Email Verification",parseBody.data?.email,false);
        }

        if(!otpRes){
            return NextResponse.json({ msg: "OTP Generation Failed.", otp:false }, { status: 500 });
        }
    
        return NextResponse.json({ msg: "OTP Generated; Check your inbox for verification email!.", otp:true }, { status: 200 });
    } catch (error) {
        console.error("Error occurred during signup:", error); 
        return NextResponse.json({ msg: "An error occurred" }, { status: 500 });
    }
}
