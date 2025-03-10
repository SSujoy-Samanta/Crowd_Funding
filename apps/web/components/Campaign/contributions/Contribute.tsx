"use client";

import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Address, parseEther } from "viem";
import { CrowdFundingABI } from "@repo/common/ABI";
import { SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import InputWithIcon from "@/components/Inputs/InputWithIcon";
import { FaEthereum } from "react-icons/fa6";
import {  BiLoader } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { GoMail } from "react-icons/go";
import Button from "@/components/Buttons/buttons";
import { useSetRecoilState } from "recoil";
import { notificationState } from "@/lib/atom";
import axios from "axios";

interface ContributeFundProps{
    ContractAddress:Address,
    setContribute:React.Dispatch<SetStateAction<boolean>>
}
export const ContributeFund = ({ContractAddress,setContribute}:ContributeFundProps) => {
    const {address,isConnected}=useAccount();
    const { data: hash, writeContract, isPending, isError } = useWriteContract();
    const [amount, setAmount] = useState<string>("0.000000000");
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [errorEmail, setErrorEmail] = useState<string>("");
    const [emailSuccess, setEmailSuccess] = useState<string>("");
    const setNotification=useSetRecoilState(notificationState);
    


    const convertEthToWei = (ethAmount: string) => parseEther(ethAmount);


    async function handleContributeFund() {
        setError(""); // Reset error message

        if (parseFloat(amount) <= 0) {
            setError("⚠️ Please enter a valid ETH amount.");
            return;
        }
        
        try {
            
            if(!isConnected){
                setError("⚠️ Please Connect Your Wallet first.");
                return;
            }
            if(!ContractAddress) return;
          

            writeContract({
                address:ContractAddress,
                abi: CrowdFundingABI,
                functionName: "creditFund",
                value: BigInt(convertEthToWei(amount)),
            });

            console.log("Transaction sent! Hash:", hash);
            
           
        } catch (error) {
            setError("⚠️ Transaction failed! Please try again.");
            console.error("Transaction error:", error);
        }
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
    
    const handleEmailSubmit = async() => {
        try {
            if (!email.includes("@")) {
                setErrorEmail("⚠️ Please enter a valid email address.");
                return;
            }
            if(!isConnected){
                setErrorEmail("⚠️ Please Connect Your Wallet first.");
                return;
            }
            const res=await axios.post('/api/campaign/contribution/email',{
                walletAddress:address,
                email,
                contractAddress:ContractAddress
            })
            if(res.status===200){
                setNotification({ msg: res.data.msg, type: "success" });
            }
    
            // Simulate sending email (In real-world, use an API request)
            setEmailSuccess("✅ You will receive voting status updates via email.");
            setErrorEmail(""); // Clear error if email is valid
        } catch (e:any) {
            if (e.response?.data?.errors) {
                setNotification({ msg: e.response?.data?.errors[0]?.message, type: "error" });
            } else {
                setNotification({ msg: e.response?.data?.msg, type: "error" });
            }
        }
    };
    
    useEffect(() => {
        if (isConfirmed && hash) {
            setAmount("0.000000000");
        }
    }, [isConfirmed, hash]);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-4 left-0 p-6 bg-gray-900 text-white rounded-sm shadow-lg absolute top-0 z-30 w-full h-full"
        >
            <div className="p-1 bg-red-400 absolute rounded-md top-2 right-2 cursor-pointer" onClick={()=>{setContribute(x=>!x)}}>
                <RxCross2 size={15}/>
            </div>
            <div className="flex flex-col gap-4 ">
                <div className="flex flex-col gap-2">
                    <label htmlFor="eth" className="text-lg font-semibold">Enter ETH Amount</label>

                    <InputWithIcon 
                        Icon={<FaEthereum size={25} className="text-sky-600"/>}
                        type="text" 
                        input={amount} 
                        name="Eth" 
                        placeholder="Enter amount of ETH" 
                        setInput={setAmount}
                        className="p-2 bg-gray-800 rounded-lg text-white border border-gray-600 focus:outline-none focus:border-amber-400"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <button 
                    onClick={handleContributeFund} 
                    disabled={isPending || parseFloat(amount) <= 0}
                    className={`p-3 bg-amber-500 hover:bg-amber-600 transition-all rounded-lg flex justify-center items-center gap-2 ${isPending || parseFloat(amount) <= 0?"cursor-not-allowed":"cursor-pointer"}`}
                >
                    {isPending ? (
                        <>
                            <BiLoader className="animate-spin w-5 h-5" />
                            Processing...
                        </>
                    ) : (
                        "Contribute"
                    )}
                </button>
                {isConfirming && <div className="text-sky-500 font-bold">Waiting for confirmation...</div>}
                {isConfirmed && <div className="text-green-500 font-bold">Contribution Successful.</div>}
                {isError && <p className="text-red-500 text-sm">⚠️ Transaction failed! Try again.</p>}
               
            </div>
            {/* Voting Information Section */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700 mt-5"
            >
                <h3 className="text-lg font-semibold text-amber-400">🚀 Important Voting Info</h3>
                <p className="text-sm text-gray-300 mt-2">
                    After contributing, you must vote once the total funding goal is reached.
                    Stay updated on your voting status by providing your email below.
                </p>
            </motion.div>

            {/* Email Input Section */}
            <div className="flex flex-col gap-4">
               <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-lg font-semibold">Get Voting Updates</label>
                    <InputWithIcon 
                        Icon={<GoMail size={25} className="text-orange-500"/>}
                        type="email" 
                        input={email} 
                        name="email" 
                        placeholder="Enter your email" 
                        setInput={setEmail}
                        className="p-2 bg-gray-800 rounded-lg text-white border border-gray-600 focus:outline-none focus:border-amber-400"
                    />
                    {errorEmail && <p className="text-red-500 text-sm mt-1">{errorEmail}</p>}
                    {emailSuccess && <p className="text-green-400 text-sm mt-1">{emailSuccess}</p>}
               </div>
                
                <Button
                    label="Subscribe for Updates" 
                    onClick={handleEmailSubmit} 
                    variant="sunsetGlow"
                />
                    
            </div>
        </motion.div>
    );
};
