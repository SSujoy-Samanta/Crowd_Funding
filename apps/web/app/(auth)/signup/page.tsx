import { SignUp } from "@/components/Auth_Components/SignUp";
import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SigUP(){
    const session = await getServerSession(NEXT_AUTH);
      if (session?.user) {
        redirect('/');
    }
    return <div className="flex justify-center items-center w-full mt-10">
        <SignUp/>
    </div>
}