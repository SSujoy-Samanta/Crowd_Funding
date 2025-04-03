"use client"
import { GoPerson } from "react-icons/go";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const Profile = ({
    userName,
    onClick,
}: {
    userName: string;
    onClick: () => void;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const profile = userName[0]?.toUpperCase();
    const isUnknown = userName === "unknown";
    
    // Animation variants
    const avatarVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }
    };
    
    const iconVariants = {
        idle: { rotate: 0 },
        hover: { rotate: 10 }
    };
    
    const ringVariants = {
        idle: { opacity: 0, scale: 1.2 },
        hover: { 
            opacity: 1, 
            scale: 1.15,
            transition: { duration: 0.3 }
        }
    };

    return (
        <div 
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative cursor-pointer group"
        >
            {/* Hover ring effect */}
            <motion.div
                variants={ringVariants}
                initial="idle"
                animate={isHovered ? "hover" : "idle"}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 blur-sm"
            />
            
            <motion.div
                variants={avatarVariants}
                initial="idle"
                animate={isHovered ? "hover" : "idle"}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative flex justify-center items-center rounded-full overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-400 to-indigo-600 opacity-90" />
                
                {isUnknown ? (
                    <motion.div 
                        variants={iconVariants}
                        initial="idle"
                        animate={isHovered ? "hover" : "idle"}
                        className="relative flex justify-center items-center w-10 h-10 text-white"
                    >
                        <GoPerson size={20} />
                    </motion.div>
                ) : (
                    <div className="relative flex justify-center items-center w-10 h-10">
                        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 to-white opacity-75" />
                        <div className="absolute inset-0 bg-white opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                        <span className="relative font-semibold text-black text-lg">
                            {profile}
                        </span>
                    </div>
                )}
            </motion.div>
            
            {/* Pulse animation on hover */}
            {isHovered && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ 
                        scale: [0.8, 1.2, 0.8], 
                        opacity: [0.8, 0, 0.8],
                    }}
                    transition={{ 
                        repeat: Infinity,
                        duration: 1.5
                    }}
                    className="absolute inset-0 rounded-full bg-cyan-400 -z-10"
                />
            )}
        </div>
    );
};