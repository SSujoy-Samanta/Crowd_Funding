'use server';
import db from "@repo/db/db";
import { OTP_GEN } from "./genOtp";
import { sendEmail } from "./Mail";
import bcrypt from 'bcrypt';

export async function Otp(msg:string,email:string,exist:boolean,userId?:number):Promise<boolean> {
    const otp=OTP_GEN(4);
    const salt = await bcrypt.genSalt(10);
    const hashOtp = await bcrypt.hash(
        otp,
        salt,
    );
    if(userId && exist){
        const existingOtp = await db.otp.findFirst({
            where: {
                userId
            }
        });
        const expirationDuration = 5 * 60 * 1000; 
        if (existingOtp) {
            // Update the existing OTP record
            await db.otp.update({
                where: {
                    id: existingOtp.id
                },
                data: {
                    OTP:hashOtp,
                    created: new Date(),
                    expired: new Date(new Date().getTime() + expirationDuration), 
                    userId
                }
            });
        } else {
            // Create a new OTP record
            await db.otp.create({
                data: {
                    OTP:hashOtp,
                    created: new Date(),
                    expired: new Date(new Date().getTime() + expirationDuration),
                    userId
                }
            });
        }
    }else if(!exist){
        const existVerifiedEmail=await db.verifyEmail.findFirst({
            where:{email}
        })
        const expirationDuration = 5 * 60 * 1000; 
        if (existVerifiedEmail) {
            // Update the existing OTP record
            await db.verifyEmail.update({
                where: {
                    id: existVerifiedEmail.id
                },
                data: {
                    OTP:hashOtp,
                    expired: new Date(new Date().getTime() + expirationDuration), 
                }
            });
        } else {
            // Create a new OTP record
            await db.verifyEmail.create({
                data: {
                    OTP:hashOtp,
                    email,
                    expired: new Date(new Date().getTime() + expirationDuration),
                }
            });
        }
    }
    
    const success=await sendEmail(otp,email, `Web3FundMe: ${msg}`);
    if(!success){
        return false;
    }
    return true;
}