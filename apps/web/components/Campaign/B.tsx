"use client";

import { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { StepStatus } from "./StepStatus";
import { Tags } from "./Tags";
import { useRecoilState, useSetRecoilState } from "recoil";
import { goalAmountState, notificationState } from "@/lib/atom";
import axios from "axios";

interface BProps{
  setStep:React.Dispatch<SetStateAction<number>>;
  step:number;
  metadataId:number|null;
  userId:number|null
}
export default function B({setStep,step,metadataId,userId}:BProps) {
  const [amount, setAmount] = useRecoilState(goalAmountState);
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const setNotification = useSetRecoilState(notificationState);
  const [loading, setLoading] = useState<boolean>(false);
  async function handelSubmit() {
    try {
      if (!userId || !metadataId) return;

      if (!amount.length) {
        setNotification({ msg: "Please select your country.", type: "error" });
        return;
      }
      setLoading(true);
      const res=await axios.put('/api/campaign/registration/goal',{
        userId,
        metadataId,
        goal:amount
      })
      if(res.status==200){
        handleNext();
      }
    } catch (e:any) {
      if (e.response?.data?.errors) {
        setNotification({ msg: e.response?.data?.errors[0]?.message, type: "error" });
      } else {
        setNotification({ msg: e.response?.data?.msg, type: "error" });
      }
    } finally {
      setLoading(false); 
    }
  }
 
  return (
    <>
      <motion.div
        className="w-full bg-gradient-to-bl from-green-600 via-cyan-600 to-teal-600  shadow-lg rounded-md p-10 space-y-6 flex justify-between gap-10 px-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-center items-start flex-col gap-2 w-3/6">
            {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-800">
            How much would you like to raise?
          </h2>

          {/* Description */}
          <p className="text-fuchsia-600 font-bold text-sm break-words">
            Your fundraising goal can't be adjusted anytime. Keep in mind that blockchain transactions have associated costs.
          </p>
        </div>

        {/* Label */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium text-gray-900">Your Goal</label>

          {/* Animated Input Field */}
          <motion.div
            className="relative flex items-center border-2 border-gray-300 rounded-lg p-3 focus-within:border-amber-600 transition-all duration-300 bg-slate-700"
            whileFocus={{ scale: 1.02 }}
          >
            <span className="text-white text-lg font-medium pr-2">Ξ</span>
            <input
              type="number"
              value={amount}
              onChange={(e) =>{
                const value = e.target.value;
                if (value === "" || (Number(value) >= 0 && /^\d*\.?\d*$/.test(value))) {
                  setAmount(value);
                }
              }}
              placeholder="Enter target amount"
              className="w-full bg-transparent outline-none text-lg font-semibold text-white placeholder-gray-200"
            />
            <span className="text-white text-lg font-medium pl-2">ETH</span>
          </motion.div>

          {/* Fee Notice (Web3) */}
          <p className="text-sm text-black">
            Please note that blockchain transactions require <span className="text-orange-600 cursor-pointer">gas fees</span>, and smart contract interactions may incur additional costs. Ensure you have sufficient funds in your wallet.
          </p>
          
          {/* Info Box (Web3 Guidelines) */}
          <motion.div
            className="p-4 bg-gray-300 rounded-lg text-sm text-gray-700 space-y-2 my-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-medium">To receive funds raised, please ensure:</p>
            <ul className="list-disc pl-4">
              <li>You have a verified non-custodial Web3 wallet (e.g., MetaMask, Coinbase Wallet)</li>
              <li>Your wallet address is correctly linked to your campaign</li>
              <li>You comply with KYC/AML regulations (if applicable)</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
      <StepStatus step={step}/>
      <motion.div className="absolute bottom-2 flex mt-4 gap-10 items-center justify-between px-20 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <button className="p-2 px-4 bg-gray-700 text-white rounded-lg cursor-pointer" 
        onClick={handleBack}>Back</button>
        <button 
          className={`p-2 px-4 bg-blue-600 text-white rounded-lg ${!amount ? "opacity-50 cursor-not-allowed":"cursor-pointer"}`} 
          onClick={handelSubmit} 
          disabled={!amount}
        >
          {loading?"Loading...":"Next"} 
        </button>
      </motion.div>
    </> 
  );
}
