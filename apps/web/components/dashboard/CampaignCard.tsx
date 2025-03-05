'use client'
import { ChevronRight } from "lucide-react";
import { AnimatedProgressBar } from "./AnimatedBar";
import { StatusBadge } from "./StatusBadge";
import { useRouter } from "next/navigation";
import { Campaign } from "@/utils/dashboard";


interface CampaignCardProps{
    campaign:Campaign,
    isSelected:boolean,
    onClick:()=>void,
}
export const CampaignCard = ({ campaign, isSelected, onClick }:CampaignCardProps) => {
  const router=useRouter();
    let progressColor;
    
    switch(campaign.category) {
      case 'Environment':
        progressColor = 'from-green-400 to-emerald-500';
        break;
      case 'Technology':
        progressColor = 'from-blue-400 to-indigo-600';
        break;
      case 'Community':
        progressColor = 'from-purple-400 to-violet-600';
        break;
      default:
        progressColor = 'from-blue-400 to-indigo-600';
    }
    
    return (
      <div 
        className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
          isSelected 
            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50' 
            : 'border-gray-100 bg-white'
        }`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-800 text-lg"> {campaign.name.length > 20 ? campaign.name.substring(0, 20) + "..." : campaign.name}</h3>
            <p className="text-gray-500 text-sm">{campaign.category}</p>
          </div>
          <StatusBadge status={campaign.status} type="campaign" />
        </div>
        
        <AnimatedProgressBar 
          raised={parseInt(campaign.raised)} 
          goal={parseInt(campaign.goal)} 
          color={progressColor}
        />
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Backers</p>
            <p className="font-bold text-gray-800">{campaign.backers}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Result</p>
            <p className="font-bold text-gray-800">{campaign.status}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Votes</p>
            <p className="font-bold text-gray-800">{campaign.totalVotes}</p>
          </div>
        </div>
        
        {isSelected && (
          <div className="mt-4 text-center">
            <span className="text-indigo-600 font-medium text-sm flex items-center justify-center" onClick={()=>{
              router.push(`/campaigns?campaignId=${campaign.id}`)
            }}>
              View Details
              <ChevronRight size={16} className="ml-1" />
            </span>
          </div>
        )}
      </div>
    );
};