import { ethers } from "ethers";
import { db } from "../DB/db";
import { decodeLog } from "./decodeLog";
import { FactoryEvent } from "./FactoryEvent";
import { CampaignEvent } from "./CampaignEvent";


export async function ProcessedLog(log: ethers.Log,CONTRACT_ADDRESS:string) {
    try {
        const parsedLog=await decodeLog(log,CONTRACT_ADDRESS);
        if(!parsedLog){
            console.log("Failed to Parse the log.");
            return;
        }
        await db.indexedEvent.create({
            data: {
                transactionHash:log.transactionHash,
                blockNumber: log.blockNumber,
                logIndex: log.index,
                eventName:parsedLog.name,
            },
        });
        if (log.address === CONTRACT_ADDRESS) {
            await FactoryEvent(log,parsedLog);
        } else {
            await CampaignEvent(log,parsedLog);
        }
        
    } catch (decodeError) {
        console.error("⚠️ Error decoding log:", decodeError);
    }
}

