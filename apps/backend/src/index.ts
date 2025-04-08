require("dotenv").config();
import express from "express";
import { JsonRpcProvider } from "ethers";
import { EVENTS } from "./events";
import { getContractAddresses } from "./contractAddress";
import { db } from "./DB/db";
import { ProcessedLog } from "./LogEvents/IndexerLog";


const app = express();
app.use(express.json());

// Ensure Environment Variables Exist
if (!process.env.RPC_URL || !process.env.FACTORY_CONTRACT_ADDRESS) {
    throw new Error("Missing environment variables: RPC_URL or CONTRACT_ADDRESS");
}

// Initialize Provider & Contract Interface
const provider = new JsonRpcProvider(process.env.RPC_URL);

let lastProcessedBlock = 0;

async function ensureProcessBlockExists() {
    const latestBlock = await provider.getBlockNumber();
    const startBlock = latestBlock > 10 ? latestBlock - 10 : 0;
    const processBlock = await db.processBlock.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, lastBlock: startBlock.toString() },
    });

    lastProcessedBlock = parseInt(processBlock.lastBlock);
}

// Ensure DB has an entry before polling starts
(async () => {
    await ensureProcessBlockExists();
})();



// Function to Poll New Blocks
async function pollNewBlocks() {
    try {
        const CONTRACT_ADDRESS=process.env.FACTORY_CONTRACT_ADDRESS;
        if (!CONTRACT_ADDRESS) return;
        const Addresses = await getContractAddresses(CONTRACT_ADDRESS);
        if (!Addresses) return;

        const latestBlock = await provider.getBlockNumber();
        const safeBlock = latestBlock - 10; // Ensure we process only finalized blocks
       
        if (lastProcessedBlock >= safeBlock) {
            console.log("⏳ No new blocks to process.");
            return;
        }

        console.log(`🔍 Checking blocks from ${lastProcessedBlock+1} to ${safeBlock} and latest-Block ${latestBlock}...`);
         

        for (const address of Addresses) {
            // Fetch only new logs from the last processed block
            const logs = await provider.getLogs({
                address,
                fromBlock: lastProcessedBlock+1,
                toBlock: safeBlock,
                topics: [EVENTS] 
            });

            if (logs.length > 0) {
                console.log("📜 New Events Found:");

                for (const log of logs) {

                    await ProcessedLog(log,CONTRACT_ADDRESS);
                }
            } else {
                console.log("No new events.");
            }
        }

         // **Update last processed block after processing logs**
        await db.processBlock.update({
            where: { id: 1 },
            data: { lastBlock: safeBlock.toString() },
        });

        lastProcessedBlock = safeBlock; 

    } catch (error) {
        console.error("🚨 Error fetching logs:", error);
    }
}

// Poll every 8 seconds
setInterval(pollNewBlocks, 8000);

app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server listening on port ${process.env.PORT || 5000}`);
});
