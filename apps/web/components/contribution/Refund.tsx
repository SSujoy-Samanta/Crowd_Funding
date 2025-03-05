'use client';
import { useState, useEffect, SetStateAction } from 'react';
import { CrowdFundingABI } from "@repo/common/ABI";
import { useWaitForTransactionReceipt, useWriteContract, type BaseError } from "wagmi";
import { RxCrossCircled } from 'react-icons/rx';
import { Address, isAddress } from "viem";

interface RefundProps{
    contractAddress:string;
    setRefund:React.Dispatch<SetStateAction<boolean>>
}
export const ClaimRefundModal = ({
    contractAddress,
    setRefund
}: RefundProps) => {
    const { data: hash, error, isPending, writeContract } = useWriteContract();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const validAddress: Address | null = contractAddress && isAddress(contractAddress) ? (contractAddress as Address) : null;
    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({ hash });

    // Handle successful confirmation
    useEffect(() => {
        if (isConfirmed) {
            setShowSuccess(true);
            setIsAnimating(true);
            
            // Reset animation state after completion
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 1500);
            
            return () => clearTimeout(timer);
        }
    }, [isConfirmed]);

    // Handle errors
    useEffect(() => {
        if (error) {
            setErrorMessage((error as BaseError).shortMessage || error.message);
        } else {
            setErrorMessage(null);
        }
    }, [error]);

    async function handleClaimRefund() {
        setShowSuccess(false);
        setErrorMessage(null);
        if(!validAddress) return;
        
        try {
            writeContract({
                address: validAddress,
                abi: CrowdFundingABI,
                functionName: "claimRefund",
            });
        } catch (err: any) {
            console.error("Transaction error:", err);
            setErrorMessage(err?.message || "An unknown error occurred");
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl relative">
            <div className="flex justify-center items-center p-2 absolute top-2 right-2 cursor-pointer " onClick={()=>{setRefund(x=>!x)}}>
                <RxCrossCircled size={25} color="red"/>
            </div>
            <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                    <div className={`relative ${isAnimating ? 'animate-bounce' : ''}`}>
                    {showSuccess ? (
                            // Success checkmark icon
                            <svg 
                                className="w-16 h-16 text-green-500" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        ) : (
                            // Ethereum logo
                            <svg 
                                className="w-16 h-16 text-blue-500" 
                                viewBox="0 0 256 417" 
                                xmlns="http://www.w3.org/2000/svg"
                                preserveAspectRatio="xMidYMid"
                            >
                                <g fill="currentColor">
                                    <polygon points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32" />
                                    <polygon points="127.962 0 0 212.32 127.962 287.959 127.962 154.158" />
                                    <polygon points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866" />
                                    <polygon points="127.962 416.9052 127.962 312.1852 0 236.5852" />
                                    <polygon points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587" />
                                    <polygon points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588" />
                                </g>
                            </svg>
                        )}
                    </div>
                </div>

                <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
                    {showSuccess ? "Refund Claimed!" : "Claim Your Refund"}
                </h2>
                
                <p className="text-gray-600 text-center mb-6">
                    {showSuccess 
                        ? "Your transaction was successful. Funds will be returned to your wallet." 
                        : "Request a refund for your contribution to this campaign"}
                </p>

                {/* Error message */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="flex items-center text-red-700 text-sm">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            {errorMessage}
                        </p>
                    </div>
                )}

                {/* Transaction status */}
                {(hash && !showSuccess) && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-center items-center mb-2">
                            {isConfirming && (
                                <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <p className="text-blue-700 text-sm font-medium">
                                {isConfirming ? "Confirming transaction..." : "Transaction sent!"}
                            </p>
                        </div>
                        <p className="text-xs text-blue-600 text-center truncate">
                            Hash: {hash.substring(0, 10)}...{hash.substring(hash.length - 10)}
                        </p>
                    </div>
                )}

                {!showSuccess && (
                    <button 
                        onClick={handleClaimRefund} 
                        disabled={isPending || isConfirming}
                        className={`
                            w-full py-3 px-4 rounded-lg font-medium transition-all duration-300
                            ${isPending || isConfirming 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform hover:translate-y-1 hover:shadow-lg active:scale-95'
                            }
                        `}
                    >
                        <span className="flex justify-center items-center">
                            {(isPending || isConfirming) && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isPending ? "Processing..." : isConfirming ? "Confirming..." : "Claim Refund"}
                        </span>
                    </button>
                )}

                {/* {showSuccess && (
                    <button 
                        onClick={() => setShowSuccess(false)} 
                        className="w-full py-3 px-4 bg-white border-2 border-green-500 text-green-600 rounded-lg font-medium transition-all duration-300 hover:bg-green-50 transform hover:shadow-md active:scale-95"
                    >
                        Request Another Refund
                    </button>
                )} */}
            </div>
        </div>
    );
};