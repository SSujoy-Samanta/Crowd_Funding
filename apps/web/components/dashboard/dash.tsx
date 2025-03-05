"use client";
import React, { useState, useEffect } from 'react';
import {Check,DollarSign,PieChart,Target,Vote,Wallet,Award,TrendingUp,Users,Calendar, Landmark,} from 'lucide-react';
import { StatCard } from './StatCard';
import { CampaignCard } from './CampaignCard';
import { StatusBadge } from './StatusBadge';
import { AnimatedProgressBar } from './AnimatedBar';
import { WithdrawalTimeline } from './WithdrawalTimeline';
import { GlassmorphicCard } from './GlassmorphicCard';
import { useRouter } from 'next/navigation';
import { DonutChart } from './DonutChart';
import { FaEthereum, FaFileContract, FaWallet } from 'react-icons/fa';
import {  DashboardData } from '@/utils/dashboard';
import WithDrawFund from '../withdraw/Withdraw';
import VerticalVoteBarChart from './BarChart';



export const CampaignDashboard = ({campaignData}:{
  campaignData:DashboardData
}) => {

  const [selectedCampaign, setSelectedCampaign] = useState<any>(campaignData.campaigns[0]);
  const [showContent, setShowContent] = useState(false);
  const router=useRouter();
  const [withdraw,setWithdraw]=useState<boolean>(false);
  const [chart,setChart]=useState<boolean>(false);
  
  useEffect(() => {
    setShowContent(true);
  }, []);

  // Calculate voting percentage if active
  const votingPercentage = selectedCampaign.votingStatus === 'completed' ? 100 : 
    selectedCampaign.votingStatus === 'ongoing' ? Math.round((selectedCampaign.totalVotes / selectedCampaign.backers) * 100) : 0;
  
  return (
    <div className="min-h-screen bg-none p-6">
      <div className="max-w-6xl mx-auto">
        <div className={`transform transition-all duration-1000 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl font-bold text-gray-300 mb-2">Campaign Dashboard</h1>
          <p className="text-gray-400 mb-10">Monitor and manage your fundraising campaigns</p>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className={`transform transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
            <StatCard 
              title="Active Campaigns" 
              value={campaignData.activeCampaigns.toString()} 
              IconComponent={PieChart} 
              bgGradient="bg-gradient-to-br from-blue-500 to-indigo-600"    
            />
          </div>
          
          <div className={`transform transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
            <StatCard 
              title="Completed Campaigns" 
              value={campaignData.completedCampaigns.toString()} 
              IconComponent={Check} 
              bgGradient="bg-gradient-to-br from-green-500 to-emerald-600"
            />
          </div>
          
          <div className={`transform transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
            <StatCard 
              title="Total Funds Raised" 
              value={`$${parseInt(campaignData.totalRaised)}`} 
              IconComponent={Landmark} 
              bgGradient="bg-gradient-to-br from-purple-500 to-pink-600"
              originalValue={parseFloat(campaignData.totalRaised)}
    
            />
          </div>
          
          <div className={`transform transition-all duration-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
            <StatCard 
              title="Pending Withdrawals" 
              value={`$${parseInt(campaignData.pendingWithdrawals)}`} 
              IconComponent={Wallet} 
              bgGradient="bg-gradient-to-br from-yellow-400 to-orange-500"
              originalValue={parseFloat(campaignData.pendingWithdrawals)}
            />
          </div>
        </div>
        
        {/* Campaign Selector */}
        <div className={`bg-white rounded-xl shadow-xl p-6 mb-10 transform transition-all duration-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Campaigns</h2>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors" onClick={()=>{router.push('/campaign/start')}}>
              + New Campaign
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaignData.campaigns.map(campaign => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign}
                isSelected={selectedCampaign.id === campaign.id}
                onClick={() => setSelectedCampaign(campaign)}
              />
            ))}
          </div>
        </div>
        
        {/* Selected Campaign Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Stats */}
          <div className={`lg:col-span-2 transform transition-all duration-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
            <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCampaign.name}</h2>
                  <p className="text-gray-500">{selectedCampaign.category}</p>
                </div>
                <StatusBadge status={selectedCampaign.status} type="campaign" />
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700 flex items-center">
                    <Target size={18} className="mr-2 text-indigo-600" />
                    Fundraising Progress
                  </h3>
                </div>
                <AnimatedProgressBar 
                  raised={selectedCampaign.raised} 
                  goal={selectedCampaign.goal} 
                />
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Backers</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{selectedCampaign.backers}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Result</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{selectedCampaign.status}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Avg. Donation</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">${Math.round(selectedCampaign.raised / selectedCampaign.backers)}</p>
                  </div>
                </div>
              </div>
              <div className='text-black flex justify-between items-center w-full p-2 mb-2'>
                <div className='flex justify-center items-center gap-2'>
                  <FaWallet size={20} className='text-amber-600'/>
                  <p>Wallet: {selectedCampaign.wallet.slice(0,5)+"..."+selectedCampaign.wallet.slice(-5)}</p>
                </div>
                <div className='flex justify-center items-center gap-2'>
                  <FaFileContract size={20} className='text-blue-600'/>
                  <p>Contract: {selectedCampaign.contract.slice(0,5)+"..."+selectedCampaign.contract.slice(-5)}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700 flex items-center">
                    <Vote size={18} className="mr-2 text-indigo-600" />
                    Voting Status
                  </h3>
                  <StatusBadge status={selectedCampaign.votingStatus} type="voting" />
                </div>
                
                <div className="flex items-center mt-4">
                  <div className="w-1/3">
                  <DonutChart percentage={votingPercentage} />
                  </div>
                  <div className="flex-grow ml-6">
                    <p className="text-gray-700 font-medium">
                      {selectedCampaign.votingStatus === 'active' ? 
                        `${selectedCampaign.totalVotes} votes cast so far` : 
                        selectedCampaign.votingStatus === 'completed' ? 
                          `Final count: ${selectedCampaign.totalVotes} votes` : 
                          'Voting will begin once the campaign reaches 30% of its goal'}
                    </p>
                    
                    {selectedCampaign.votingStatus === 'active' && (
                      <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-1000"
                          style={{ width: `${votingPercentage}%` }}
                        ></div>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedCampaign.votingStatus === 'active' ? 
                        'Voting in progress - proposal needs 51% approval' : 
                        selectedCampaign.votingStatus === 'completed' ? 
                          'Voting completed successfully' : 
                          'Voting not yet started'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 flex items-center mb-2">
                  <Wallet size={18} className="mr-2 text-indigo-600" />
                  Withdrawal Status
                </h3>
                
                {Number(selectedCampaign.withdrawals.amount ) > 0 ? (
                  <WithdrawalTimeline withdrawals={selectedCampaign.withdrawals} />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center mt-4">
                    <p className="text-gray-500">No withdrawals made yet</p>
                    <button className="mt-2 text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors">
                      Request First Withdrawal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className={`transform transition-all duration-700 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
            <GlassmorphicCard glowColor="bg-indigo-500" className="mb-8">
              <h2 className="text-xl font-bold text-gray-200 mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <button className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5" onClick={()=>{
                  setWithdraw(x=>!x);
                }}>
                  {/* <DollarSign className="mr-2" size={18} /> */}
                  <FaEthereum className="mr-2" size={18}/>
                  Request Withdrawal
                </button>
                
                <button className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-bl from-slate-900 to-blue-600 transition-colors hover:from-slate-800 hover:to-blue-700 " onClick={()=>{
                    setChart(x=>!x)
                  }}>
                  <PieChart className="mr-2" size={18} />
                  View Detailed Analytics
                </button>
                
                <button className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors">
                  <Vote className="mr-2" size={18} />
                  Manage Voting
                </button>
              </div>
            </GlassmorphicCard>
            
            <GlassmorphicCard glowColor="bg-purple-500">
              <h3 className="font-bold text-gray-300 mb-4 flex items-center">
                <Award size={18} className="mr-2 text-purple-600" />
                Campaign Insights
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">Top Performing</p>
                    <p className="text-sm text-gray-400">In the top 10% of similar campaigns</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">High Engagement</p>
                    <p className="text-sm text-gray-400">112% more backers than average</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <Calendar size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-200">Peak Time</p>
                    <p className="text-sm text-gray-400">Most backers join between 2-4pm</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button className="w-full text-center text-indigo-400 font-medium hover:text-indigo-600 transition-colors">
                    View Full Report
                  </button>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        </div>
        {withdraw && <div className='flex justify-center items-center absolute z-20 top-0 left-0 bg-opacity-25 bg-slate-500  w-full h-full'><WithDrawFund setWithdraw={setWithdraw} contractAddress={selectedCampaign.contract}/></div>}
        {chart && <div className='flex justify-center items-center absolute z-20 top-0 left-0 bg-opacity-25 bg-slate-500  w-full h-full text-black'><VerticalVoteBarChart setChart={setChart} total={selectedCampaign.totalVotes}
        yes={selectedCampaign.yesVote} no={selectedCampaign.noVote}/></div>}
      </div>
      
    </div>
  );
};

export default CampaignDashboard;