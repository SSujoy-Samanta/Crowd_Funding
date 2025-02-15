import { id } from "ethers";

//#Campaign contract Events
// event Funded(address indexed backer, uint256 amount);
// event Refunded(address indexed backer, uint256 amount);
// event Withdrawn(address indexed creator, uint256 amount);
// event Voted(address indexed voter, bool vote);
// event VotingStarted();
// event VotingEnded(bool success);

//#Factory contract Events
//event ContractDeployed(address indexed creator, address contractAddress, uint256 goal);

//Define Event Topics Dynamically

export const EVENT_TOPICS = {
    Funded: id("Funded(address,uint256)"),
    Refunded: id("Refunded(address,uint256)"),
    Withdrawn: id("Withdrawn(address,uint256)"),
    Voted: id("Voted(address,bool)"),
    VotingStarted: id("VotingStarted()"),
    VotingEnded: id("VotingEnded(bool)"),
    ContractDeployed:id("ContractDeployed(address,address,uint256)")
};

//Select Active Events Dynamically
export const EVENTS = Object.values(EVENT_TOPICS); // Include all events