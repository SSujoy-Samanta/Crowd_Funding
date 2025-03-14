import { db } from "../../db/db";
import { sendEmail } from "../mail/mail";
import { formatAddress } from "../FormateAddress";
import { formatEther } from "ethers";
export async function RefundedEvent(contributorId:number){
    try {
        const contributor=await db.contributor.findUnique({
            where:{
                id:contributorId
            },
            include:{
                campaign:{
                    select:{
                        deployedAddress:true
                    }
                }
            }
        })
        if(!contributor){
            return;
        }
        const contributor_msg = {
            subject: "🔄 Refund Processed",
            message: `Your contribution has been refunded.\n\n
            🔹 **Campaign:** ${contributor.campaign.deployedAddress && formatAddress(contributor.campaign.deployedAddress)}\n
            💵 **Amount Refunded:** ${formatEther(contributor.amount)} ETH\n\n
            If you have any concerns, feel free to reach out.`
        }
        if(contributor.email){
            await sendEmail(contributor.email,contributor_msg.subject,contributor_msg.message);
        }
    } catch (error:any) {
        console.log("Refunded Event Error: "+error)
    }
}