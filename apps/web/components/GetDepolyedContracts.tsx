"use client";

import { CrowdfundingFactoryABI } from "@repo/common/ABI";
import { useBalance, useReadContract } from "wagmi";


export const GetDeployedContracts=()=>{
    const { data, isLoading, error } = useReadContract({
        address: '0x8464135c8F25Da09e49BC8782676a84730C318bC',
        abi: CrowdfundingFactoryABI,
        functionName: 'getDeployedContracts',
    })
    const balance=useBalance({address:'0x8398bCD4f633C72939F9043dB78c574A91C99c0A'})
    
    return <div>
        The depolyed contract address: {JSON.stringify(data?.toString())}
        Balance:{balance.data?.formatted}
    </div>
}