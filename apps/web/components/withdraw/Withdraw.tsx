'use client';
import { CrowdFundingABI } from "@repo/common/ABI";
import { useWaitForTransactionReceipt, useWriteContract, type BaseError } from "wagmi";
import React, { SetStateAction, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, ArrowDown, Loader2 } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { ErrorAnimation } from './ErrorAnimation';
import { SuccessAnimation } from './SuccessAnimation';
import { Address, isAddress } from "viem";
import { RxCrossCircled } from "react-icons/rx";

// Define error types for better organization
type BlockchainErrorType = 'user-rejected' | 'insufficient-funds' | 'gas-limit' | 'contract-error' | 'network-error' | 'unknown';

interface BlockchainError {
  type: BlockchainErrorType;
  message: string;
  details?: string;
}

interface WithDrawProps {
  contractAddress: string,
  setWithdraw: React.Dispatch<SetStateAction<boolean>>
}

export const WithDrawFund = ({ contractAddress, setWithdraw }: WithDrawProps) => {
    const validAddress: Address | null = contractAddress && isAddress(contractAddress) ? (contractAddress as Address) : null;

    const [status, setStatus] = useState<'idle' | 'processing' | 'confirmed' | 'error'>('idle');
    const { data: hash, isPending, writeContract } = useWriteContract();
    const [error, setError] = useState<BlockchainError | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Function to parse blockchain errors
    const parseBlockchainError = (err: any): BlockchainError => {
        const errorMessage = err?.message || '';
        const errorCode = err?.code;
        
        // User rejected transaction
        if (errorMessage.includes('user rejected') || errorCode === 4001) {
            return {
                type: 'user-rejected',
                message: 'Transaction was rejected',
                details: 'You declined the transaction in your wallet.'
            };
        }
        
        // Insufficient funds
        if (errorMessage.includes('insufficient funds') || errorCode === -32000) {
            return {
                type: 'insufficient-funds',
                message: 'Insufficient funds',
                details: 'You don\'t have enough funds to complete this transaction.'
            };
        }
        
        // Gas limit errors
        if (errorMessage.includes('gas limit') || errorMessage.includes('gas required exceeds')) {
            return {
                type: 'gas-limit',
                message: 'Gas limit exceeded',
                details: 'The transaction requires more gas than allowed.'
            };
        }
        
        // Contract errors (often have "revert" or specific error codes)
        if (errorMessage.includes('execution reverted') || errorMessage.includes('revert')) {
            // Extract the custom error if available
            const customErrorMatch = errorMessage.match(/reverted: (.+)$/);
            const customError = customErrorMatch ? customErrorMatch[1] : 'Contract execution failed';
            
            return {
                type: 'contract-error',
                message: 'Smart contract error',
                details: customError
            };
        }
        
        // Network errors
        if (errorMessage.includes('network') || errorMessage.includes('connection') || errorCode === -32603) {
            return {
                type: 'network-error',
                message: 'Network error',
                details: 'Please check your internet connection and try again.'
            };
        }
        
        // Default unknown error
        return {
            type: 'unknown',
            message: 'Transaction failed',
            details: errorMessage || 'An unknown error occurred.'
        };
    };

    async function handleWithDrawFunds() {
        try {
            if (!validAddress) {
                setError({
                    type: 'contract-error',
                    message: 'Invalid Contract Address',
                    details: 'The provided contract address is not valid.'
                });
                setStatus('error');
                return;
            }
            
            setStatus('processing');
            setError(null);

            writeContract({
                address: validAddress,
                abi: CrowdFundingABI,
                functionName: "withdrawFunds",
            });
            
        } catch (err: any) {
            console.error("Transaction error:", err);
            setError(parseBlockchainError(err));
            setStatus('error');
        }
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed, error: txError } = useWaitForTransactionReceipt({
        hash: hash as `0x${string}` | undefined,
    });

    // Button state variables
    const isIdle = status === 'idle';
    const isProcessing = status === 'processing' || isConfirming;
    const hasError = status === 'error' || !!error;

    useEffect(() => {
        if (isConfirmed) {
            setShowSuccess(true);
            setStatus("confirmed");
        }
    }, [isConfirmed]);
    
    useEffect(() => {
        if (txError) {
            const parsedError = parseBlockchainError(txError);
            setError(parsedError);
            setStatus("error");
        }
    }, [txError]);

    // Function to get appropriate error icon based on error type
    const getErrorIcon = (errorType: BlockchainErrorType) => {
        switch (errorType) {
            case 'user-rejected':
                return <RxCrossCircled size={24} />;
            case 'insufficient-funds':
                return <AlertCircle size={24} />;
            case 'gas-limit':
                return <AlertCircle size={24} />;
            case 'contract-error':
                return <AlertCircle size={24} />;
            case 'network-error':
                return <AlertCircle size={24} />;
            default:
                return <AlertCircle size={24} />;
        }
    };

    return (
        <motion.div
            className="p-6 border border-gray-200 rounded-xl shadow-lg w-96 mx-auto text-center bg-white relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
            <div className="flex justify-center items-center p-2 absolute top-2 right-2 cursor-pointer " onClick={()=>{setWithdraw(x=>!x)}}>
                <RxCrossCircled size={25} color="red"/>
            </div>
            <AnimatedLogo status={status} />

            <motion.div
                className="mb-6 relative"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-xl font-bold mb-2 text-gray-800">Withdraw Funds</h2>
                <p className="text-gray-500 text-sm">Withdraw your available funds from the crowdfunding contract</p>
            </motion.div>

            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: isConfirmed ? 1.03 : 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.button
                    onClick={handleWithDrawFunds}
                    className={`
                        relative w-full py-3 px-6 rounded-lg font-medium 
                        transition-all duration-300 
                        ${isIdle ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" : 
                        isProcessing ? "bg-blue-100 text-blue-500" :
                        isConfirmed ? "bg-green-100 text-green-500" : 
                        "bg-red-100 text-red-500"}
                        disabled:opacity-70 flex items-center justify-center gap-2
                    `}
                    disabled={isProcessing || showSuccess}
                    whileHover={isIdle ? { scale: 1.03 } : {}}
                    whileTap={isIdle ? { scale: 0.98 } : {}}
                >
                    <AnimatePresence mode="wait">
                        {isIdle && (
                            <motion.div
                                key="idle"
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <ArrowDown size={18} />
                                <span>Withdraw</span>
                            </motion.div>
                        )}

                        {isProcessing && (
                            <motion.div
                                key="processing"
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 size={18} />
                                </motion.div>
                                <span>{isConfirming ? "Confirming..." : "Processing..."}</span>
                            </motion.div>
                        )}

                        {isConfirmed && (
                            <motion.div
                                key="confirmed"
                                className="flex items-center gap-2"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Check size={18} />
                                <span>Withdraw Successful</span>
                            </motion.div>
                        )}

                        {hasError && (
                            <motion.div
                                key="error"
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    animate={{ x: [0, -3, 3, -3, 3, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <AlertCircle size={18} />
                                </motion.div>
                                <span>Failed</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Transaction details container */}
                <AnimatePresence>
                    {hash && (
                        <motion.div
                            className="bg-gray-50 rounded-lg p-3 mb-2 mt-4 overflow-hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="font-medium text-gray-700 mb-1">Transaction Hash:</p>
                            <motion.p
                                className="text-gray-500 truncate"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {hash}
                            </motion.p>
                        </motion.div>
                    )}

                    {hasError && (
                        <motion.div
                            className="bg-red-50 border border-red-100 rounded-lg p-4 mt-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="text-red-500">
                                    {error && getErrorIcon(error.type)}
                                </div>
                                <h3 className="font-medium text-red-700">
                                    {error?.message || "Transaction Failed"}
                                </h3>
                            </div>
                            <p className="text-red-600 text-sm">
                                {error?.details || "An error occurred during the transaction."}
                            </p>
                            
                            {/* Helpful suggestion based on error type */}
                            {error && (
                                
                                <motion.div 
                                    className="mt-3 pt-3 border-t border-red-200 text-sm text-red-600"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {error.type === 'user-rejected' && (
                                        <p>You can try again whenever you're ready.</p>
                                    )}
                                    {error.type === 'insufficient-funds' && (
                                        <p>Please add more funds to your wallet before trying again.</p>
                                    )}
                                    {error.type === 'gas-limit' && (
                                        <p>Try adjusting the gas settings in your wallet or try again later when gas prices may be lower.</p>
                                    )}
                                    {error.type === 'network-error' && (
                                        <p>Check your internet connection and wallet connection status before trying again.</p>
                                    )}
                                    {error.type === 'contract-error' && (
                                        <p>This may be due to contract restrictions or requirements not being met.</p>
                                    )}
                                    {error.type === "unknown" && (
                                        <p>An unknown error occurred.</p>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                    
                    {isConfirmed && <SuccessAnimation />}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default WithDrawFund;