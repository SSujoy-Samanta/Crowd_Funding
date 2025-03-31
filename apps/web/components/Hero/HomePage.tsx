"use client"
import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Check, AlertTriangle, Zap, Plus } from 'lucide-react';
import Button from '../Buttons/buttons';
import { useRouter } from 'next/navigation';
import CauseCircles from './Img';

const HomePage = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const router=useRouter();
    const [featuredCampaigns, setFeaturedCampaigns] = useState([
        {
            id: 1,
            title: "Decentralized Education Platform",
            description: "Creating accessible blockchain education for communities worldwide",
            goal: 25,
            raised: 18.7,
            backers: 126,
            daysLeft: 14,
            image: "/web3.jpg"
        },
        {
            id: 2,
            title: "Sustainable Energy Marketplace",
            description: "Connecting green energy producers with consumers through smart contracts",
            goal: 40,
            raised: 32.5,
            backers: 213,
            daysLeft: 9,
            image: "/energy.jpg"
        },
        {
            id: 3,
            title: "Community Art Collective",
            description: "Supporting digital artists through decentralized patronage",
            goal: 15,
            raised: 6.2,
            backers: 78,
            daysLeft: 21,
            image: "/art.avif"
        }
    ]);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen text-white">
            {/* Animated Header Section */}
            <header className={`relative overflow-hidden h-screen flex items-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center mix-blend-overlay"></div>
                </div> */}
                
                
                {/* Hero Content */}
                <div className="container mx-auto justify-center items-start flex px-8 relative z-10 w-4/6">
                    <div className="w-full text-center flex flex-col justify-center items-center pt-6 ">
                        <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 transition-transform duration-1000 ${isLoaded ? 'translate-y-0' : 'translate-y-10'} text-center`}>
                            Decentralized Crowdfunding on <span className='bg-gradient-to-r from-blue-700 to-indigo-700 shadow-md hover:from-blue-600 hover:to-indigo-700  bg-clip-text text-transparent '>Ethereum</span>
                        </h1>
                        <p className={`text-xl text-indigo-100 mb-8 transition-transform duration-1000 delay-100 ${isLoaded ? 'translate-y-0' : 'translate-y-10'} w-4/6 text-slate-400`}>
                        Create campaigns, contribute ETH, and participate in transparent governance through blockchain voting
                        </p>
                        <div className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 transition-transform duration-1000 delay-200 ${isLoaded ? 'translate-y-0' : 'translate-y-10'}`}>
                            <button className="px-3 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md hover:from-purple-600 hover:to-pink-700 focus:ring-purple-400 font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center" onClick={()=>{router.push('/campaign/start')}}>
                                <Plus className="mr-2" size={20} />
                                Create Campaign
                            </button>
                           
                            <Button label='Explore Campaigns' onClick={()=>{router.push('/campaigns')}} variant='emeraldShine'/>
                            <Button label='Your Contributions' onClick={()=>{router.push('/contribution')}} variant='goldenGlow'/>
                        </div>
                    </div>
                  
                </div>
                
                {/* Animated Stats */}
                <div className={`absolute bottom-8 left-0 right-0 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="container mx-auto px-8">
                        <div className="bg-gradient-to-b from-blue-700/20 via-transparent to-transparent bg-opacity-10 backdrop-blur-lg rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">14K+</p>
                                <p className="text-indigo-200 mt-2">Active Campaigns</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">85K+</p>
                                <p className="text-indigo-200 mt-2">Contributors</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">15K+</p>
                                <p className="text-indigo-200 mt-2">Total Funded <b>( ETH )</b></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='absolute -top-5 h-full w-full'>
                    <CauseCircles/>
                </div>
            </header>

            {/* Featured Campaigns */}
            <section className="py-20 px-8" id="explore">
                <div className="container mx-auto">
                <div className="text-center mb-12 flex flex-col justify-center items-center">
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-500 p-1 bg-clip-text text-transparent">Featured Campaigns</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Discover innovative projects from around the Ethereum ecosystem that are seeking funding right now</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredCampaigns.map((campaign, index) => (
                    <div 
                        key={campaign.id} 
                        className="bg-gradient-to-br from-slate-800/40  to-slate-500/30  rounded-xl shadow-md overflow-hidden hover:shadow-lg  transform hover:-translate-y-1 transition-transform duration-300"
                    >
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24 opacity-60"></div>
                        </div>
                        <div className="p-6">
                        <h3 className="font-bold text-xl mb-2">{campaign.title}</h3>
                        <p className="text-gray-400 mb-4">{campaign.description}</p>
                        
                        <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                            ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-300">
                                <span>{campaign.raised} ETH raised</span>
                                <span>{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between text-sm mb-4">
                            <div className="flex items-center">
                                <Users size={16} className="mr-1 text-amber-500" />
                                <span>{campaign.backers} backers</span>
                            </div>
                            <div className="flex items-center">
                                <TrendingUp size={16} className="mr-1 text-blue-500" />
                                <span>{campaign.goal} ETH goal</span>
                            </div>
                            
                        </div>
                        
                        <button className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors" onClick={()=>{router.push('/campaigns')}}>
                            Contribute ETH
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                
                <div className="text-center mt-12">
                    <button className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-500 hover:bg-opacity-30 transition-colors" onClick={()=>{router.push('/campaigns')}}>
                    View All Campaigns
                    </button>
                </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-8 " id="how-it-works">
                <div className="container mx-auto">
                <div className="text-center mb-12 flex flex-col justify-center items-center ">
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-600  shadow-md  bg-clip-text text-transparent ">How It Works</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Our transparent, blockchain-powered crowdfunding platform ensures safety and accountability</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-t from-black/80  to-blue-800/50 p-8 rounded-xl shadow-lg text-center shadow-blue-800 transition-transform ease-in-out duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus size={24} className="text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Create Campaign</h3>
                        <p className="text-gray-400">Set your funding goal in ETH, campaign duration, and describe your project with rich media</p>
                    </div>
                    
                    <div className="bg-gradient-to-t from-black/80  to-blue-800/50 p-8 rounded-xl shadow-lg  text-center shadow-blue-800 transition-transform ease-in-out duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users size={24} className="text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Receive Contributions</h3>
                        <p className="text-gray-400">Contributors send ETH directly to your smart contract with full transparency</p>
                    </div>
                    
                    <div className="bg-gradient-to-t from-black/80  to-blue-800/50 p-8 rounded-xl shadow-lg  text-center shadow-blue-800 transition-transform ease-in-out duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={24} className="text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Governance Voting</h3>
                        <p className="text-gray-400">Funds are released only when 51% of contributors approve your withdrawal requests</p>
                    </div>
                </div>
                
                <div className="mt-16 bg-gradient-to-r from-red-500/80 via-pink-500/80 to-rose-500/80 p-8 rounded-xl shadow-xl">
                    <div className="flex flex-col md:flex-row items-center">
                    <div className="mb-6 md:mb-0 md:mr-8">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                         <AlertTriangle size={24} className="text-amber-600" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-slate-200">Contributor Protection</h3>
                        <p className="text-black font-bold">If a withdrawal request does not receive majority approval, contributors can manually claim a refund by interacting with the contract.</p>
                    </div>
                    </div>
                </div>
                </div>
            </section>

            {/* Start a Campaign */}
            <section className="py-20 px-8" id="start">
                <div className="container mx-auto relative ">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-12 text-center h-72 blur-2xl"></div>
                    <div className='absolute text-center z-20 top-0 flex justify-center items-center flex-col w-full h-full'>
                        <h2 className="text-3xl font-bold text-white mb-6">Ready to Launch Your Project?</h2>
                        <p className="text-slate-300 max-w-2xl mx-auto mb-8">Join hundreds of innovators who have successfully funded their projects through our decentralized platform</p>
                        <Button label='Start Your Campaign' onClick={()=>{router.push("/campaign/start")}} variant='sunsetGlow' size='large'/>
                    </div>
                </div>
            </section>
            
        
        </div>
    );
};

export default HomePage;