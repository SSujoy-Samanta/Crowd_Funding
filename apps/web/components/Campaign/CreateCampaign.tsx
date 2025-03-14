"use client";

import { BaseError, useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseEther, type Address } from "viem";
import { CrowdfundingFactoryABI } from "@repo/common/ABI";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { goalAmountState, notificationState, tags } from "@/lib/atom";
import Button from "../Buttons/buttons";
import axios from "axios";
import { useEffect } from "react";
import { Loading1 } from "../Loading/Loading1";
import { useRouter } from "next/navigation";

interface  CreateCampaignProps{
    userId:number|null;
    metadataId:number|null;
}
export const CreateCampaign = ({userId,metadataId}:CreateCampaignProps) => {
 
    const { data: hash, error, isPending, writeContract } = useWriteContract();
    const { isConnected } = useAccount();
    const setNotification = useSetRecoilState(notificationState);
    const goal=useRecoilValue(goalAmountState);
    const Alltags=useRecoilValue(tags);
    const router=useRouter();

    const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address | undefined;
    const convertEthToWei = (ethAmount: string) => parseEther(ethAmount);


    async function handleCreateNewContract() {
        if(Alltags.length===0){
            setNotification({ msg: "Please select relevant tags first.", type: "error" });
            return;
        }
        if (!isConnected) {
            setNotification({ msg: "Connect your wallet first.", type: "error" });
            return;
        }
        if (!FACTORY_ADDRESS) {
            console.error("Factory address is missing.");
            return;
        }
        if (!goal.length) {
            setNotification({ msg: `Goal Amount Must be Grater Than Zero.`, type: "error" });
            return;
        }

        try {
            const tx = writeContract({
                address: FACTORY_ADDRESS,
                abi: CrowdfundingFactoryABI,
                functionName: "createCrowdfunding",
                args: [BigInt(convertEthToWei(goal))],
            });

            //console.log("Transaction Hash:", tx);
        } catch (error) {
            console.error("Transaction error:", error);
        }
    }
     // Hooks should not be inside conditions!
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    async function notifyBackend() {
        if (!hash || !userId || !metadataId || Alltags.length===0) return;

        try {
            const response = await axios.post("/api/campaign/success", {
                userId,
                transactionHash: hash,
                metadataId,
                tags:Alltags
            });
            if(response.data.campaignId){
                // console.log("Backend Response:", response.data);
                setNotification({ msg: response.data.msg, type: "success" });
                router.push(`/campaigns?campaignId=${response.data.campaignId}`);
            }

           
        } catch (err) {
            console.error("Backend API Error:", err);
            setNotification({ msg: "Failed to update campaign data.", type: "error" });
        }
    }

    useEffect(() => {
        if (isConfirmed && hash) {
            notifyBackend();
        }
    }, [isConfirmed, hash]);

    return (
        <div className="flex flex-col justify-center items-center gap-1">
            {!userId ? (
                <Loading1 />
            ) : (
                <div className="flex flex-col gap-2 justify-center items-center">
                    <Button
                        label={isPending ? "Starting..." : "Start Campaign"}
                        onClick={handleCreateNewContract}
                        className={`${isPending || isConfirmed ? "opacity-50 cursor-not-allowed" : ""} w-56`}
                        disabled={isPending || isConfirmed}
                        variant="goldenGlow"
                        size="large"
                    />

                    <div
                        className={`flex flex-col justify-center items-center gap-1 p-2
                        ${hash || isConfirming || isConfirmed || error ? "flex" : "hidden"}`}
                    >
                       
                        {isConfirming && <div className="text-sky-500 font-bold">Waiting for confirmation...</div>}
                        {isConfirmed && <div className="text-green-500 font-bold">Campaign Creation Successful.</div>}
                        {error && (
                            <div className="text-red-500 font-bold">
                                Error: {(error as BaseError).shortMessage || error.message}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
