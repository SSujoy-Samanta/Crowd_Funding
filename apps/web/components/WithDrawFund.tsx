'use client';
import { CrowdFundingABI } from "@repo/common/ABI";
import { useWaitForTransactionReceipt, useWriteContract,type BaseError } from "wagmi";


export const WithDrawFund = () => {
    const { data: hash,error,isPending, writeContract } = useWriteContract();

    async function handleWithDrawFunds() {
    
        try {
            writeContract({
                address: "0x02299a3DcaB0938d0544130D054Bcbfb32B588C3",
                abi: CrowdFundingABI,
                functionName: "withdrawFunds",
            });
           
        } catch (error: any) {
            console.error("Transaction error:", error);

        } 
    }

    

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash,});

    return (
        <div className="p-4 border rounded-lg shadow-md w-80 mx-auto text-center">
            <h2 className="text-lg font-semibold mb-3">Withdraw Funds</h2>

            
            <button 
                onClick={handleWithDrawFunds} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isPending}
            >
                {isPending ? "Processing..." : "Withdraw"}
            </button>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>} 
            {isConfirmed && <div>Withdraw Successfull.</div>} 
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </div>
    );
};
