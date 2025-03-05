'use client';

import { CrowdFundingABI } from "@repo/common/ABI";
import { useState, useEffect, SetStateAction } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { Address, isAddress } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

interface VotingProps{
    contractAddress:string;
    setVoting:React.Dispatch<SetStateAction<boolean>>
}

export const Voting = ({contractAddress,setVoting}:VotingProps) => {
    const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
    const {isConnected}=useAccount();
    const [selectedVote, setSelectedVote] = useState<string>('');
    const [inputVote, setInputVote] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const validAddress: Address | null = contractAddress && isAddress(contractAddress) ? (contractAddress as Address) : null;
    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
        useWaitForTransactionReceipt({ hash });

    // Handle contract errors with useEffect to prevent render loops
    useEffect(() => {
        if (isError && error) {
            console.error("Contract error:", error);
            setErrorMessage(`Transaction error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [isError, error]);

    // Handle confirmation success with useEffect
    useEffect(() => {
        if (isConfirmed && !isSuccess) {
            setIsSuccess(true);
        }
    }, [isConfirmed, isSuccess]);

    function validateInputs() {
        if (!selectedVote) {
            setErrorMessage("Please select a voting option");
            return false;
        }

        if (!inputVote) {
            setErrorMessage("Please type your confirmation vote");
            return false;
        }

        if (selectedVote.toLowerCase() !== inputVote.toLowerCase()) {
            setErrorMessage("Your typed vote must match your selected option");
            return false;
        }
        if(!isConnected){
            setErrorMessage("Please connect your wallet");
            return false;
        }

        return true;
    }

    async function handleVoting() {
        // Reset states
        setIsSuccess(false);
        setErrorMessage('');
        
        if (!validateInputs()) return;
        if(!validAddress) return;

        try {
            const isVoteYes = selectedVote.toLowerCase() === "yes";
            
            writeContract({
                address: validAddress,
                abi: CrowdFundingABI,
                functionName: "vote",
                args: [isVoteYes],
            });
        } catch (err) {
            setErrorMessage(`Transaction failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            console.error("Transaction error:", err);
        }
    }

    return (
        <div className="max-w-md  text-black bg-gradient-to-bl from-slate-400 to-slate-200 rounded-xl shadow-lg overflow-hidden md:max-w-2xl relative">
            <div className="flex justify-center items-center p-2 absolute top-2 right-2 cursor-pointer " onClick={()=>{setVoting(x=>!x)}}>
                <RxCrossCircled size={25} color="blue"/>
            </div>
            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Cast Your Vote</h2>
                    <p className="text-cyan-700 mt-2">Your opinion matters in this funding decision</p>
                </div>

                {/* Status Messages */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            {errorMessage}
                        </p>
                    </div>
                )}

                {isSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        <p className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            Your vote has been successfully recorded!
                        </p>
                    </div>
                )}

                {/* Voting Form */}
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleVoting(); }}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Choose your vote:</label>
                        <select
                            value={selectedVote}
                            onChange={(e) => setSelectedVote(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            disabled={isPending || isConfirming}
                        >
                            <option value="">Select an option</option>
                            <option value="Yes">Yes, provide funding</option>
                            <option value="No">No, decline funding</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm your vote:</label>
                        <input
                            type="text"
                            value={inputVote}
                            onChange={(e) => setInputVote(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Type 'Yes' or 'No' to confirm"
                            disabled={isPending || isConfirming}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending || isConfirming}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                            isPending || isConfirming 
                                ? 'bg-indigo-300 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        } transition-colors`}
                    >
                        {isPending || isConfirming ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isConfirming ? 'Confirming...' : 'Processing...'}
                            </>
                        ) : (
                            'Submit Vote'
                        )}
                    </button>
                </form>

                {/* Transaction Status */}
                {hash && !isSuccess && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Transaction submitted. Please wait for confirmation.
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                            Hash: {hash.substring(0, 10)}...{hash.substring(hash.length - 10)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};