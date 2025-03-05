import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { Interaction } from "../components/Interaction";
import { CreateCampaign} from "../components/Campaign/CreateCampaign";
import { Account } from "../components/Account";
import { GetDeployedContracts } from "../components/GetDepolyedContracts";
import { CreatorCampaign } from "../components/CreatorCampaign";
import { CampaignGoal } from "../components/CampaignGoal";
import { FundingRaised } from "../components/FundingRaised";
import { VotingStatus } from "../components/VotingStatus";
import { FundingApproveStatus } from "../components/FundingApproveStatus";
import { ContributeFund } from "../components/ContributeFund";
import { Voting } from "../components/Voting";
import { WithDrawFund } from "../components/WithDrawFund";
import { ClaimRefund } from "../components/ClaimRefund";
// import { HeroPage } from "@/components/Hero/hero";
import VerticalVoteBarChart from "@/components/dashboard/BarChart";
import HomePage from "@/components/Hero/HomePage";


type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (
    <div className="">
      {/* <Account/>
      <Interaction/>
      <CreateCampaign/>
      <GetDeployedContracts/>
      <CreatorCampaign/>
      <CampaignGoal/>
      <FundingRaised address='0x8398bCD4f633C72939F9043dB78c574A91C99c0A'/>
      <VotingStatus/>
      <FundingApproveStatus/>
      <ContributeFund/>
      <Voting contractAddress="0x8398bCD4f633C72939F9043dB78c574A91C99c0A"/>
      <WithDrawFund/>
      <ClaimRefund/>
      <HeroPage/> */}
      <HomePage/>
     
    </div>
  );
}
