"use client";

import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { CrowdFundingABI } from "@repo/common/ABI";
import { useState } from "react";

export const ContributeFund = () => {
    const {data: hash, writeContract } = useWriteContract();
    const [amount,setAmount]=useState<string>("0.000000000");
    const convertEthToWei = (ethAmount: string) => parseEther(ethAmount);

    async function handleContributeFund() {
        try {
            // Send transaction
            writeContract({
                address: "0x8398bCD4f633C72939F9043dB78c574A91C99c0A",
                abi: CrowdFundingABI,
                functionName: "creditFund",
                value: BigInt(convertEthToWei(amount)),
            });

            console.log("Transaction sent! Hash:", hash);
            setAmount("0.000000000");

        } catch (error) {
            console.error("Transaction error:", error);
        }
    }

    return (
        <div className="flex flex-col gap-2 w-1/6">
            <label htmlFor="eth">Eth Amount</label>
            <input type="text" value={amount} name="Eth" id="eth" placeholder="Enter amount of ETH" onChange={(e)=>setAmount(e.target.value)} />
            <button
                className="p-2 bg-amber-600 rounded-sm cursor-pointer"
                onClick={handleContributeFund}
                disabled={parseFloat(amount) != 0? false:true}
            >
                Contribute
            </button>
        </div>
    );
};
