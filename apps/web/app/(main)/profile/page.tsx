import { ProfileCard } from "@/components/UserProfile";
import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Profile() {
    const session = await getServerSession(NEXT_AUTH);
    if (!session?.user) {
        redirect('/');
    }
    return <div className="min-h-screen pt-24 w-full">
        <ProfileCard/>
    </div>
}