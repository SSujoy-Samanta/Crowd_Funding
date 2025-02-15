'use client';

import { CrowdFundingABI} from "@repo/common/ABI";
import { useReadContract } from "wagmi";

export const CreatorCampaign =()=>{
    const { data, isLoading, error } = useReadContract({
        address: '0x8398bCD4f633C72939F9043dB78c574A91C99c0A',
        abi: CrowdFundingABI,
        functionName: 'creator', 
    })
    return <div>
        Campaign Creator is - {JSON.stringify(data?.toString())}
    </div>
}