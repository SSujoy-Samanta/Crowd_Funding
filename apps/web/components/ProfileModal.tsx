"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import { notificationState } from "@/lib/atom";
import { IoPersonSharp } from "react-icons/io5";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiDashboardLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";

export const ProfileModal = ({
  setToggle,
  username,
  email,
}: {
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;
    username: string;
    email: string;
}) => {
    const setNotification = useSetRecoilState(notificationState);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    
    // Handle ESC key press to close modal
    useEffect(() => {
        setMounted(true);
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setToggle(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [setToggle]);

    const handleClickOutside = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.stopPropagation();
        setToggle(false);
    };

    const handleClickInside = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        event.stopPropagation();
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm"
                onClick={handleClickOutside}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-4 top-24 w-full max-w-md p-2 sm:p-4"
                    onClick={handleClickInside}
                >
                    <div 
                        className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
                    >
                        {/* User Info Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold backdrop-blur-sm">
                                    {username.toUpperCase()[0]}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-semibold">{username}</h3>
                                    <p className="text-sm text-blue-100 truncate">{email}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="p-4 flex flex-col gap-2">
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(243, 244, 246, 1)" }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="group flex w-full items-center gap-3 rounded-lg p-3 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:text-gray-800 dark:hover:bg-gray-800"
                                onClick={() => {
                                    setToggle(false);
                                    router.push("/profile");
                                }}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                                    <IoPersonSharp size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Profile</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">View and edit your details</p>
                                </div>
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(243, 244, 246, 1)" }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="group flex w-full items-center gap-3 rounded-lg p-3 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-800"
                                onClick={() => {
                                    setToggle(false);
                                    router.push("/dashboard");
                                }}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    <RiDashboardLine size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Dashboard</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Access your dashboard</p>
                                </div>
                            </motion.button>
                            
                            <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />
                            
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(254, 226, 226, 1)" }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                className="group flex w-full items-center gap-3 rounded-lg p-3 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                onClick={async () => {
                                    await signOut();
                                    setToggle(false);
                                    setNotification({
                                        msg: "Successfully logged out.",
                                        type: "success",
                                    });
                                }}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 group-hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
                                    <FiLogOut size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">Logout</p>
                                    <p className="text-xs text-red-500/70 dark:text-red-400/70">Sign out of your account</p>
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};