import { ethers } from "ethers";
import { db } from "../DB/db";
import { sendEmailEvent } from "../services/KafkaProducer";

export async function FactoryEvent(log: ethers.Log, parsedLog: ethers.LogDescription) {
    try {
        if (!parsedLog) return;

        const campaign = await db.campaign.findUnique({
            where: {
                transactionHash: log.transactionHash
            }
        });
        
        if (campaign) {
            if (parsedLog.name === "ContractDeployed") {
                await db.campaign.update({
                    where: {
                        transactionHash: campaign.transactionHash,
                    },
                    data: {
                        walletAddress: parsedLog.args[0],
                        deployedAddress: parsedLog.args[1],
                        Goal:parsedLog.args[2].toString()
                    }
                });
                console.log("✅ Database updated...");      
                await sendEmailEvent(parsedLog.name,"campaigner",campaign.id) 
            }
            
        } else {
            console.log("❌ Error: Campaign not found for update.");
        }

        if (parsedLog.name === "ContractDeployed") {
            console.log(`💰 ContractDeployed Event - Creator: ${parsedLog.args[0]}, Contract Address: ${parsedLog.args[1]}, Goal Amount: ${parsedLog.args[2].toString()}`);
        } else {
            console.log("⚠️ Unknown event detected:", parsedLog.name);
        }
    } catch (error) {
        console.error("⚠️ Factory event error:", error);
    }
}
