'use client';
import { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
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
    userId:number|null
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

    
    const setNotification = useSetRecoilState(notificationState);
    //console.log(metadataId)

    async function handleSubmit() {
        
        try {
            if (!userId) return;

            if (!selectedCountry.length) {
                setNotification({ msg: "Please select your country.", type: "error" });
                return;
            }
            if (!selectedState.length) {
                setNotification({ msg: "Please select your state.", type: "error" });
                return;
            }
            if (!selectedCategory) {
                setNotification({ msg: "Please choose a category.", type: "error" });
                return;
            }
            setLoading(true); 
           
            const res = await axios.post('/api/campaign/registration', {
                userId,
                country: selectedCountry,
                state: selectedState,
                category: selectedCategory,
                metadataId:metadataId?metadataId:null
            });

            if (res.data.metadataId) {
                setMetadataId(res.data.metadataId); // Fix: Set correct metadataId
            }
            if(res.status==200){
                setStep((x) => x + 1);
            }
            

        } catch (e: any) {
            
            if (e.response?.data?.errors) {
                setNotification({ msg: e.response?.data?.errors[0]?.message, type: "error" });
            } else {
                setNotification({ msg: e.response?.data?.msg, type: "error" });
            }
        } finally {
            setLoading(false); 
        }
    }

    return (
        <motion.div className="flex w-full gap-20 justify-between items-center p-8 bg-gradient-to-br from-pink-800 via-fuchsia-800 to-rose-800 rounded-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="w-2/6">
                <h2 className="text-3xl font-bold mb-6 break-words">Let's Begin Your Fundraising Journey with Blockchain</h2>
                <p className="text-indigo-800 mb-6 font-bold">We're here to guide you every step of the way.</p>
            </div>

            <div className="w-4/6">
                {/* Country & State Selection */}
                <div className="w-full mb-6">
                    <CountryStateSelect
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        selectedState={selectedState}
                        setSelectedState={setSelectedState}
                    />
                </div>

                {/* Category Selection */}
                <h3 className="text-lg font-semibold mb-4 text-black">What best describes why you're fundraising?</h3>
                <div className="flex flex-wrap gap-3 mb-4 w-full">
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full ${selectedCategory === category ? "bg-slate-800" : "bg-gradient-to-tr from-cyan-400 to-blue-500"} transition-all duration-300 ease-in-out shadow-sm hover:shadow-md`}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>

                {/* Next Button with Loading */}
                <Button
                    label={loading ? "Loading..." : "Next"}
                    variant="primary"
                    onClick={handleSubmit}
                    className={`mt-6 px-6 py-2 text-white rounded-lg ${(!selectedCountry || !selectedCategory || !selectedState || loading) && "opacity-50 cursor-not-allowed"}`}
                    disabled={!selectedCountry || !selectedCategory || !selectedState || loading}
                />
            </div>

            <StepStatus step={step} />
        </motion.div>
    );
}
