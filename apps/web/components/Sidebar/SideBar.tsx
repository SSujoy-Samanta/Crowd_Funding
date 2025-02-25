'use client';
import { useSession } from 'next-auth/react';
import  { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { MdDashboard,MdCampaign } from "react-icons/md";
import { SideButton } from './SideButton';
import { GrDeploy } from "react-icons/gr";
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
            <SideButton path="/campaign/start" Icon={<MdCampaign size={24} className={style}/>}>
              {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Campaign</span>}
            </SideButton>
            <SideButton path="contracts/deployed" Icon={<GrDeploy size={24} className={style}/>}>
              {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Deployed</span>}
            </SideButton>
          
            <li>
              <a href="/profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div className='p-1 flex items-center'>
                  <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
                  </svg>
                </div>
                {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Users</span>}
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div className='p-1 flex items-center'>
                  <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                    <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
                  </svg>
                  </div>
                {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Products</span>}
              </a>
            </li>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <SideButton path="/dashboard" Icon={<MdDashboard size={24} className={style}/>}>
              {sidebarOpen &&<span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>}
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



