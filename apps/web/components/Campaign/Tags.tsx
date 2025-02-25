"use client";

import { motion } from "framer-motion";
import { tagOptions } from "@/utils/tags";
import { useRecoilState } from "recoil";
import { tags } from "@/lib/atom";



export const Tags = () => {
    const [selectedTags, setSelectedTags] = useRecoilState(tags);
    const isValid = selectedTags.length >= 3 && selectedTags.length <= 5;

    console.log(selectedTags);
    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : prev.length < 5
                ? [...prev, tag]
                : prev
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=" mx-auto p-6 bg-slate-900 bg-opacity-50  shadow-xl rounded-2xl"
        >
            <h2 className="text-3xl font-bold text-white mb-4">
                Tell donors why you're fundraising
            </h2>
            <p className="text-amber-400 mb-4">Select at least 3 and at most 5 tags:</p>

            <div className="flex flex-wrap gap-3 mb-4">
                {tagOptions.map((tag) => (
                <motion.div
                    key={tag}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                    selectedTags.includes(tag)
                        ? "bg-blue-500 text-white"
                        : "text-white bg-gradient-to-br from-amber-600 to-pink-600 "
                    }`}
                >
                    {tag}
                </motion.div>
                ))}
            </div>

            <p className={`text-sm font-bold ${isValid ? "text-green-600" : "text-red-600"}`}>
                {isValid
                ? "Perfect! You can proceed."
                : "Please select at least 3 and at most 5 tags."}
            </p>
            
        </motion.div>
    );
};


