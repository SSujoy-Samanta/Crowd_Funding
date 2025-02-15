"use client";

import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { CrowdfundingFactoryABI } from "@repo/common/ABI";

export const CreateCampaign = () => {
    const {data: hash, writeContract } = useWriteContract();
    const convertEthToWei = (ethAmount: string) => parseEther(ethAmount);

    async function handleCreateNewContract() {
        try {
            // Send transaction
            writeContract({
                address: "0x8464135c8F25Da09e49BC8782676a84730C318bC",
                abi: CrowdfundingFactoryABI,
                functionName: "createCrowdfunding",
                args: [BigInt(convertEthToWei("2"))],
                value: BigInt(convertEthToWei("0.001")),
            });

            console.log("Transaction sent! Hash:", hash);

            // // Wait for confirmation
            // const receipt = await waitForTransactionReceipt(client,{ hash });

            // if (receipt.status === "success") {
            //     console.log("Transaction confirmed! Contract created.");
            // } else {
            //     console.error("Transaction failed!", receipt);
            // }
        } catch (error) {
            console.error("Transaction error:", error);
        }
    }

    return (
        <div>
            <button
                className="p-2 bg-amber-600 rounded-sm cursor-pointer"
                onClick={handleCreateNewContract} 
            >
                Create
            </button>
        </div>
    );
};
