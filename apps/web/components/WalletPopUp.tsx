'use client';
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Buttons/buttons";
import { WalletOptions } from "./WalletOptions";
import { useAccount, useDisconnect } from "wagmi";
import { createPortal } from "react-dom";

export const WalletPopUp = () => {
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleConnect = () => {
        setIsModalOpen(true);
    };

    const handleDisconnect = () => {
        disconnect();
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (isConnected) {
            setIsModalOpen(false);
        }
    }, [isConnected]);

    // Animation variants
    const buttonVariants = {
        hover: { 
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: { 
            scale: 0.95,
            transition: { duration: 0.1 }
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    const modalVariants = {
        hidden: { 
            y: 20, 
            opacity: 0,
            scale: 0.95
        },
        visible: { 
            y: 0, 
            opacity: 1,
            scale: 1,
            transition: { 
                delay: 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        exit: { 
            y: 20, 
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="relative flex flex-col items-center"> 

            {/* Connect / Disconnect Button with animations */}
            <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
            >
                <Button 
                    label={isConnected? `Disconnect` : "Connect Wallet"} 
                    variant={isConnected ? "sunsetGlow" : "aquaBreeze"}  
                    onClick={isConnected ? handleDisconnect : handleConnect}
                />
            </motion.div>
    
            {/* Modal Popup with enhanced animations */}
            {isClient && createPortal(
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            variants={backdropVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="fixed z-40 inset-0 flex items-center justify-center"
                        >
                            {/* Backdrop with blur effect */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                            
                            {/* Modal content */}
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="relative bg-gradient-to-br from-[#192133] to-[#0c101d] text-white p-6 rounded-xl shadow-2xl w-96 border border-opacity-20 border-blue-400"
                            >
                                {/* Modal Header with network info */}
                                <div className="flex flex-col mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="lg:text-2xl md:text-xl xxs:text-lg bg-gradient-to-b from-blue-300 via-cyan-300 to-blue-500 bg-clip-text pr-1 font-black tracking-tighter text-transparent">Select a Wallet</h2>
                                        <motion.button 
                                            onClick={() => setIsModalOpen(false)} 
                                            className="bg-red-500 bg-opacity-20 hover:bg-opacity-30 p-1.5 rounded-full transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="size-4">
                                                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-xl text-gray-300 pl-1">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                        <span>Connect to <b className="text-sky-500">Sepolia</b> Blockchain</span>
                                    </div>
                                </div>

                                {/* Options with staggered animation */}
                                <motion.div 
                                    className="space-y-3"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    <WalletOptions />
                                </motion.div>
                                
                                {/* Additional help text */}
                                <div className="mt-6 text-xs text-center text-gray-400">
                                    <p>Need help connecting your wallet?</p>
                                    <a href="https://support.metamask.io/configure/networks/how-to-view-testnets-in-metamask/" target="blank" className="text-blue-400 hover:text-blue-300 transition-colors">View wallet connection guide</a>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};