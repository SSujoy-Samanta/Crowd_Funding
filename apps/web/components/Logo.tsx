"use client"
import React from "react";
import { FaEthereum } from "react-icons/fa";
import { useRouter } from "next/navigation";

export const Logo = () => {
    const router=useRouter();
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={()=>{
        router.push('/');
    }}>
      {/* Ethereum Icon */}
     

      {/* Logo Text with Gradient */}
      <h1 className="flex items-center text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
        <span>Web3</span><FaEthereum className="text-[#627EEA] text-3xl font-bold animate-pulse" /><span>FundMe</span> 
      </h1>
    </div>
  );
};


