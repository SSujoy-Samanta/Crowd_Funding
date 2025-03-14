require('dotenv').config();
import {Kafka} from "kafkajs";
import { ContractEvent } from "./services/events/contract";
import { FundedEvent } from "./services/events/funded";
import { RefundedEvent } from "./services/events/refunded";
import { withdrawnEvent } from "./services/events/withdrawn";
import { VotedEvent } from "./services/events/voted";
import { VotingStartedEvent } from "./services/events/votingStarted";
import { VotingEndedEvent } from "./services/events/votingEnded";


// const TOPIC_NAME="zap-queue";
const kafka = new Kafka({
    clientId: "crowdfunding-app",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"], 
});

const main = async () => {
    try {
        const consumer = kafka.consumer({ groupId: 'worker-main' });
        await consumer.connect();
        await consumer.subscribe({ topic: "email-events", fromBeginning: true });

        await consumer.run({
            autoCommit: false,
            eachMessage: async ({ partition, message }) => {
                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value?.toString(),
                });

                if (!message.value?.toString()) {
                    return;
                }

                const parseValue = JSON.parse(message.value?.toString());
                const event = parseValue.event as string;
                const campaignId = parseInt(parseValue.campaignId);
                const contributorId = parseValue.contributorId ? parseInt(parseValue.contributorId) : null;

                console.log(`Processing event: ${event}`);

                switch (event) {
                    case "ContractDeployed":
                        console.log("Handling ContractDeployed event...");
                        await ContractEvent(campaignId);
                        break;
                    case "Funded":
                        console.log("Handling Funded event...");
                        if (contributorId) {
                            await FundedEvent(contributorId);
                        }                        
                        break;

                    case "Refunded":
                        console.log("Handling Refunded event...");
                        if(contributorId){
                            await RefundedEvent(contributorId)
                        }
                        break;

                    case "Withdrawn":
                        console.log("Handling Withdrawn event...");
                        await withdrawnEvent(campaignId);
                        break;

                    case "Voted":
                        console.log("Handling Voted event...");
                        if(contributorId){
                            await VotedEvent(contributorId);
                        }
                        break;

                    case "VotingStarted":
                        console.log("Handling VotingStarted event...");
                        await VotingStartedEvent(campaignId);
                        break;

                    case "VotingEnded":
                        console.log("Handling VotingEnded event...");
                        await VotingEndedEvent(campaignId)
                        break;
                    default:
                        console.log(`Unknown event: ${event}, skipping...`);
                        break;
                }

                console.log("Processing Done!!!");

                await consumer.commitOffsets([{
                    topic: "email-events",
                    partition: partition,
                    offset: (parseInt(message.offset) + 1).toString()
                }]);
            },
        });
    } catch (e: any) {
        console.log("Worker error: " + e);
    }
};

main();
