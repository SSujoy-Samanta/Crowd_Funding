"use client";

import { CrowdfundingFactoryABI } from "@repo/common/ABI";
import { useReadContract } from "wagmi";


export const Interaction=()=>{
    const { data, isLoading, error } = useReadContract({
        address: '0x8464135c8F25Da09e49BC8782676a84730C318bC',
        abi: CrowdfundingFactoryABI,
        functionName: 'owner', 
    })

    return <div>
        The owner id  {JSON.stringify(data?.toString())}
    </div>
}