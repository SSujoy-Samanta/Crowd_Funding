import { db } from "../../db/db";
import { sendEmail } from "../mail/mail";
import { formatAddress } from "../FormateAddress";
export async function VotingStartedEvent(campaignId:number){
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
            subject: "🗳️ Voting Has Started!",
            message: `A new voting session has started for your campaign.\n\n
            📌 **Campaign:** ${campaign.deployedAddress && formatAddress(campaign.deployedAddress)}\n
            ⏳ **Status:** Ongoing\n\n
            Encourage contributors to vote!`
        };

        await sendEmail(campaign.user.email,campaigner_msg.subject,campaigner_msg.message);

        const contributor_msg={
            subject: "🗳️ Voting Started!",
            message: `Voting has started, now you can vote for the campaign.\n\n
            📌 **Campaign:** ${campaign.deployedAddress && formatAddress(campaign.deployedAddress)}\n
            🗳️ **Make your voice count!**`
        }
        campaign.contributors.map(async(contributor)=>{
            if(contributor.email){
                await sendEmail(contributor.email,contributor_msg.subject,contributor_msg.message);
            }
        })
    } catch (error:any) {
        console.log("Voting Started Event Error: "+error)
    }
}