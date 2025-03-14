import { formatEther } from "ethers";
import { db } from "../../db/db";
import { sendEmail } from "../mail/mail";
export async function ContractEvent(camapignId:number){
    try {
        const campaign=await db.campaign.findUnique({
            where:{
                id:camapignId
            },
            select:{
                walletAddress:true,
                Goal:true,
                deployedAddress:true,
                transactionHash:true,
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
        const subject= "🚀 Your Campaign Smart Contract is Live!";
        const message= `Congratulations! Your campaign's smart contract has been successfully deployed.\n\n
            📌 **Campaign Address:** ${campaign.deployedAddress}\n
            📌 **Your Wallet:** ${campaign.walletAddress}\n
            📌 **Goal:** ${formatEther(campaign.Goal)} ETH\n
            📌 **Transaction Hash:** ${campaign.transactionHash}\n
            🔗 **View on Blockchain Explorer:** [Check Here](https://etherscan.io/address/${campaign.deployedAddress})\n\n
            Start promoting your campaign and raise funds now!`

        await sendEmail(campaign.user.email,subject,message);
    } catch (error:any) {
        console.log("Coontract Event Error: "+error)
    }
}