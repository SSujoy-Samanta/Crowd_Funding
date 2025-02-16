'use client';

import { ETH_DECIMAL } from "@/utils/wei";
import { CrowdFundingABI } from "@repo/common/ABI";
import { useReadContract } from "wagmi";


export const FundingRaised = () => {
    const { data, isLoading, error } = useReadContract({
        address: '0x8398bCD4f633C72939F9043dB78c574A91C99c0A',
        abi: CrowdFundingABI,
        functionName: 'fundsRaised', 
    });

    // Convert BigInt to ETH (Safe approach)
    const ETH = data ? Number(data) / Number(ETH_DECIMAL) : 0.0;

    return (
        <div>
            Campaign Fund Raised - {ETH.toFixed(9)} ETH
        </div>
    );
};
