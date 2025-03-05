"use client"

import { ethers } from "ethers"
import { useState } from "react"
import { CiLock } from "react-icons/ci"
import { MdOutlineTravelExplore } from "react-icons/md"
import { Voting } from "../Voting"
import { GiVote } from "react-icons/gi"
import { createPortal } from "react-dom";

interface VotingProps{
    index:number,
    title:string,
    timestamp:Date,
    amount:string,
    campaignId:number,
    contractAddress:string
}
export const VotIngComponents=({
    index,
    title,
    timestamp,
    amount,
    campaignId,
    contractAddress

}:VotingProps)=>{
    const [voting,setVoting]=useState<boolean>(false);
    return <div 
        key={index} 
        className="relative bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-300"
            style={{ 
            animationDelay: `${index * 150}ms`,
            opacity: 0,
            animation: 'fadeSlideIn 0.5s ease forwards'
        }}
    >
        <div className="flex justify-between items-start gap-2">
            <div>
                <h4 className="font-medium text-gray-900 break-words">{title}</h4>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                <CiLock className="h-3 w-3 mr-1" />
                    {new Date(timestamp).toLocaleString()}
                </div>
            </div>
            <div className="text-right">
                <span className="font-semibold text-indigo-600">{ethers.formatEther(amount)} ETH</span>
                <div className="mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700`}>
                        Active
                    </span>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-cyan-700 to-transparent opacity-0 hover:opacity-90 transition-opacity duration-300 rounded-md">
                <div className="flex h-full justify-center mx-auto items-end">
                    <div className="w-full flex justify-around py-2">
                        {/* Placeholder for Links */}
                        <a
                            href={`/campaigns?campaignId=${campaignId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center p-2 rounded-md bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md hover:from-gray-800 hover:to-black focus:ring-gray-500"
                        >
                            <MdOutlineTravelExplore size={25}/>
                        </a>
                        <button className="p-2 font-bold bg-sky-600 rounded-lg" onClick={()=>{setVoting(x=>!x)}}>
                            <GiVote size={25}/>
                        </button>
                    </div>
                    
                    
                </div>
            </div>
        </div>
        {voting && createPortal(
            <div className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <Voting contractAddress={contractAddress} setVoting={setVoting} />
            </div>,
            document.body
        )}

    </div>
}