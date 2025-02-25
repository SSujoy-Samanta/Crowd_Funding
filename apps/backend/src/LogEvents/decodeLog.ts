import { CrowdFundingABI, CrowdfundingFactoryABI } from "@repo/common/ABI";
import { ethers } from "ethers";

export async function decodeLog(log:ethers.Log,CONTRACT_ADDRESS:string):Promise<ethers.LogDescription | null> {

    try {
        if (log.address === CONTRACT_ADDRESS) {
            const ContractInterface = new ethers.Interface(CrowdfundingFactoryABI);
            if(!ContractInterface) return null;
    
            const parsedLog = ContractInterface.parseLog(log);
            if(!parsedLog) return null;
            
            console.log(`🔥 Event: ${parsedLog.name}, Data:`, parsedLog.args);
    
            return parsedLog;
    
        } else {
            const ContractInterface = new ethers.Interface(CrowdFundingABI);
            if(!ContractInterface) return null;        
    
            const parsedLog = ContractInterface.parseLog(log);
            if(!parsedLog) return null;
            
            console.log(`🔥 Event: ${parsedLog.name}, Data:`, parsedLog.args);
    
            return parsedLog;
        }
    } catch (decodeError) {
        console.error("⚠️ Error decoding log:", decodeError);
        return null
    }
}