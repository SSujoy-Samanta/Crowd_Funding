import { db } from "../../db/db";
import { sendEmail } from "../mail/mail";
import { formatAddress } from "../FormateAddress";

export async function withdrawnEvent(campaignId:number){
    try {
        const campaign=await db.campaign.findUnique({
            where:{
                id:campaignId
            },
            include:{
                user:{
                    select:{
                        email:true
                    }
                }
            }
            
        })
        if(!campaign){
            return;
        }
        const campaigner_msg= {
            subject: "🏦 Funds Withdrawn",
            message: `You have successfully withdrawn the funds from your campaign.\n\n
            🔹 **Total Withdrawn:** ${campaign.raised} ETH\n
            📌 **Campaign:** ${campaign.deployedAddress && formatAddress(campaign.deployedAddress)}\n\n
            Thank you for using our platform!`
        }
        
        await sendEmail(campaign.user.email,campaigner_msg.subject,campaigner_msg.message);
        
    } catch (error:any) {
        console.log("WithDrawn Event Error: "+error)
    }
}