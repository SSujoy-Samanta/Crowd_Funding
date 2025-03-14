import { db } from "../../db/db";
import { sendEmail } from "../mail/mail";
import { formatAddress } from "../FormateAddress";
export async function VotingEndedEvent(campaignId:number){
    try {
        const campaign=await db.campaign.findUnique({
            where:{
                id:campaignId
            },
            include:{
                contributors:{
                    select:{
                        email:true,

                    }
                },
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
        const campaigner_msg={
            subject: "✅ Voting Has Ended!",
            message: `The voting session for your campaign has ended.\n\n
            🔹 **Result:** ${campaign.VotingSuccess ? "Success 🎉" : "Failed ❌"}\n\n
            ${campaign.VotingSuccess ? "You can now withdraw the funds." : "Voting failed, check the results."}`
        };

        await sendEmail(campaign.user.email,campaigner_msg.subject,campaigner_msg.message);

        const contributor_msg={
            subject: "❌ Voting Failed",
            message: `The voting for the campaign has failed.\n\n
            📌 **Campaign:** ${campaign.deployedAddress && formatAddress(campaign.deployedAddress)}\n
            🔄 **You can withdraw your ETH now.**`
        }
        if(!campaign.VotingSuccess){
            campaign.contributors.map(async(contributor)=>{
                if(contributor.email){
                    await sendEmail(contributor.email,contributor_msg.subject,contributor_msg.message);
                }
            })
        }
    } catch (error:any) {
        console.log("VotingEnded Event Error: "+error)
    }
}