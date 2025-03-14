import { db } from "../../db/db";
import { sendEmail } from "../mail/mail";
import { formatAddress } from "../FormateAddress";
export async function VotedEvent(contributorId:number){
    try {
        const contributor=await db.contributor.findUnique({
            where:{
                id:contributorId
            },
            include:{
                campaign:{
                    select:{
                        deployedAddress:true,
                        user:{
                            select:{
                                email:true
                            }
                        }
                    }
                }
            }
        })
        if(!contributor){
            return;
        }
        const campaigner_msg= {
            subject: "🗳️ A Contributor Has Voted!",
            message: `A contributor has voted on your campaign proposal.\n\n
            🔹 **Voter Wallet:** ${formatAddress(contributor.walletAddress)}\n
            ✅ **Vote:** ${contributor.vote==="yes" ? "YES" : "NO"}\n\n
            Keep an eye on the voting results!`
        };
        await sendEmail(contributor.campaign.user.email,campaigner_msg.subject,campaigner_msg.message);
        
        const contributor_msg= {
            subject: "🗳️ Your Vote Has Been Recorded!",
            message: `You have successfully voted in the campaign.\n\n
            📌 **Campaign:** ${contributor.campaign.deployedAddress && formatAddress(contributor.campaign.deployedAddress)}\n
            ✅ **Your Vote:** ${contributor.vote==="yes" ? "YES" : "NO"}\n\n
            Thank you for participating!`
        }
        if(contributor.email){
            await sendEmail(contributor.email,contributor_msg.subject,contributor_msg.message);
        }
    } catch (error:any) {
        console.log("Voted Event Error: "+error)
    }
}