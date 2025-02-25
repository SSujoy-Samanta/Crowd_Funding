'use client';
import React, { ReactNode } from "react";
interface SideButtonProps{
    Icon: ReactNode; 
    children: React.ReactNode;
    className?:string;
    path:string
}
export const SideButton=({children,className,path,Icon}:SideButtonProps)=>{
    return <li>
        <a href={path} className={`${className} flex justify-start items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
            <div className='py-1 flex items-center'>
               {Icon}
            </div>
            {children}
        </a>
  </li>
}