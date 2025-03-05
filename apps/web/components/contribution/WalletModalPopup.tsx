'use client';
import { motion, AnimatePresence } from "framer-motion";
import { SetStateAction } from "react";
import { WalletOptions } from "../WalletOptions";
interface WalletModalProps{
    isModalOpen:boolean,
    setIsModalOpen:React.Dispatch<SetStateAction<boolean>>
}
export const WalletModalPopUp=({isModalOpen,setIsModalOpen}:WalletModalProps)=>{
    return <AnimatePresence>
        {isModalOpen && (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md a"
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-[#161b29] text-white p-6 rounded-xl shadow-xl w-96"
            >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="lg:text-2xl md:text-xl xxs:text-lg bg-gradient-to-b from-blue-300 to-blue-700 bg-white bg-clip-text pr-1 font-black tracking-tighter text-transparent">Select a Wallet</h2>
                <button onClick={() => setIsModalOpen(false)} className="bg-red-400 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="black" className="size-5">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                </button>
            </div>

            {/* Options */}
            <div className="space-y-3">
                <WalletOptions/>
            </div>
            </motion.div>
        </motion.div>
        )}
    </AnimatePresence>
}