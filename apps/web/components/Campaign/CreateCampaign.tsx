"use client";

import { type BaseError, useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseEther, type Address } from "viem";
import { CrowdfundingFactoryABI } from "@repo/common/ABI";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { goalAmountState, notificationState, tags } from "@/lib/atom";
import Button from "../Buttons/buttons";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loading1 } from "../Loading/Loading1";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface CreateCampaignProps {
  userId: number | null;
  metadataId: number | null;
}

export const CreateCampaign = ({ userId, metadataId }: CreateCampaignProps) => {
    const { data: hash, error, isPending, isSuccess, writeContract } = useWriteContract();
    const { isConnected } = useAccount();
    const setNotification = useSetRecoilState(notificationState);
    const goal = useRecoilValue(goalAmountState);
    const Alltags = useRecoilValue(tags);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showErrorDetails, setShowErrorDetails] = useState(false);

    const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address | undefined;
    const convertEthToWei = (ethAmount: string) => parseEther(ethAmount);

  // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
  
    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.4 }
        }
    };

    const errorVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: { 
            height: "auto", 
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            height: 0,
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    async function handleCreateNewContract() {
        setErrorMessage(null);
        
        // Validation checks
        if (Alltags.length === 0) {
            setErrorMessage("Please select relevant tags first.");
            return;
        }
        
        if (!isConnected) {
            setErrorMessage("Connect your wallet first.");
            return;
        }
        
        if (!FACTORY_ADDRESS) {
            setErrorMessage("Factory address configuration is missing.");
            console.error("Factory address is missing.");
            return;
        }
        
        if (!goal || !goal.length || parseFloat(goal) <= 0) {
            setErrorMessage("Goal amount must be greater than zero.");
            return;
        }

        try {
            writeContract({
                address: FACTORY_ADDRESS,
                abi: CrowdfundingFactoryABI,
                functionName: "createCrowdfunding",
                args: [BigInt(convertEthToWei(goal))],
            });
        } catch (error) {
            console.error("Transaction error:", error);
            setErrorMessage("Failed to initiate transaction. Please try again.");
        }
    }

    // Hooks should not be inside conditions!
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    async function notifyBackend() {
        if (!hash || !userId || !metadataId || Alltags.length === 0) return;

        try {
            const response = await axios.post("/api/campaign/success", {
                userId,
                transactionHash: hash,
                metadataId,
                tags: Alltags
            });
        
            if (response.data.campaignId) {
                setNotification({ msg: response.data.msg, type: "success" });
                router.push(`/campaigns?campaignId=${response.data.campaignId}`);
            }
        } catch (err) {
            console.error("Backend API Error:", err);
            setErrorMessage("Failed to update campaign data. Please contact support.");
            setNotification({ msg: "Failed to update campaign data.", type: "error" });
        }
    }

    useEffect(() => {
        if (isConfirmed && hash) {
            notifyBackend();
        }
    }, [isConfirmed, hash]);

    useEffect(() => {
        if (error) {
            setErrorMessage((error as BaseError).shortMessage || error.message);
        }
    }, [error]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full flex flex-col justify-center items-center"
    >
      {!userId ? (
        <Loading1 />
      ) : (
        <motion.div 
          variants={containerVariants}
          className="w-full flex flex-col gap-4 justify-center items-center"
        >
          <motion.div 
            variants={itemVariants}
            className="w-full relative"
          >
            <Button
              label={isPending ? "Creating..." : isConfirming ? "Confirming..." : "Start Campaign"}
              onClick={handleCreateNewContract}
              className={`${isPending || isConfirmed || isConfirming ? "opacity-80" : ""} w-full relative overflow-hidden group`}
              disabled={isPending || isConfirmed || isConfirming}
              variant="goldenGlow"
              size="large"
            />
            
            {/* Animated progress indicator */}
            {(isPending || isConfirming) && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: isConfirming ? "70%" : "40%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500"
              />
            )}
          </motion.div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={errorVariants}
                className="w-full overflow-hidden"
              >
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                      {error && (
                        <div className="mt-2">
                          <button 
                            onClick={() => setShowErrorDetails(!showErrorDetails)}
                            className="text-xs text-red-600 underline hover:text-red-800"
                          >
                            {showErrorDetails ? "Hide details" : "Show details"}
                          </button>
                          
                          <AnimatePresence>
                            {showErrorDetails && (
                              <motion.pre
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto"
                              >
                                {JSON.stringify(error, null, 2)}
                              </motion.pre>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isConfirming && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sky-600 font-medium"
              >
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Waiting for confirmation...
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isConfirmed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-green-600 font-medium"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Campaign Creation Successful
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {hash && !errorMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-500 mt-1"
              >
                <span className="font-medium">TX:</span> {hash.slice(0, 6)}...{hash.slice(-4)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};