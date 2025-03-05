'use client';

import { ETH_DECIMAL } from "@/utils/wei";
import { CrowdFundingABI } from "@repo/common/ABI";
import { Address } from "viem";
import { useReadContract } from "wagmi";


export const FundingRaised = ({ address}:{ address:Address}) => {
    const { data, isLoading, error } = useReadContract({
        address,
        abi: CrowdFundingABI,
        functionName: 'fundsRaised', 
    });

    // Convert BigInt to ETH (Safe approach)
    const ETH = data ? Number(data) / Number(ETH_DECIMAL) : 0.0;

    return (
        <div>
            {ETH.toFixed(9)} ETH
        </div>
    );
};
