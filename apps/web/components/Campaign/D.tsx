"use client";

import { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { Card, CardContent } from "../Card";
import { CreateCampaign } from "./CreateCampaign";
import { Tags } from "./Tags";
import { StepStatus } from "./StepStatus";
interface  DProps{
    step:number,
    setStep:React.Dispatch<SetStateAction<number>>;
    userId:number|null;
    metadataId:number|null;
}

export const D = ({userId,metadataId,step,setStep}:DProps) => {
    const handleBack = () => setStep((prev) => prev - 1);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col relative justify-center"
        >
            <Card className="w-full border-none shadow-none text-black mb-5">
                <CardContent className="p-6 flex gap-10 justify-between items-center w-full">
                    <div className="w-9/12">
                        <Tags/>
                    </div>
                    
                    <div className="w-3/12">
                        <CreateCampaign userId={userId} metadataId={metadataId}/>
                    </div>
                </CardContent>
            </Card>
            <StepStatus step={step}/>
            <motion.div className="absolute bottom-2  flex mt-6 gap-10 items-center justify-between px-20 w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <button className="p-2 px-4 bg-gray-700 text-white rounded-lg cursor-pointer" 
                onClick={handleBack}>Back</button>
                    
            </motion.div>
        </motion.div>
    );
};
