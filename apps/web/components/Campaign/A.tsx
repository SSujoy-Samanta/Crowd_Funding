'use client';
import { SetStateAction, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/utils/categoriy";
import { CountryStateSelect } from "./selectCountry";
import Button from "../Buttons/buttons";
import { StepStatus } from "./StepStatus";
import { useRecoilState, useSetRecoilState } from "recoil";
import { notificationState, selectedCategoryState, selectedCountryState, selectedStateState } from "@/lib/atom";
import axios from "axios";

interface AProps {
    setStep: React.Dispatch<SetStateAction<number>>;
    step: number;
    metadataId: number | null;
    setMetadataId: React.Dispatch<SetStateAction<number | null>>;
    userId: number | null;
}

export function A({
    setStep,
    step,
    metadataId,
    setMetadataId,
    userId
}: AProps) {
    const [selectedCategory, setSelectedCategory] = useRecoilState(selectedCategoryState);
    const [selectedCountry, setSelectedCountry] = useRecoilState(selectedCountryState);
    const [selectedState, setSelectedState] = useRecoilState(selectedStateState);
    const [loading, setLoading] = useState<boolean>(false);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [animateIcon, setAnimateIcon] = useState<boolean>(false);
    
    const setNotification = useSetRecoilState(notificationState);

    // Validate form inputs whenever dependencies change
    useEffect(() => {
        setIsFormValid(!!selectedCountry && !!selectedState && !!selectedCategory);
    }, [selectedCountry, selectedState, selectedCategory]);

    async function handleSubmit() {
        try {
            if (!userId) {
                setNotification({ msg: "User ID is missing. Please sign in again.", type: "error" });
                return;
            }

            if (!isFormValid) {
                if (!selectedCountry.length) {
                    setNotification({ msg: "Please select your country.", type: "error" });
                } else if (!selectedState.length) {
                    setNotification({ msg: "Please select your state.", type: "error" });
                } else if (!selectedCategory) {
                    setNotification({ msg: "Please choose a category.", type: "error" });
                }
                return;
            }

            setLoading(true);
            setAnimateIcon(true);
           
            const res = await axios.post('/api/campaign/registration', {
                userId,
                country: selectedCountry,
                state: selectedState,
                category: selectedCategory,
                metadataId: metadataId || null
            });

            if (res.data.metadataId) {
                setMetadataId(res.data.metadataId);
            }
            
            if (res.status === 200) {
                setNotification({ msg: "Great! Let's move to the next step.", type: "success" });
                setTimeout(() => setStep((x) => x + 1), 500);
            }
        } catch (e: any) {
            setAnimateIcon(false);
            if (e.response?.data?.errors) {
                setNotification({ msg: e.response?.data?.errors[0]?.message, type: "error" });
            } else {
                setNotification({ msg: e.response?.data?.msg || "Something went wrong. Please try again.", type: "error" });
            }
        } finally {
            setLoading(false);
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <motion.div 
            className="w-full rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-sky-800 dark:to-cyan-900"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            {/* Header with animated gradient */}
            <div className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-500 p-8">
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
                    animate={{ 
                        x: ["0%", "100%"],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.h2 
                    className="text-3xl font-bold text-white mb-2 relative z-10"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    Begin Your Blockchain Fundraising Journey
                </motion.h2>
                <motion.p 
                    className="text-blue-100 mb-0 relative z-10"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    We'll guide you through each step of the process
                </motion.p>
            </div>

            {/* Main content */}
            <div className="p-8 flex flex-col md:flex-row gap-8">
                {/* Left column - StepStatus and information */}
                <motion.div 
                    className="w-full md:w-1/3"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="mb-6">
                        <StepStatus step={step} />
                    </div>
                    <div className="p-6 bg-white/70 dark:bg-slate-800/40 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Why Blockchain Fundraising?</h3>
                        <ul className="space-y-3">
                            {[
                                "Transparent transaction tracking",
                                "Lower fees than traditional methods",
                                "Global reach without currency barriers",
                                "Enhanced security for your campaign"
                            ].map((item, i) => (
                                <motion.li 
                                    key={i} 
                                    className="flex items-center gap-2 text-slate-600 dark:text-slate-300"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                >
                                    <span className="text-cyan-500">✓</span> {item}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
                
                {/* Right column - Form */}
                <motion.div 
                    className="w-full md:w-2/3 space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Country & State Selection */}
                    <motion.div variants={itemVariants} className="p-6 bg-white/80 dark:bg-slate-800/40 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Where are you located?</h3>
                        <CountryStateSelect
                            selectedCountry={selectedCountry}
                            setSelectedCountry={setSelectedCountry}
                            selectedState={selectedState}
                            setSelectedState={setSelectedState}
                        />
                    </motion.div>

                    {/* Category Selection */}
                    <motion.div variants={itemVariants} className="p-6 bg-white/80 dark:bg-slate-800/40 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">What best describes your fundraising goal?</h3>
                        <div className="flex flex-wrap gap-3 w-full">
                            <AnimatePresence>
                                {categories.map((category) => (
                                    <motion.button
                                        key={category}
                                        whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-white transition-all duration-300 ease-in-out ${
                                            selectedCategory === category 
                                                ? "bg-black shadow-lg shadow-blue-500/30" 
                                                : "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 shadow-md"
                                        }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {category}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Form actions */}
                    <motion.div 
                        variants={itemVariants}
                        className="flex justify-end mt-6"
                    >
                        <div className="relative">
                            {/* This renders the motion icon separately from the Button component */}
                            {loading && (
                                <motion.div 
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={{ opacity: 1 }}
                                    initial={{ opacity: 0 }}
                                >
                                    <motion.div 
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                </motion.div>
                            )}
                            
                            <Button
                                label={loading ? "Processing..." : "Continue"}
                                variant="primary"
                                onClick={handleSubmit}
                                className={`px-6 py-3 text-white rounded-lg ${
                                    isFormValid && !loading 
                                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/30" 
                                        : "bg-slate-400 cursor-not-allowed"
                                }`}
                                disabled={!isFormValid || loading}
                            />
                            
                            {/* Separate animated arrow icon */}
                            {!loading && (
                                <motion.div 
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                                    animate={animateIcon ? { scale: [1, 1.2, 1], x: [0, 5, 0] } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}