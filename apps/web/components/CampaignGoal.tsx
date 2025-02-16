'use client';

import { ETH_DECIMAL } from "@/utils/wei";
import { CrowdFundingABI } from "@repo/common/ABI";
import { useReadContract } from "wagmi";


export const CampaignGoal = () => {
    const { data, isLoading, error } = useReadContract({
        address: '0x8398bCD4f633C72939F9043dB78c574A91C99c0A',
        abi: CrowdFundingABI,
        functionName: 'fundingGoal', 
    });

    // Convert BigInt to ETH (Safe approach)
    const campaignGoalETH = data ? Number(data) / Number(ETH_DECIMAL) : 0.0;

    return (
        <div>
            Campaign Goal is - {campaignGoalETH.toFixed(9)} ETH
        </div>
    );
};
