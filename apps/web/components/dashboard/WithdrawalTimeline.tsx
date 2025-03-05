'use client'
import { Check, Clock } from "lucide-react";

interface WithdrawalTimelineProps {
  status: string;
  amount: number;
}

export const WithdrawalTimeline = ({ withdrawals }: { withdrawals: WithdrawalTimelineProps }) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="relative">
        <div className="flex items-center justify-center">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center mr-4 z-10 ${
            withdrawals.status === 'completed' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-yellow-100 text-yellow-600'
          }`}>
            {withdrawals.status === 'completed' ? <Check size={16} /> : <Clock size={16} />}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 flex-grow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">{withdrawals.amount} Eth</p>
                
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                withdrawals.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {withdrawals.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
