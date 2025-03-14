'use client'
import React, { useState, useEffect } from 'react';
import { BiCheckCircle, BiDonateHeart, BiSolidDownvote, BiUpvote, BiWallet } from 'react-icons/bi';
import { CiLock } from 'react-icons/ci';
import { FaArrowRight, FaDollarSign, FaEthereum, FaUsers } from 'react-icons/fa';
import { TbActivity } from 'react-icons/tb';
import { useAccount } from 'wagmi';
import { WalletModalPopUp } from './WalletModalPopup';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '@/lib/atom';
import axios from 'axios';
import { ethers } from 'ethers';
import { GiVote } from 'react-icons/gi';
import { HiReceiptRefund } from "react-icons/hi";
import { MdOutlineTravelExplore } from "react-icons/md";
import { VotIngComponents } from './Voting';
import { ClaimRefund } from './ClaimRefund';

interface Contribution {
    amount: string;
    campaignId: number;
    vote: string;
    refunded: boolean;
    timestamp: Date;
    campaign: {
        metadata: {
            title: string;
        };
        withdrawn: boolean;
        votingStatus: string;
        deployedAddress:string;
        VotingSuccess:boolean
    };
}
interface ALLData{
    totalAmount: string;
    totalContributions: number;
    ongoingVotes: number;
    pendingVotes: number;
    refundedCampaigns: number;
    contributions:Contribution[]
}
export const ContributionDashboard = () => {
  
    const [isLoading, setIsLoading] = useState(false);
    const [contributionData, setContributionData] = useState<ALLData|null>(null);
    const [showContributions, setShowContributions] = useState(false);
    const { address, isConnected ,isConnecting} = useAccount();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const setNotification=useSetRecoilState(notificationState);
    const [menu,setMenu]=useState<"C"|"V"|"R">("C");
    
    const handleConnect = () => {
        setIsModalOpen(true);
    };

    useEffect(()=>{
        if(isConnected==true){
            setIsModalOpen(false);
        }else{
            setShowContributions(false)
        }
       
    },[isConnected])

    useEffect(()=>{
        setShowContributions(false)
    },[address])

    useEffect(() => {
        setIsLoading(isConnecting);
    }, [isConnecting]);

    // Show contributions handler
    const handleShowContributions = async() => {
        setIsLoading(true);
        try {
            if(!address) {
                setNotification({ msg: "Please connect your wallet first.", type: "error" });
                return;
            }
            const res=await axios.get(`/api/campaign/contribution?walletAddress=${address}`)
            if(res.data){
                setContributionData(res.data);
                setShowContributions(true);
            }
            
        } catch (e:any) {
            if (e.response?.data?.errors) {
                setNotification({ msg: e.response?.data?.errors[0]?.message, type: "error" });
            } else {
                setNotification({ msg: e.response?.data?.msg, type: "error" });
            }
        }finally{
            setIsLoading(false);
        }
        
    };

    // Reset view
    const handleReset = () => {
        setShowContributions(false);
        setContributionData(null);
    };


    return (
        <div className={`flex flex-col items-center min-h-screen p-4 ${!showContributions&&'justify-center'}`}>
            <div className={`w-11/12 ${!showContributions?'max-w-md shadow-lg':"mt-24"} bg-white rounded-xl  overflow-x-hidden transition-all duration-500 transform shadow-slate-300`}>
                
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <h1 className="text-2xl font-bold flex items-center">
                        <TbActivity className="mr-2" />
                        Contribution Dashboard
                    </h1>
                    {isConnected && (
                        <div className="mt-2 flex items-center text-sm opacity-90">
                        <BiWallet className="mr-1 h-4 w-4  text-amber-500" />
                        <span>{address?.slice(0, 5) + "..." + address?.slice(-5)}</span>
                        </div>
                    )}
                </div>
                
                {/* Main Content */}
                <div className="p-6">
                    {!isConnected ? (
                        // Wallet connection prompt
                    <div className="flex flex-col items-center text-center">
                        <BiWallet className="h-16 w-16 text-indigo-500 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Connect Your Wallet</h2>
                        <p className="text-gray-600 mb-6">Connect your wallet to view your crowdfunding contributions</p>
                        <button 
                            onClick={handleConnect}
                            disabled={isLoading }
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 flex items-center"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connecting...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Connect Wallet
                                    <FaArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            )}
                        </button>
                        
                    </div>
                ) : !showContributions ? (
                    // After wallet connection, before showing contributions
                    <div className="flex flex-col items-center text-center">
                        <BiCheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Wallet Connected!</h2>
                        <p className="text-gray-600 mb-6">Your wallet has been successfully connected. You can now view your contributions.</p>
                        <button 
                            onClick={handleShowContributions}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 flex items-center"
                        >
                            {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </span>
                            ) : (
                            <span className="flex items-center">
                                Show My Contributions
                                <FaArrowRight className="ml-2 h-4 w-4" />
                            </span>
                            )}
                        </button>
                    </div>
                ) : (
                    // Contributions display
                    <div className="animate-fadeIn">
                    {/* Summary cards */}
                    {contributionData && <div className="grid grid-cols-5 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg text-center hover:scale-105 transition-all duration-300 ease-in-out">
                            <FaEthereum className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="font-bold text-gray-900">{ethers.formatEther(contributionData.totalAmount)}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg text-center hover:scale-105 transition-all duration-300 ease-in-out">
                            <FaUsers className="h-6 w-6 mx-auto text-green-600 mb-1" />
                            <p className="text-sm text-gray-600">Impact</p>
                            <p className="font-bold text-gray-900">{contributionData.totalContributions}</p>
                        </div>

                        <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-3 rounded-lg text-center hover:scale-105 transition-all duration-300 ease-in-out">
                            <GiVote className="h-6 w-6 mx-auto text-sky-500 mb-1" />
                            <p className="text-sm text-gray-600">Voting Ongoing</p>
                            <p className="font-bold text-gray-900">{contributionData.ongoingVotes}</p>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg text-center hover:scale-105 transition-all duration-300 ease-in-out">
                            <BiSolidDownvote className="h-6 w-6 mx-auto text-red-600 mb-1" />
                            <p className="text-sm text-gray-600">Voting Pending</p>
                            <p className="font-bold text-gray-900">{contributionData.pendingVotes}</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg text-center hover:scale-105 transition-all duration-300 ease-in-out">
                            <HiReceiptRefund className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                            <p className="text-sm text-gray-600">Refunded</p>
                            <p className="font-bold text-gray-900">{contributionData.refundedCampaigns}</p>
                        </div>

                    </div>}

                    <div className='flex justify-center items-center py-3 '>
                        <div className='flex justify-center items-center '>
                            <button className='p-2 text-b flex justify-center items-center rounded-l-md w-40 bg-slate-700 gap-2 hover:bg-slate-800 transition-all duration-300 ease-in-out' onClick={()=>{setMenu('C')}}>
                                <BiDonateHeart size={20} />
                                <span>Contribution</span>
                            </button>
                            <button className='p-2 text-b flex justify-center items-center w-40 bg-sky-500 gap-2 hover:bg-sky-700 transition-all duration-300 ease-in-out' onClick={()=>{setMenu('V')}}>
                                <BiUpvote size={20} />
                                <span>Do vote</span>
                            </button>
                            <button className='p-2 text-b flex justify-center items-center rounded-r-md w-40 bg-cyan-500 gap-2 hover:bg-cyan-700 transition-all duration-300 ease-in-out' onClick={()=>{setMenu('R')}}>
                                <HiReceiptRefund size={20} />
                                <span>Refund</span>
                            </button>
                        </div>

                    </div>
                    
                    {/* Contribution list */}
                    <h3 className="font-semibold text-gray-800 mb-4">{menu==="C"?"Your Contributions":menu==='V'?"Voting onging campaigns":"Claim your refund"}</h3>
                    <div className="grid grid-cols-3 gap-3">
                    {contributionData && (
                        <>
                            {menu === "C" && contributionData.contributions.map((contribution, index) => (
                                <div 
                                    key={index} 
                                    className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                                    style={{ 
                                        animationDelay: `${index * 150}ms`,
                                        opacity: 0,
                                        animation: 'fadeSlideIn 0.5s ease forwards'
                                    }}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h4 className="font-medium text-gray-900 break-words">{contribution.campaign.metadata.title}</h4>
                                            <div className="flex items-center mt-1 text-sm text-gray-500">
                                                <CiLock className="h-3 w-3 mr-1" />
                                                {new Date(contribution.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-semibold text-indigo-600">
                                                {ethers.formatEther(contribution.amount)} ETH
                                            </span>
                                            <div className="mt-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    contribution.campaign.withdrawn
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {contribution.campaign.withdrawn ? "Completed" : "Active"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-cyan-700 to-transparent opacity-0 hover:opacity-90 transition-opacity duration-300 rounded-md">
                                            <div className="flex h-full justify-center mx-auto items-end">
                                                <div className="w-full flex justify-around py-2">
                                                    {/* Placeholder for Links */}
                                                    <a
                                                        href={`/campaigns?campaignId=${contribution.campaignId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex flex-col items-center justify-center p-2 rounded-md bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md hover:from-gray-800 hover:to-black focus:ring-gray-500"
                                                    >
                                                        <MdOutlineTravelExplore size={25}/>
                                                    </a>
                                                </div>
                                                
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {menu === "V" && (() => {
                                const votingCampaigns = contributionData.contributions.filter(
                                    (contribution) =>
                                        contributionData.ongoingVotes > 0 &&
                                        contribution.campaign.votingStatus === "OnGoing" &&
                                        !contribution.campaign.VotingSuccess && contribution.vote==="pending"
                                );

                                return votingCampaigns.length > 0 ? (
                                    votingCampaigns.map((contribution, index) => (
                                        <VotIngComponents
                                            key={index}
                                            index={index}
                                            timestamp={contribution.timestamp}
                                            title={contribution.campaign.metadata.title}
                                            amount={contribution.amount}
                                            campaignId={contribution.campaignId}
                                            contractAddress={contribution.campaign.deployedAddress}
                                        />
                                        
                                    ))
                                    
                                ) : (
                                    <p className='font-bold text-gray-700 text-lg'>
                                        There is no campaign available for voting.
                                    </p>
                                );
                                
                            })()}
                            
                            {menu === "R" && (() => {
                                const refundCampaigns = contributionData.contributions.filter(
                                    (contribution) =>
                                        !contribution.campaign.VotingSuccess &&
                                        contribution.campaign.votingStatus === "Completed" &&
                                        !contribution.refunded
                                );

                                return refundCampaigns.length > 0 ? (
                                    refundCampaigns.map((contribution, index) => (
                                        <ClaimRefund
                                            key={index}
                                            index={index}
                                            timestamp={contribution.timestamp}
                                            title={contribution.campaign.metadata.title}
                                            amount={contribution.amount}
                                            campaignId={contribution.campaignId}
                                            contractAddress={contribution.campaign.deployedAddress}
                                        />
                                    ))
                                ) : (
                                    <p className='font-bold text-gray-700 text-lg'>
                                        There is no campaign available for refund.
                                    </p>
                                );
                            })()}
                        </>
                    )}

                        
                    </div>
                    
                    {/* Back button */}
                    <button 
                        onClick={handleReset}
                        className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                    </div>
                )}
                </div>
                
            </div>
            {isModalOpen && <WalletModalPopUp isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>}
            {/* Global style for animation */}
            <style jsx>{`
                @keyframes fadeSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
                }
                .animate-fadeIn {
                animation: fadeIn 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

