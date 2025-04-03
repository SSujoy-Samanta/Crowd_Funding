"use client";

import { SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimes, FaUpload, FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import { useRecoilState, useSetRecoilState } from "recoil";
import { imageState, notificationState, previewState, storyState, titleState } from "@/lib/atom";
import { StepStatus } from "./StepStatus";
import axios from "axios";

interface CProps {
  step: number;
  setStep: React.Dispatch<SetStateAction<number>>;
  metadataId: number | null;
  userId: number | null;
}

export const C = ({
  step,
  setStep,
  userId,
  metadataId
}: CProps) => {
    const [title, setTitle] = useRecoilState(titleState);
    const [story, setStory] = useRecoilState(storyState);
    const [image, setImage] = useRecoilState(imageState);
    const [preview, setPreview] = useRecoilState(previewState);
    const [errors, setErrors] = useState({ title: "", story: "", image: "" });
    const setNotification = useSetRecoilState(notificationState);
    const [loading, setLoading] = useState<boolean>(false);
    const [isInfoOpen, setIsInfoOpen] = useState<boolean>(true);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
        // Animate the preview change
        setPreview(null);
            setTimeout(() => {
                setImage(file);
                setPreview(URL.createObjectURL(file));
            }, 300);
        }
    };

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const isFormValid = () => {
        let newErrors = { title: "", story: "", image: "" };
        
        if (title.length < 10) newErrors.title = "Title must be at least 10 characters.";
        if (title.length > 50) newErrors.title = "Title cannot exceed 50 characters.";
        if (story.length < 50) newErrors.story = "Story must be at least 50 characters.";
        if (story.length > 3000) newErrors.story = "Story cannot exceed 3000 characters.";
        if (!image) newErrors.image = "Please upload an image.";
        
        setErrors(newErrors);
        
        return !newErrors.title && !newErrors.story && !newErrors.image;
    };

    const handleSubmit = async () => {
        if (!isFormValid()) return;
        
        try {
        if (!title || !story || !image || !userId || !metadataId) {
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append("userId", userId.toString());
        formData.append("metadataId", metadataId.toString());
        formData.append("title", title);
        formData.append("description", story);
        formData.append("image", image);

        const res = await axios.put(`/api/campaign/registration/info`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        
        if (res.status == 200) {
            setNotification({ msg: "Grate next move to the final step.", type: "success" });
            handleNext();
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
    };
    
    const removeImage = () => {
        setPreview(null);
        setImage(null);
    };

    // Character count display
    const titleCharCount = title.length;
    const storyCharCount = story.length;
    const titleProgress = Math.min(titleCharCount / 50 * 100, 100);
    const storyProgress = Math.min(storyCharCount / 3000 * 100, 100);

  return (
    <>
        <motion.div 
            className=" py-8 my-auto w-full flex flex-col md:flex-row justify-between gap-10 mx-auto p-6 bg-gradient-to-br from-indigo-900 via-blue-800 to-sky-700 shadow-2xl rounded-xl overflow-hidden relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            
            {/* Left side - Info Panel */}
            <AnimatePresence>
            {isInfoOpen && (
                <motion.div 
                className="flex justify-center items-start flex-col gap-2 w-full md:w-2/5 z-10 bg-gradient-to-br from-blue-950/60 to-indigo-900/60 rounded-lg p-6 backdrop-blur-md"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50, width: 0 }}
                transition={{ duration: 0.5 }}
                >
                <CInfo />
                </motion.div>
            )}
            </AnimatePresence>
            
            {/* Toggle info button */}
            <motion.button
            className="absolute top-4 left-4 z-20 bg-indigo-600 hover:bg-indigo-700 rounded-full p-2 text-white shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            >
            <FaInfoCircle className="w-5 h-5" />
            </motion.button>
            
            {/* Right side - Form */}
            <motion.div 
            className={`w-full ${isInfoOpen ? 'md:w-3/5' : 'md:w-full'} flex flex-col gap-4 z-10 transition-all duration-300 ease-in-out`}
            animate={{ width: isInfoOpen ? '60%' : '100%' }}
            >
            {/* Title Input */}
            <motion.div 
                className="mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex justify-between items-center mb-1">
                <label className="block text-lg font-medium text-white">Fundraiser Title</label>
                <span className={`text-xs ${titleCharCount > 50 ? 'text-red-400' : 'text-gray-300'}`}>
                    {titleCharCount}/50
                </span>
                </div>
                
                <div className="relative">
                <input
                    type="text"
                    className="w-full p-4 mt-1 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800 bg-white/90 backdrop-blur-sm shadow-md text-lg transition-all duration-300"
                    placeholder="Your impactful title here..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={isFormValid}
                />
                
                {/* Title progress bar */}
                <div className="w-full h-1 bg-gray-300 rounded-full mt-1 overflow-hidden">
                    <motion.div 
                    className={`h-full ${titleProgress < 70 ? 'bg-green-500' : titleProgress < 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${titleProgress}%` }}
                    transition={{ duration: 0.3 }}
                    />
                </div>
                </div>
                
                {errors.title && (
                <motion.p 
                    className="text-red-300 text-sm mt-1 pl-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    {errors.title}
                </motion.p>
                )}
            </motion.div>

            {/* Story Textarea */}
            <motion.div 
                className="mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex justify-between items-center mb-1">
                <label className="block text-lg font-medium text-white">Your Story</label>
                <span className={`text-xs ${storyCharCount > 3000 ? 'text-red-400' : 'text-gray-300'}`}>
                    {storyCharCount}/3000
                </span>
                </div>
                
                <div className="relative">
                <textarea
                    className="w-full p-4 mt-1 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800 bg-white/90 backdrop-blur-sm shadow-md text-base transition-all duration-300"
                    rows={6}
                    placeholder="Share your compelling story and why this cause matters..."
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    onBlur={isFormValid}
                />
                
                {/* Story progress bar */}
                <div className="w-full h-1 bg-gray-300 rounded-full mt-1 overflow-hidden">
                    <motion.div 
                    className={`h-full ${storyProgress < 70 ? 'bg-green-500' : storyProgress < 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${storyProgress}%` }}
                    transition={{ duration: 0.3 }}
                    />
                </div>
                </div>
                
                {errors.story && (
                <motion.p 
                    className="text-red-300 text-sm mt-1 pl-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    {errors.story}
                </motion.p>
                )}
            </motion.div>

            {/* Image Upload */}
            <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <label className="block text-lg font-medium text-white mb-2">Campaign Image</label>
                
                <AnimatePresence mode="wait">
                {preview ? (
                    <motion.div 
                    className="relative rounded-lg overflow-hidden shadow-lg border-2 border-amber-400"
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    >
                    <motion.img 
                        src={preview} 
                        alt="Fundraiser preview" 
                        className="w-full h-64 object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <p className="text-white text-sm truncate">Image uploaded successfully</p>
                    </div>
                    <motion.button
                        className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg"
                        onClick={removeImage}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaTimes className="w-4 h-4" />
                    </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                    key="upload"
                    className="relative p-8 border-2 border-dashed border-blue-400 rounded-lg bg-indigo-950/30 hover:bg-indigo-900/40 transition cursor-pointer shadow-inner flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                    >
                    <label className="flex flex-col items-center justify-center text-white cursor-pointer w-full h-40">
                        <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        >
                        <FaUpload className="w-12 h-12 mb-3 text-amber-400" />
                        </motion.div>
                        <span className="text-lg font-medium mb-2">Upload Campaign Image</span>
                        <p className="text-gray-300 text-sm text-center">Drop your image here or click to browse</p>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} onBlur={isFormValid} />
                    </label>
                    </motion.div>
                )}
                </AnimatePresence>
                
                {errors.image && (
                    <motion.p 
                        className="text-red-300 text-sm mt-2 pl-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        {errors.image}
                    </motion.p>
                )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
                onClick={handleSubmit}
                disabled={!title || !story || !image || loading}
                className={`p-4 rounded-lg font-medium shadow-lg flex items-center justify-center gap-3 text-lg transition-all duration-300 ${
                !title || !story || !image 
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed" 
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                }`}
                whileHover={!title || !story || !image ? {} : { scale: 1.02 }}
                whileTap={!title || !story || !image ? {} : { scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                {loading ? (
                    <motion.div 
                        className="h-6 w-6 border-3 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    ) : (
                        <FaCheckCircle className="w-5 h-5" />
                    )}
                    {loading ? "Submitting..." : "Continue to Next Step"}
            </motion.button>
            </motion.div>
        </motion.div>
        
        {/* Step Status */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
        >
            <StepStatus step={step} />
        </motion.div>
        
        {/* Back Button */}
        <motion.div 
            className="fixed bottom-6 left-6 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
        >
            <motion.button 
                className="p-3 px-6 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center gap-2"
                onClick={handleBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
            <FaArrowLeft className="w-4 h-4" />
                <span>Back</span>
            </motion.button>
        </motion.div>
    </>
  );
};

const CInfo = () => {
    return (
        <div className="p-3">
            <motion.h2 
                className="text-3xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                Create Your 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500"> Fundraiser Story</span>
            </motion.h2>
            
            <motion.p 
                className="text-gray-200 mb-6 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                A compelling story helps donors connect with your cause and inspires them to contribute.
            </motion.p>
            
            <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                    <span className="bg-amber-400 text-indigo-900 rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    Introduce Yourself
                </h3>
                <p className="text-gray-200 text-sm">Tell donors who you are and what you're fundraising for in a personal way.</p>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                    <span className="bg-amber-400 text-indigo-900 rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    Share Your Why
                </h3>
                <p className="text-gray-200 text-sm">Explain why this cause is meaningful to you and why others should care too.</p>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="font-semibold text-amber-300 mb-2 flex items-center gap-2">
                    <span className="bg-amber-400 text-indigo-900 rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    Detail Your Plans
                </h3>
                <p className="text-gray-200 text-sm">Be specific about how the funds will be used to build donor trust and confidence.</p>
                </div>
            </motion.div>
        </div>
    );
};