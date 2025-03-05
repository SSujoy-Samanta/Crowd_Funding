import { ETH_DECIMAL } from "@/utils/wei";
import { CrowdFundingABI } from "@repo/common/ABI";
import { useMemo } from "react";
import { Address } from "viem";
import { useReadContract } from "wagmi";


export const useCampaignGoal = (address: Address) => {
 
    const { data, isLoading, error } = useReadContract({
        address,
        abi: CrowdFundingABI,
        functionName: 'fundingGoal', 
    });

    // Convert BigInt to ETH (Safe approach)
    const ETH = useMemo(() => (data ? Number(data) / Number(ETH_DECIMAL) : 0.0), [data]);

    if (error) return null;

    return ETH;

}