import { CrowdfundingFactoryABI } from "@repo/common/ABI";
import { ethers } from "ethers";


//Parse Event Dynamically
export function FactoryEvent(log:ethers.Log){
    
    const ContractInterface = new ethers.Interface(CrowdfundingFactoryABI);
    if(!ContractInterface) return;
    
    const parsedLog = ContractInterface.parseLog(log);
    if(!parsedLog) return;

    console.log(`🔥 Event: ${parsedLog.name}, Data:`, parsedLog.args);

    if (parsedLog.name === "ContractDeployed") {
        console.log(`💰 ContractDeployed Event - Creator: ${parsedLog.args[0]}, Contract Address: ${parsedLog.args[1]},Goal Amount: ${parsedLog.args[2]}`);
    }else{
        console.log("⚠️ Unknown event detected:", parsedLog.name);
    }
}