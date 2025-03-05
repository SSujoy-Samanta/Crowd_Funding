import { db } from "./DB/db";

export async function getContractAddresses(factoryAddress: string): Promise<string[]> {
  const allCampaigns = await db.campaign.findMany({});
  
  // Extract deployed addresses and filter out null values
  const addresses = allCampaigns
    .map((x) => x.deployedAddress)
    .filter((address): address is string => address !== null); // Type guard to ensure only strings

  return [
    factoryAddress,
    ...addresses 
  ];
}
