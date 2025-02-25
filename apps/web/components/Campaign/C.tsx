"use client";

import { SetStateAction, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimes, FaUpload } from "react-icons/fa";
import { Tags } from "./Tags";
import { useRecoilState, useSetRecoilState } from "recoil";
import { imageState, notificationState, previewState, storyState, titleState } from "@/lib/atom";
import { StepStatus } from "./StepStatus";
import axios from "axios";

interface CProps{
    step:number,
    setStep:React.Dispatch<SetStateAction<number>>;
    metadataId:number|null;
    userId:number|null
}

export const C = ({
    step,
    setStep,
    userId,
    metadataId
}:CProps) => {
    const [title, setTitle] = useRecoilState(titleState);
    const [story, setStory] = useRecoilState(storyState);
    const [image, setImage] = useRecoilState(imageState);
    const [preview, setPreview] = useRecoilState(previewState);
   
    const [errors, setErrors] = useState({ title: "", story: "",image:"" });
    const setNotification = useSetRecoilState(notificationState);
    const [loading, setLoading] = useState<boolean>(false);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            
        }
    };
    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const isFormValid = () => {
        let newErrors = { title: "", story: "", image: "" };
    
        if (title.length < 10) newErrors.title = "Title must be at least 10 characters.";
        if (title.length > 50) newErrors.title = "Title cannot exceed 50 characters.";
        if (story.length < 50) newErrors.story = "Story must be at least 50 characters.";
        if (story.length > 500) newErrors.story = "Story cannot exceed 500 characters.";
        if (!image) newErrors.image = "Please upload an image.";
    
        setErrors(newErrors); 
    
        if (Object.keys(newErrors).length > 0) {
            return false;
        }
        return true;
    }; 
    

    const handleSubmit =async () => {

        try {
            if(!title || !story || !image || !userId || !metadataId){
                return ;
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
            if(res.status==200){
                handleNext();
            }
        } catch (e:any) {
            if (e.response?.data?.errors) {
                setNotification({ msg: e.response?.data?.errors[0]?.message, type: "error" });
            } else {
                setNotification({ msg: e.response?.data?.msg, type: "error" });
            }
        }finally {
            setLoading(false);
            setPreview(null);
        }
       
    };
    const removeImage = () => setPreview(null);

    return (
        <>
            <motion.div 
                className="my-auto w-full flex justify-between gap-10 mx-auto p-6 bg-gradient-to-tl from-cyan-600 via-blue-600 to-sky-600 shadow-2xl rounded-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-center items-start flex-col gap-2 w-3/6">
                    <CInfo/>
                </div>
                <div className="w-3/6 flex flex-col gap-2">
                    
                        <motion.div 
                            className="mb-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-lg font-semibold">Give your fundraiser a title</label>
                            <input
                                type="text"
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                                placeholder="Donate to help..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={isFormValid} 
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </motion.div>

                        <motion.div 
                            className="mb-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-lg font-semibold">Tell your story</label>
                            <textarea
                                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                                rows={5}
                                placeholder="Hi, my name is Jane and I'm fundraising for..."
                                value={story}
                                onChange={(e) => setStory(e.target.value)}
                                onBlur={isFormValid} 
                            />
                            {errors.story && <p className="text-red-500 text-sm mt-1">{errors.story}</p>}
                        </motion.div>

                        <motion.div 
                            className="relative mb-6 flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-600 transition"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            {preview ? (
                                <>
                                    <motion.img 
                                        src={preview} 
                                        alt="Uploaded preview" 
                                        className="w-full max-h-40 aspect-auto object-fill rounded-lg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <button
                                        className="absolute z-40 top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                                        onClick={removeImage}
                                    >
                                        <FaTimes className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <label className="flex flex-col items-center justify-center text-white cursor-pointer">
                                    <FaUpload className="w-12 h-12 mb-2 text-amber-600 " />
                                    <span>Upload a fundraiser image</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload}  onBlur={isFormValid}  />
                                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                </label>
                            )}
                        </motion.div>
                        <motion.button
                            onClick={handleSubmit}
                            disabled={!isFormValid}
                            className={`mb-5 w-full p-3 bg-green-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition mx-auto ${!title|| !story || !image ? "opacity-50 cursor-not-allowed":"cursor-pointer"}`}
                            whileTap={{ scale: 0.95 }}
                        >
                            {!loading && <FaCheckCircle className="w-5 h-5" />}
                            {loading?"Loading...":"Continue"} 
                        </motion.button>
                    
                    {/* <Tags/> */}
                </div>
            </motion.div>
            <StepStatus step={step}/>
            <motion.div className="absolute bottom-2  flex mt-6 gap-10 items-center justify-between px-20 w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <button className="p-2 px-4 bg-gray-700 text-white rounded-lg cursor-pointer" 
                onClick={handleBack}>Back</button>
                    
            </motion.div>
        </>
    );
};

const CInfo = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-gray-900">
        Tell donors why you're fundraising
      </h2>
      <p className="text-gray-300 mb-4">Some ideas to help you start writing:</p>
      <ul className="list-disc list-inside text-gray-400 space-y-2">
        <li>Introduce yourself and what you're raising funds for</li>
        <li>Describe why it's important to you</li>
        <li>Explain how the funds will be used</li>
      </ul>
    </div>
  );
};

