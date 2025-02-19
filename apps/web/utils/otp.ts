'use server';
import db from "@repo/db/db";
import { OTP_GEN } from "./genOtp";
import { sendEmail } from "./Mail";
import bcrypt from 'bcrypt';

export async function Otp(msg: string, email: string, exist: boolean, userId?: number): Promise<boolean> {
    try {
        const otp = OTP_GEN(4);
        const salt = await bcrypt.genSalt(10);
        const hashOtp = await bcrypt.hash(otp, salt);
        const expirationDuration = 5 * 60 * 1000; // 5 minutes

        if (exist && userId) {
            // Check if OTP already exists for the user
            const existingOtp = await db.otp.findUnique({ where: { userId } });

            if (existingOtp) {
                await db.otp.update({
                    where: { id: existingOtp.id },
                    data: {
                        OTP: hashOtp,
                        created: new Date(),
                        expired: new Date(Date.now() + expirationDuration),
                    }
                });
            } else {
                await db.otp.create({
                    data: {
                        OTP: hashOtp,
                        created: new Date(),
                        expired: new Date(Date.now() + expirationDuration),
                        userId
                    }
                });
            }
        } else if (!exist) {
            // Check if email verification OTP exists
            const existingVerifiedEmail = await db.verifyEmail.findUnique({ where: { email } });

            if (existingVerifiedEmail) {
                await db.verifyEmail.update({
                    where: { id: existingVerifiedEmail.id },
                    data: {
                        OTP: hashOtp,
                        expired: new Date(Date.now() + expirationDuration),
                    }
                });
            } else {
                await db.verifyEmail.create({
                    data: {
                        OTP: hashOtp,
                        email,
                        expired: new Date(Date.now() + expirationDuration),
                    }
                });
            }
        }

        // Send OTP via email
        const success = await sendEmail(otp, email, `Web3FundMe: ${msg}`);
        if (!success) {
            console.error(`Failed to send OTP email to ${email}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in Otp function:", error);
        return false;
    }
}
