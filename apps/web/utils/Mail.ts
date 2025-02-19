import nodemailer from 'nodemailer';
const transport=nodemailer.createTransport({
    service:'gmail',
    port:465,
    secure:true,
    auth:{
        user:process.env.MAIL_ACC,
        pass:process.env.ACC_PASS
    }
})

export async function sendEmail(otp: string, To: string, subject: string): Promise<boolean> {
    try {
        const receiver = {
            from: process.env.MAIL_ACC,
            to: To,
            subject: subject,
            text: `Your Verification OTP: ${otp} ; Please don't share with anyone.`,
            html: `
            <div style="font-family: 'Helvetica', Arial, sans-serif; background-color: #f4f7fc; padding: 40px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 25px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);">
                    <!-- Header Section -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        <span style="font-size: 32px; font-weight: bold; color:#a12fa3;">
                            Web3FundMe
                        </span>
                    </div>
                    
                    <!-- Main Content -->
                    <h2 style="color: #2B6CB0; font-size: 22px; font-weight: bold; text-align: center;">Your ${subject} OTP</h2>
                    <p style="font-size: 16px; color: #333; text-align: center;">Hello,</p>
                    <p style="font-size: 16px; color: #333; text-align: center;">To complete your registration, please use the OTP below:</p>

                    <div style="text-align: center; margin: 30px 0; padding: 10px; background-color: #f0f9ff; border-radius: 8px;">
                        <p style="font-size: 28px; font-weight: bold; color: #D53F8C;">${otp}</p>
                    </div>

                    <p style="font-size: 14px; color: #6B7280; text-align: center; margin-top: 10px;">
                        For security reasons, please do not share this OTP with anyone. If you did not request this, kindly ignore this email.
                    </p>
                    <p style="font-size: 14px; color: #6B7280; text-align: center;">
                        Thank you for choosing Web3FundMe.<br>Best regards,<br>Team Web3FundMe
                    </p>

                    <!-- Footer Section -->
                    <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #9CA3AF;">
                        <p>&copy; ${new Date().getFullYear()} Web3FundMe. All rights reserved.</p>
                    </div>
                </div>
            </div>
        `
        }
        await transport.sendMail(receiver, (e, info) => {
            if (e) {
                console.log(e);
                return false;
            } else {
                console.log(`Email sent to ${info.response}`);
                return true;
            }
        });
        return true;
    } catch (e) {
        console.log('Error occurred:', e);
        throw new Error('Failed to send email');
        return false;
    }
}

