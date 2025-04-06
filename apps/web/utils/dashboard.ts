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

// Contributor Interface
export interface Contributor {
  id: number;
  campaignId: number;
  walletAddress: string;
  amount: string;
  transactionHash: string[];
  email: string | null;
  vote: string;
  refunded: boolean;
  timestamp: Date;
}

// CampaignMetadata Interface
export interface CampaignMetadata {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  goal: string;
  imageUrl: string | null;
  tags: string[];
  country: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

// Campaign Interface
export interface CAMPAIGN {
  id: number;
  userId: number;
  walletAddress: string | null;
  Goal: string;
  raised: string;
  deployedAddress: string | null;
  VotingSuccess: boolean;
  withdrawn: boolean;
  transactionHash: string;
  votingStatus: string;
  contributors: Contributor[];
  metadataId: number;
  metadata: CampaignMetadata;
}
