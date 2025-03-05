import CampaignDashboard from "@/components/dashboard/dash";
import { ethers } from "ethers";
import db from "@repo/db/db";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserCampaignData } from "@/lib/dash";

export default async function DashBoard(){
    const session = await getServerSession(NEXT_AUTH);
    if (!session?.user || !session.user.id) {
        redirect('/');
    }
    const data=await getUserCampaignData(parseInt(session.user.id));

    return <div className="pt-28">
        <CampaignDashboard campaignData={data}/>
    </div>
}