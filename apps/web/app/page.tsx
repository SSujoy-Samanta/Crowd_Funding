import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { Interaction } from "../components/Interaction";
import { CreateCampaign} from "../components/CreateCampaign";
import { Account } from "../components/Account";
import { WalletOptions } from "../components/WalletOptions";
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
    <div className="text-red-500  md:text-blue-500 sm:text-amber-200">
      hiii
      <WalletOptions/>
      <Account/>
      <Interaction/>
      <CreateCampaign/>
      <GetDeployedContracts/>
      <CreatorCampaign/>
      <CampaignGoal/>
      <FundingRaised/>
      <VotingStatus/>
      <FundingApproveStatus/>
      <ContributeFund/>
      <Voting/>
      <WithDrawFund/>
      <ClaimRefund/>
    </div>
  );
}
