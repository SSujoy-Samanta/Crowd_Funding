"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

export const Logo = () => {
    const router=useRouter();
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out" onClick={()=>{
        router.push('/');
    }}>
      <h1 className="flex items-center text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
        <Zap className="text-[#627EEA] text-3xl font-bold mr-1" /><span>FundRaiser</span> 
      </h1>
    </div>
  );
};


