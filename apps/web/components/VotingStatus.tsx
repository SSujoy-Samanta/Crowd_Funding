'use client';

import { CrowdFundingABI } from "@repo/common/ABI";
import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";

enum VotingStatusOpt { 
    PENDING,  // 0
    ONGOING,  // 1
    COMPLETED // 2
}

export const VotingStatus = () => {
    const [status, setStatus] = useState<VotingStatusOpt>(VotingStatusOpt.PENDING);

    const { data, isLoading, error } = useReadContract({
        address: '0x8398bCD4f633C72939F9043dB78c574A91C99c0A',
        abi: CrowdFundingABI,
        functionName: 'votingStatus', 
    });

    useEffect(() => {
        if (data !== undefined) {
            const statusIndex = Number(data);
            if (statusIndex in VotingStatusOpt) {
                setStatus(statusIndex as VotingStatusOpt);
            }
        }
    }, [data]);

    return (
        <div>
            Voting Status :- {VotingStatusOpt[status]}
        </div>
    );
};
