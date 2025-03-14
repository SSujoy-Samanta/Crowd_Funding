import { ethers } from "ethers";
import { db } from "../DB/db";
import { sendEmailEvent } from "../services/KafkaProducer";

//Parse Event Dynamically
export async function CampaignEvent(log:ethers.Log,parsedLog:ethers.LogDescription){
   
    try {
        if(!parsedLog) return;

        const campaign=await db.campaign.findUnique({
            where:{
                deployedAddress:log.address
            }
        })

        if (campaign) {
            if (parsedLog.name === "Funded") {

                const amount=parseFloat(campaign.raised)===0 ? parsedLog.args[1].toString(): await AddEth(campaign.raised,parsedLog.args[1].toString());
                
                await db.campaign.update({
                    where:{
                        id:campaign.id
                    },
                    data:{
                        raised:amount
                    }
                })
                const contributor=await db.contributor.findFirst({
                    where:{
                        campaignId:campaign.id,
                        walletAddress:parsedLog.args[0],
                    }
                })
                if(!contributor){
                    const Contributor=await db.contributor.create({
                        data:{
                            transactionHash:[log.transactionHash],
                            walletAddress:parsedLog.args[0],
                            amount:parsedLog.args[1].toString(),
                            campaignId:campaign.id
                        }
                    })
                    await sendEmailEvent(parsedLog.name,"contributor",campaign.id,Contributor.id); 
                }else{
                    const amount=parseFloat(contributor.amount)===0 ? parsedLog.args[1].toString(): await AddEth(contributor.amount,parsedLog.args[1].toString());
                
                    await db.contributor.update({
                        where:{
                            id:contributor.id
                        },
                        data:{
                            transactionHash:{push:log.transactionHash},
                            amount,
                            timestamp:new Date()
                        }
                    })
                    await sendEmailEvent(parsedLog.name,"contributor",campaign.id,contributor.id); 
                }
                
                
            } else if (parsedLog.name === "Refunded") {
                const contributor=await db.contributor.findFirst({
                    where:{
                        campaignId:campaign.id,
                        walletAddress:parsedLog.args[0]
                    }
                })
                if(!contributor){
                    console.log(`🏦 Refunded Event - Receiver: ${parsedLog.args[0]} not found`)
                }else{
                    await db.contributor.update({
                        where:{
                            id:contributor.id
                        },
                        data:{
                            refunded:true
                        }
                    })
                    await sendEmailEvent(parsedLog.name,"contributor",campaign.id,contributor.id); 
                }
            } else if (parsedLog.name === "Withdrawn") {
                await db.campaign.update({
                    where:{
                        id:campaign.id,
                    },
                    data:{
                        withdrawn:true
                    }
                })
                await sendEmailEvent(parsedLog.name,"campaigner",campaign.id); 
            } else if (parsedLog.name === "Voted") {
                const contributor=await db.contributor.findFirst({
                    where:{
                        campaignId:campaign.id,
                        walletAddress:parsedLog.args[0]
                    }
                })
                if(!contributor){
                    console.log(`🗳️ Voted Event - Voter: ${parsedLog.args[0]} not found`)
                }else{
                    await db.contributor.update({
                        where:{
                            id:contributor.id
                        },
                        data:{
                            vote:parsedLog.args[1]?"yes":"no"
                        }
                    });
                    await sendEmailEvent(parsedLog.name,"contributor",campaign.id,contributor.id); 
                }
                
            } else if (parsedLog.name === "VotingStarted") {
                await db.campaign.update({
                    where:{
                        id:campaign.id,
                    },
                    data:{
                        votingStatus:"OnGoing"
                    }
                })
                await sendEmailEvent(parsedLog.name,"campaigner",campaign.id); 
            } else if (parsedLog.name === "VotingEnded") {
                await db.campaign.update({
                    where:{
                        id:campaign.id,
                    },
                    data:{
                        votingStatus:"Completed",
                        VotingSuccess:parsedLog.args[0]
                    }
                })
                await sendEmailEvent(parsedLog.name,"campaigner",campaign.id); 
            }
            console.log("updated database...");
            
        }else{
            console.log("❌ Error: Campaign not found for update.");
        }
       
        
        if (parsedLog.name === "Funded") {
            console.log(`💰 Funded Event - Funder: ${parsedLog.args[0]}, Amount: ${parsedLog.args[1]}`);
        } else if (parsedLog.name === "Refunded") {
            console.log(`🏦 Refunded Event - Receiver: ${parsedLog.args[0]}, Amount: ${parsedLog.args[1]}`);
        } else if (parsedLog.name === "Withdrawn") {
            console.log(`🏦 Withdrawn Event - Receiver: ${parsedLog.args[0]}, Amount: ${parsedLog.args[1]}`);
        } else if (parsedLog.name === "Voted") {
            console.log(`🗳️ Voted Event - Voter: ${parsedLog.args[0]}, Decision: ${parsedLog.args[1]}`);
        } else if (parsedLog.name === "VotingStarted") {
            console.log(`🚀 Voting Started!`);
        } else if (parsedLog.name === "VotingEnded") {
            console.log(`✅ Voting Ended - Result: ${parsedLog.args[0]}`);
        }else{
            console.log("⚠️ Unknown event detected:", parsedLog.name);
        }
    } catch (error) {
        console.log("⚠️ Campaign event error."+error);
    }
}

async function AddEth(a:string,b:string):Promise<string> {
    const value1: bigint = BigInt(a); 
    const value2: bigint = BigInt(b);
    const sum: bigint = value1 + value2;
    return sum.toString();
}