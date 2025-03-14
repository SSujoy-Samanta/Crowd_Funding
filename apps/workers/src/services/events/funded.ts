import { db } from "../../db/db";
import { sendEmail } from "../mail/mail";
import { formatEther } from "ethers";
import { formatAddress } from "../FormateAddress";
export async function FundedEvent(contributorId:number){
    try {
        const contributor=await db.contributor.findUnique({
            where:{
                id:contributorId
            },
            include:{
                campaign:{
                    select:{
                        walletAddress:true,
                        Goal:true,
                        deployedAddress:true,
                        transactionHash:true,
                        raised:true,
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
            subject: "💰 New Contribution to Your Campaign!",
            message: `Great news! Someone has contributed to your campaign.\n\n
            🔹 **Contributor Wallet:** ${formatAddress(contributor.walletAddress)}\n
            💵 **Amount:** ${formatEther(contributor.amount)} ETH\n
            📈 **Total Raised:** ${formatEther(contributor.campaign.raised)} ETH\n\n
            Keep pushing towards your goal!`
        };

        await sendEmail(contributor.campaign.user.email,campaigner_msg.subject,campaigner_msg.message);

        const contributor_msg= {
            subject: "🎉 Thank You for Your Contribution!",
            message: `Thank you for contributing to the campaign!\n\n
            📌 **Campaign:** ${contributor.campaign.deployedAddress && formatAddress(contributor.campaign.deployedAddress)}\n
            💵 **Your Contribution:** ${formatEther(contributor.amount)} ETH\n\n
            Your support makes a difference!`
        }

        if(contributor.email){
            await sendEmail(contributor.email,contributor_msg.subject,contributor_msg.message);
        }
    } catch (error:any) {
        console.log("Funded Event Error: "+error)
    }
}