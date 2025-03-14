import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config(); 

const kafka = new Kafka({
    clientId: "crowdfunding-app",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"], 
});

const producer = kafka.producer();

 
export const sendEmailEvent = async (event:string, key:"campaigner"|"contributor", campaignId:number,contributorId?:number) => {
    try {
        await producer.connect();
        await producer.send({
            topic: "email-events",
            messages: [{ value: JSON.stringify({ event, campaignId, contributorId }), key }],
        });
        console.log(`✅ Kafka event produced for ${event}`);
    } catch (error) {
        console.error("❌ Kafka Producer Error:", error);
    } finally {
        await producer.disconnect();
    }
};
