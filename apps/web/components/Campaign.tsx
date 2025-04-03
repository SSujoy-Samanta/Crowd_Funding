"use client";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { FaWpexplorer } from "react-icons/fa";
import { LineProgress } from "./Progress/LineProgress";
import { SearchBox } from "./Search";
import { useState } from "react";
interface CampaignContents {
    id: number;
    metadata: {
        title: string;
        category: string;
        goal: string;
        imageUrl: string | null;
        tags: string[];
        country: string;
        state: string;
    };
    Goal: string;
    raised:string;
    user: {
        username: string;
    };
}

interface Props {
  campaigns: CampaignContents[];
}

export const AllCampaigns = ({ campaigns }:Props) => {
    const [data, setData] = useState<CampaignContents[]>(campaigns);
    function ParseAmount(amount:string){
        return  amount && Number(amount)? parseFloat(ethers.formatEther(amount.toString())): 0;
    } 
    
    function Precentage(a:string,b:string){
        const val1=ParseAmount(a);
        const val2=ParseAmount(b);
        const res= (val1/val2)*100

        return res>=100?100:res;
    }
    return (
        <section
        id="projects"
        className=" px-8 text-white pb-10"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-center items-center gap-1 flex-col">
                    <p className="text-xl text-white font-bold">Browse All Campaigns</p>
                    <p className="font-bold text-slate-500">Find fundraisers by person's name, country, tag or title.</p>
                    <div className="p-8 w-4/6 flex justify-center items-center">
                        <SearchBox campaigns={campaigns} setData={setData}/>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    
                    {data.length==0?
                        <div className="felx justify-center items-center font-bold md:col-span-2 lg:col-span-3"><p className="text-gray-500 text-center">No results found</p></div>
                    :
                    data.map((campaign, index) => (
                    <motion.div
                        key={campaign.id} // Use a unique key
                        className="relative overflow-hidden bg-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        { (
                            <img
                                src={campaign.metadata.imageUrl||'/health.jpeg'}
                                alt={campaign.metadata.title || "Campaign Image"}
                                className="w-full h-52 aspect-auto object-cover p-1 opacity-80 rounded-md"
                            />
                        )}

                        <div className="p-5 space-y-3 h-full">
                            <div className="flex flex-col gap-0.5">
                                <h3 className="text-2xl font-semibold text-teal-300">
                                    {campaign.metadata.title || "Web3 Croud fund"}
                                </h3>
                                <p className="text-slate-400 pl-2">
                                    by {campaign.user.username} 
                                </p>
                            </div>
                            {/* Goal Display */}
                            {campaign.Goal ? (
                                <p className="text-white">
                                    <span className="text-sky-500 font-bold">Goal:</span> {ethers.formatEther(campaign.Goal.toString())} ETH
                                </p>    
                            ):
                                <p className="text-white">
                                    <span className="text-sky-500 font-bold">Goal:</span> {campaign.metadata.goal} ETH
                                </p>
                            }
                            <div className="flex flex-col gap-2">
                                <LineProgress max={Precentage(campaign.raised,campaign.Goal)}/>
                                <p className="text-white"><span className="font-bold text-amber-500 mr-1">{`${
                                    ParseAmount(campaign.raised)
                                } ETH`}</span>raised</p>
                            </div>

                            {/* Wallet Address */}
                            {/* <p className="text-xs text-gray-400">Wallet: {campaign.walletAddress}</p> */}

                            {/* View Campaign Button */}
                            <p  className="inline-block relative bottom-0 mt-4 text-sm text-teal-400 hover:underline">
                                View Campaign
                            </p>
                        </div>

                        {/* Overlay */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-teal-700 to-transparent opacity-0 hover:opacity-90 transition-opacity duration-300">
                            <div className="flex h-full justify-center mx-auto items-end">
                                <div className="w-full flex justify-around py-2">
                                    {/* Placeholder for Links */}
                                    <a
                                        href={`/campaigns?campaignId=${campaign.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center justify-center p-2 rounded-md bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md hover:from-gray-800 hover:to-black focus:ring-gray-500"
                                    >
                                        <FaWpexplorer size={35}/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>))}
                    
                </div>
        </div>
        </section>
    );
};
