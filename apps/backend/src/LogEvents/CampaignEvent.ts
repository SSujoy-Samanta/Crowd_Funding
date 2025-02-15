import { CrowdFundingABI } from "@repo/common/ABI";
import { ethers } from "ethers";


//Parse Event Dynamically
export function CampaignEvent(log:ethers.Log){
    const ContractInterface = new ethers.Interface(CrowdFundingABI);
    if(!ContractInterface) return;
    
    const parsedLog = ContractInterface.parseLog(log);
    if(!parsedLog) return;

    console.log(`🔥 Event: ${parsedLog.name}, Data:`, parsedLog.args);

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
}