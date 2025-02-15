require("dotenv").config();
import express from "express";
import {  JsonRpcProvider } from "ethers";
import { EVENTS } from "./events";
import { getContractAddresses } from "./contractAddress";
import { CampaignEvent } from "./LogEvents/CampaignEvent";
import { FactoryEvent } from "./LogEvents/FactoryEvent";


const app = express();
app.use(express.json());

//Ensure Environment Variables Exist
if (!process.env.RPC_URL || !process.env.FACTORY_CONTRACT_ADDRESS) {
    throw new Error("Missing environment variables: RPC_URL or CONTRACT_ADDRESS");
}

//Initialize Provider & Contract Interface
const provider = new JsonRpcProvider(process.env.RPC_URL);


let lastProcessedBlock = 0; // Track last processed block

console.log(process.env.FACTORY_CONTRACT_ADDRESS)
//Function to Poll New Blocks
async function pollNewBlocks() {
    try {
        if(!process.env.FACTORY_CONTRACT_ADDRESS) return;
        const Addresses=await getContractAddresses(process.env.FACTORY_CONTRACT_ADDRESS);
        if(!Addresses) return;

        const latestBlock = await provider.getBlockNumber();

        // if (lastProcessedBlock === 0) {
        //     lastProcessedBlock = latestBlock - 10; // Start from 10 blocks before if first run
        // }

        console.log(`🔍 Checking blocks from ${lastProcessedBlock} to ${latestBlock}...`);

        for (const address of Addresses) {
            //Fetch only new logs from the last processed block
            const logs = await provider.getLogs({
                address,
                fromBlock: lastProcessedBlock,
                toBlock: latestBlock,
                topics: [EVENTS] 
            });

            if (logs.length > 0) {
                console.log("📜 New Events Found:");
                logs.forEach((log) => {
                    try {
                        if(log.address===process.env.FACTORY_CONTRACT_ADDRESS){
                            FactoryEvent(log);
                        }else{
                            CampaignEvent(log);
                        }
                        
                    } catch (decodeError) {
                        console.error("⚠️ Error decoding log:", decodeError);
                    }
                });
            } else {
                console.log("No new events.");
            }
        }

        lastProcessedBlock = latestBlock + 1;

    } catch (error) {
        console.error("🚨 Error fetching logs:", error);
    }
}

//Poll every5 seconds
setInterval(pollNewBlocks, 5000);

app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server listening on port ${process.env.PORT || 5000}`);
});
