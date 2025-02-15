'use client';
import { CrowdFundingABI } from "@repo/common/ABI";
import { useWaitForTransactionReceipt, useWriteContract,type BaseError } from "wagmi";


export const ClaimRefund = () => {
    const { data: hash,error,isPending, writeContract } = useWriteContract();

    async function handleClaimRefund() {
    
        try {
            writeContract({
                address: "0x8398bCD4f633C72939F9043dB78c574A91C99c0A",
                abi: CrowdFundingABI,
                functionName: "claimRefund",
            });
           
        } catch (error: any) {
            console.error("Transaction error:", error);

        } 
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash,});

    return (
        <div className="p-4 border rounded-lg shadow-md w-80 mx-auto text-center">
            <h2 className="text-lg font-semibold mb-3">Claim for Refund</h2>

            
            <button 
                onClick={handleClaimRefund} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isPending}
            >
                {isPending ? "Processing..." : "Claim"}
            </button>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>} 
            {isConfirmed && <div>Refund Claimed Successfull.</div>} 
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </div>
    );
};
