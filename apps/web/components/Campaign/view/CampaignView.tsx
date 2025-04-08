'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { GoPerson } from "react-icons/go";
import Button from "@/components/Buttons/buttons";
import { TfiStatsUp } from "react-icons/tfi";
import { BiDonateHeart } from "react-icons/bi";
import { RiWallet3Line } from "react-icons/ri";
import { FaEthereum } from "react-icons/fa6";
import { GiWorld } from "react-icons/gi";
import { Description } from "./Description";
import { SocialMedia } from "./SocialMedia";
import { CircleBar } from "./CircleBar";
import { useFundingRaised } from "@/hook/FundRaised";
import { useCampaignGoal } from "@/hook/campaignGoal";
import { Address, isAddress } from "viem";
import { ethers } from "ethers";
import { ContributeFund } from "../contributions/Contribute";
import ContributorsModal from "./ContributionModal";
import CommentSection from "./Comments";

interface Metadata {
    title: string;
    description: string;
    category: string;
    goal: string;
    imageUrl: string | null;
    country: string;
    state: string;
}
interface Contributors{
    walletAddress: string;
    amount: string;
    timestamp:Date
}
interface Comments{
    wallet:string,
    comment:string,
    timestamp:Date
}

interface User {
    username: string;
}

interface Campaign {
    id:number;
    user: User;
    walletAddress: string | null;
    Goal: string;
    raised:string;
    deployedAddress: string | null;
    transactionHash: string;
    metadata: Metadata;
    contributors:Contributors[],
    comments:Comments[]
}


export const FundraiserCard = ({campaign}:{
    campaign:Campaign
}) => {
    const [contribute,setContribute]=useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const shareCampaign = (platform: string) => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent("Support this important cause!");
        const links: Record<string, string> = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            whatsapp: `https://api.whatsapp.com/send?text=${title}+${url}`,
            x: `https://x.com/intent/tweet?url=${url}&text=${title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };
        window.open(links[platform], "_blank");
    };
    const Goal = campaign.Goal && Number(campaign.Goal) > 0? parseFloat(ethers.formatEther(BigInt(campaign.Goal.toString()))): 0;

    const Raised = campaign.raised  && Number(campaign.raised) > 0? parseFloat(ethers.formatEther(BigInt(campaign.raised.toString()))): 0;

    const rawAddress: string | null = campaign?.deployedAddress;

    // Validate the string before casting it as an Address
    const validAddress: Address | null = rawAddress && isAddress(rawAddress) ? (rawAddress as Address) : null;

    const raisedEth = useFundingRaised(validAddress ?? "0x0000000000000000000000000000000000000000"); 

    const CampaignGoal=useCampaignGoal(validAddress ?? "0x0000000000000000000000000000000000000000");

    const percentage= (raisedEth && CampaignGoal)?(raisedEth/CampaignGoal)*100:(Raised/Goal)*100;
    const totalContribution = campaign.contributors.length;
    const highestContributor = campaign.contributors.reduce(
        (maxContributor, c) => {
          const amount = BigInt(c.amount||0); 
          return amount > maxContributor.amount
            ? { user: c.walletAddress, amount } 
            : maxContributor;
        },
        { user: "" as string, amount: BigInt(0) }
    );
      
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28 justify-center p-2 pt-16 sm:pt-20 md:pt-24 lg:pt-28 flex flex-col md:flex-row gap-6 h-auto md:max-h-screen overflow-y-auto scrollbar-hide">
            
            {/* Left Side (Image + Title) */}
            <div className="w-full md:w-3/5 lg:w-2/3 flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-bold mt-4">
                    {campaign.metadata.title}
                </h2>
                <img
                    src={campaign.metadata.imageUrl||"/health.jpeg"}
                    alt={campaign.metadata.category}
                    className="w-full rounded-lg shadow-md h-56 sm:h-64 md:h-72 lg:h-96 object-cover shadow-slate-500"
                />
                <div className="pl-2 sm:pl-4">
                    <div className="flex justify-start items-center text-center my-3 gap-2">
                        <div className="p-1.5 sm:p-2 rounded-full flex justify-center items-center bg-slate-500">
                            <GoPerson size={16} className="text-amber-500 sm:text-lg md:text-xl"/>
                        </div>
                        <div>
                            <p className="text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base md:text-lg"><b>{campaign.user.username}</b> is organizing this fundraiser.</p>
                        </div>
                    </div>
                    <hr className="my-3 sm:my-5 mr-4 sm:mr-12 md:mr-24"/>
                    {campaign.deployedAddress && 
                        <>
                            <div className="flex justify-start items-center text-center my-3 gap-2">
                                <div className="p-1.5 sm:p-2 rounded-full flex justify-center items-center bg-slate-500">
                                    <FaEthereum size={16} className="text-blue-800 sm:text-lg md:text-xl"/>
                                </div>
                                <div>
                                    <p className="text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base md:text-lg"><b>Contract Address:</b> {campaign.deployedAddress.slice(0,6)+"..."+campaign.deployedAddress.slice(-7)}</p>
                                </div>
                            </div>
                            <hr className="my-3 sm:my-5 mr-4 sm:mr-12 md:mr-24"/>
                        </>
                    }
                    
                    <Description text={campaign.metadata.description}/>
                    <hr className="my-3 sm:my-5 mr-4 sm:mr-12 md:mr-24"/>
                    <CommentSection id={campaign.id} comments={campaign.comments}/>
                </div>
                
            </div>

            {/* Right Side (Donation Info) - Fixed on smaller screens */}
            <div className="w-full md:w-2/5 lg:w-1/4 bg-white p-3 sm:p-4 rounded-lg shadow-lg shadow-gray-500 mt-6 md:mt-14 md:sticky md:top-0 md:h-fit relative">
                <div className="flex items-center justify-between p-1 sm:p-2">
                    <div className="flex flex-col gap-1">
                        <div className="text-xl sm:text-2xl font-bold text-black">{raisedEth || Raised } ETH</div>
                        <p className="text-black text-lg sm:text-2xl font-bold">raised </p>
                        <p className="text-gray-600 text-sm sm:text-base"><b>{CampaignGoal|| Goal || campaign.metadata.goal} Eth</b> goal</p>
                    </div>
                    <div>
                        <CircleBar max={percentage>=100?100:percentage} />
                    </div>
                </div>
                
                {/* Buttons */}
                <div className="mt-3 sm:mt-4 space-y-2 p-1 sm:p-2 flex flex-col">
                    <Button label="Contribute Now" variant="goldenGlow" onClick={()=>{setContribute(x=>!x)}}/>
                    <Button label="Share" onClick={() => shareCampaign("facebook")} variant="blueOcean"/>
                </div>
                {contribute && validAddress && <ContributeFund ContractAddress={validAddress} setContribute={setContribute}/>}
                
                <div className="flex gap-2 items-center justify-start my-3 sm:my-4 pl-2 sm:pl-4">
                    <div className="p-1.5 sm:p-2 rounded-full flex justify-center items-center bg-fuchsia-500">
                        <TfiStatsUp size={20} className="text-slate-700 sm:text-2xl"/>
                    </div>
                    <div>
                        <p className="text-slate-600 text-sm sm:text-base md:text-lg"><b>{totalContribution}</b> people donated</p>
                    </div>
                </div>
                
                <div className="flex gap-2 items-center justify-start my-3 sm:my-4 pl-2 sm:pl-4">
                    <div className="p-1.5 sm:p-2 rounded-full flex justify-center items-center bg-teal-300">
                        <GiWorld size={20} className="text-blue-500 sm:text-2xl"/>
                    </div>
                    <div className="flex flex-col justify-start gap-0.5">
                        <p className="text-slate-600 text-sm sm:text-base md:text-lg">{campaign.metadata.state}, {campaign.metadata.country}</p>
                    </div>
                </div>
                
                <div className="flex gap-2 items-center justify-start my-3 sm:my-4 pl-2 sm:pl-4">
                    <div className="p-1.5 sm:p-2 rounded-full flex justify-center items-center bg-gray-300">
                        <BiDonateHeart size={20} className="text-slate-700 sm:text-2xl"/>
                    </div>
                    <div className="flex flex-col justify-start gap-0.5">
                        <p className="text-slate-600 text-sm sm:text-base md:text-lg">{highestContributor.user.slice(0,5)+"..."+highestContributor.user.slice(-5)}</p>
                        <div className="flex gap-1 justify-start items-center">
                            <b className="text-amber-500 text-sm sm:text-base">{highestContributor.amount>BigInt(0)?ethers.formatEther(highestContributor.amount): 0} ETH</b>
                            <p className="text-xs sm:text-sm hover:underline hover:text-blue-500 text-slate-400">top donation</p>
                        </div>
                    </div>
                </div>
                
                {campaign.walletAddress && 
                    <div className="flex gap-2 items-center justify-start my-3 sm:my-4 pl-2 sm:pl-4">
                        <div className="p-1.5 sm:p-2 rounded-full flex justify-center items-center bg-amber-300">
                            <RiWallet3Line size={20} className="text-slate-700 sm:text-2xl"/>
                        </div>
                        <div>
                            {<p className="text-slate-600 text-sm sm:text-base md:text-lg">
                                <b>{campaign.walletAddress.slice(0, 5) + "..." + campaign.walletAddress.slice(-5)}</b>
                            </p>}
                        </div>
                    </div>
                }

                {/* Social Icons */}
                <SocialMedia text={campaign.metadata.title}/>

                <div className="flex justify-center items-center w-full mt-4 sm:mt-6 px-2">
                    <Button 
                        label="See Donors" 
                        onClick={()=>{setIsModalOpen(x=>!x)}} 
                        variant="emeraldShine" 
                        className="w-full" 
                        disabled={campaign.contributors.length===0}
                    />
                </div>
                
                <ContributorsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    contributors={campaign.contributors}
                />
            </div>
        </motion.div>
    );
};