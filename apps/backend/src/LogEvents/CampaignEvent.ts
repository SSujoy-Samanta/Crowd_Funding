import { ethers } from "ethers";
import { db } from "../DB/db";

//Parse Event Dynamically
export async function CampaignEvent(log:ethers.Log,parsedLog:ethers.LogDescription){
   
    try {
        if(!parsedLog) return;

        const campaign=await db.campaign.findUnique({
            where:{
                transactionHash:log.transactionHash
            }
        })
        if(campaign){
            
            console.log("updated database...");
        }else{
            console.log("Error during update database");
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
        console.log("⚠️ Campaign event error.");
    }
}