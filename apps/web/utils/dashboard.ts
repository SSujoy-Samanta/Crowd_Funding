export interface Campaign {
    id: number;
    name: string;
    wallet: string;
    contract: string;
    status: string;
    raised: string; // in ETH format
    goal: string; // in ETH format
    votingStatus: string;
    VotingSuccess:boolean;
    totalVotes: number;
    yesVote:number,
    noVote:number,
    backers: number;
    category: string;
    withdrawals:{
        status:string,
        amount:string,
    } // in ETH format
}
  
export interface DashboardData {
    activeCampaigns: number;
    completedCampaigns: number;
    totalRaised: string; // in ETH format
    pendingWithdrawals: string; // in ETH format
    campaigns: Campaign[];
}