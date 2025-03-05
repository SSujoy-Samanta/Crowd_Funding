import { ETH_DECIMAL } from "@/utils/wei";
import { CrowdFundingABI } from "@repo/common/ABI";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import { useMemo } from "react";

export const useFundingRaised = (address: Address) => {
    const { data, isLoading, error } = useReadContract({
        address,
        abi: CrowdFundingABI,
        functionName: 'fundsRaised',
    });

    const ETH = useMemo(() => (data ? Number(data) / Number(ETH_DECIMAL) : 0.0), [data]);

    if (error) return null;

    return ETH;
};