'use client';
import { useSession } from 'next-auth/react';
import  { useState } from 'react';
import { MdDashboard,MdCampaign } from "react-icons/md";
import { SideButton } from './SideButton';
import { GrDeploy } from "react-icons/gr";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { BiSolidDonateHeart } from "react-icons/bi";
export const Sidebar= () => {
  const session = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const style='shrink-0 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'

  if(!session.data || !session.data.user){
    return null;
  }

  return (
    <>
      <aside
        id="separator-sidebar"
        className={`fixed top-0 left-0  z-20  min-h-screen`}
        aria-label="Sidebar"
      >
        
        <div className={`h-4/6 px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-r-md absolute inset-0 ${
          sidebarOpen ? "w-56" : "w-16"
        } transition-all duration-500 ease-in-out overflow-x-hidden top-36`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        >
          <ul className="space-y-2 font-medium text-base">
            <SideButton path="/dashboard" Icon={<MdDashboard size={24} className={style}/>}>
              {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>}
            </SideButton>
            <SideButton path="campaign/start" Icon={<VscGitPullRequestCreate size={24} className={style}/>}>
              {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">New</span>}
            </SideButton>
            <SideButton path="/campaigns" Icon={<MdCampaign size={24} className={style}/>}>
              {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Campaigns</span>}
            </SideButton>
            <SideButton path="contracts/deployed" Icon={<GrDeploy size={24} className={style}/>}>
              {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Deployed</span>}
            </SideButton>

          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <SideButton path="/contribution" Icon={<BiSolidDonateHeart size={24} className={style}/>}>
              {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Contribution</span>}
            </SideButton>
            <SideButton path="/dashboard" Icon={<MdDashboard size={24} className={style}/>}>
              {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>}
            </SideButton>
            <SideButton path="/dashboard" Icon={<MdDashboard size={24} className={style}/>}>
              {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>}
            </SideButton>
          </ul>
        </div>
      </aside>
    </>
  )
}



