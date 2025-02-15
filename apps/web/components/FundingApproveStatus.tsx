'use client';

import { CrowdFundingABI } from "@repo/common/ABI";
import { useReadContract } from "wagmi";

export const FundingApproveStatus = () => {
    const { data, isLoading, error } = useReadContract({
        address: '0x8398bCD4f633C72939F9043dB78c574A91C99c0A',
        abi: CrowdFundingABI,
        functionName: 'fundingApproved', 
    });

    if (isLoading) return <div>Loading funding status...</div>;
    if (error) return <div className="text-red-500">Error fetching status</div>;

    const isApproved = data?.toString() === 'true';

    return (
        <div className="p-4 border rounded-lg shadow-md w-80 mx-auto">
            <h2 className="text-lg font-semibold">Funding Approval Status:</h2>
            <p className={`mt-2 font-bold ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
                {isApproved ? "COMPLETED" : "PENDING"}
            </p>
        </div>
    );
};
