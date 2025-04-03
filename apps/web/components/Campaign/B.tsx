"use client";

import { SetStateAction, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepStatus } from "./StepStatus";
import { useRecoilState, useSetRecoilState } from "recoil";
import { goalAmountState, notificationState } from "@/lib/atom";
import axios from "axios";

interface BProps {
  setStep: React.Dispatch<SetStateAction<number>>;
  step: number;
  metadataId: number | null;
  userId: number | null;
}

export default function B({ setStep, step, metadataId, userId }: BProps) {
  const [amount, setAmount] = useRecoilState(goalAmountState);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [amountTouched, setAmountTouched] = useState<boolean>(false);
  const [animateSuccess, setAnimateSuccess] = useState<boolean>(false);
  
  const setNotification = useSetRecoilState(notificationState);
  
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  // Sample suggested amounts
  const suggestedAmounts = ["0.5", "1", "2", "5", "10"];

  async function handleSubmit() {
    try {
      if (!userId || !metadataId) {
        setNotification({ 
          msg: "Missing user or metadata information. Please try again.", 
          type: "error" 
        });
        return;
      }

      if (!amount.length) {
        setNotification({ 
          msg: "Please enter a fundraising goal amount.", 
          type: "error" 
        });
        return;
      }
      
      setLoading(true);
      
      const res = await axios.put('/api/campaign/registration/goal', {
        userId,
        metadataId,
        goal: amount
      });
      
      if (res.status === 200) {
        setAnimateSuccess(true);
        setNotification({ 
          msg: "Fundraising goal successfully set!", 
          type: "success" 
        });
        
        // Small delay before moving to next step for animation
        setTimeout(() => {
          handleNext();
        }, 800);
      }
    } catch (e: any) {
      if (e.response?.data?.errors) {
        setNotification({ 
          msg: e.response?.data?.errors[0]?.message, 
          type: "error" 
        });
      } else {
        setNotification({ 
          msg: e.response?.data?.msg || "An error occurred. Please try again.", 
          type: "error" 
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      <motion.div
        className="w-full bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 shadow-2xl rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Animated background effect */}
        <div className="relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
            animate={{ 
              x: ["0%", "100%"],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Left column */}
            <motion.div 
              className="w-full md:w-2/5"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 
                className="text-3xl font-bold text-white mb-4"
                variants={itemVariants}
              >
                Set Your Fundraising Goal
              </motion.h2>
              
              <motion.p 
                className="text-blue-100 mb-6"
                variants={itemVariants}
              >
                Determine how much you need to reach your objectives. A clear goal helps potential donors understand the impact of their contribution.
              </motion.p>
              
              <motion.div
                className="p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 shadow-lg"
                variants={itemVariants}
              >
                <h3 className="text-white font-semibold mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Important Information
                </h3>
                <ul className="space-y-2 text-white/90 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Your goal amount cannot be adjusted after campaign launch
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Blockchain transactions have associated gas fees
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Funds are only released when the campaign ends
                  </li>
                </ul>
              </motion.div>
            </motion.div>
            
            {/* Right column */}
            <motion.div 
              className="w-full md:w-3/5 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/30 shadow-xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <label className="text-lg font-medium text-white mb-2 block">
                  Enter your fundraising target
                </label>
                
                {/* Animated Input Field */}
                <motion.div
                  className={`relative flex items-center border-2 rounded-lg p-4 transition-all duration-300 ${
                    isInputFocused 
                      ? "border-white shadow-lg shadow-cyan-500/20" 
                      : "border-white/50"
                  } bg-white/20 backdrop-blur-md`}
                  animate={isInputFocused ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white text-xl font-medium pr-3">Ξ</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || (Number(value) >= 0 && /^\d*\.?\d*$/.test(value))) {
                        setAmount(value);
                        setAmountTouched(true);
                      }
                    }}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="0.00"
                    className="w-full bg-transparent outline-none text-xl font-semibold text-white placeholder-white/60"
                  />
                  <span className="text-white text-xl font-medium pl-3">ETH</span>
                </motion.div>

                {/* Suggested Amounts */}
                <div className="mt-4">
                  <p className="text-white/90 text-sm mb-2">Suggested amounts:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedAmounts.map((amt) => (
                      <motion.button
                        key={amt}
                        className={`px-4 py-2 rounded-full border text-white transition-all ${
                          amount === amt 
                            ? "bg-white/30 border-white" 
                            : "bg-white/10 border-white/30 hover:bg-white/20"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setAmount(amt);
                          setAmountTouched(true);
                        }}
                      >
                        Ξ {amt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              {/* Web3 Wallet Info */}
              <motion.div
                className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-teal-900/30 rounded-lg text-white/90 text-sm space-y-2"
                variants={itemVariants}
              >
                <p className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Wallet requirements:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-white/80">
                  <li>Non-custodial Web3 wallet (MetaMask, Coinbase Wallet, etc.)</li>
                  <li>Correctly linked to your campaign profile</li>
                  <li>KYC/AML verification may be required depending on your region</li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Step indicator */}
      <StepStatus step={step} />
      {/* Navigation controls */}
      <motion.div 
        className="mt-8 w-full flex justify-between px-4 md:px-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      >
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 hover:bg-white/30 transition-all shadow-md"
          whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </motion.button>
        
        <AnimatePresence>
          <motion.button
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-lg ${
              !amount ? 
                "bg-gray-400/50 text-white/70 cursor-not-allowed" :
                "bg-gradient-to-r from-blue-500 to-cyan-500 text-white cursor-pointer hover:shadow-cyan-500/30"
            }`}
            whileHover={amount ? { scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" } : {}}
            whileTap={amount ? { scale: 0.97 } : {}}
            onClick={handleSubmit}
            disabled={!amount || loading}
            animate={animateSuccess ? { scale: [1, 1.1, 1], backgroundColor: ["#3b82f6", "#10b981", "#3b82f6"] } : {}}
          >
            {loading ? (
              <>
                <motion.div 
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing...
              </>
            ) : (
              <>
                Continue
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </motion.button>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}