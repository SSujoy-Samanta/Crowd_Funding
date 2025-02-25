import { StartCampaign } from "@/components/Campaign/D";
import { CampaignForm } from "@/components/Campaign/CampaignForm";
import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CreateCampaign() {
    const session = await getServerSession(NEXT_AUTH);
    if (!session?.user) {
        redirect('/');
    }
    return <div className="min-h-screen w-full flex ">
        {/* <StartCampaign/> */}
        <CampaignForm/>
    </div>
}