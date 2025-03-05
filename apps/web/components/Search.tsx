"use client";
import React, { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";
import { IoFilterOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { ethers } from "ethers";

interface CampaignContents {
    id: number;
    metadata: {
        title: string;
        category: string;
        goal: string;
        imageUrl: string | null;
        tags: string[];
        country: string;
        state: string;
    };
    Goal: string;
    raised:string;
    user: {
        username: string;
    };
}

interface SearchBoxProps {
    campaigns: CampaignContents[];
    setData: React.Dispatch<SetStateAction<CampaignContents[]>>;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ campaigns, setData }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: "",
        country: "",
        state: "",
        tag: ""
    });

    // Extract unique values for filter dropdowns
    const categories = [...new Set(campaigns.map(c => c.metadata.category))];
    const countries = [...new Set(campaigns.map(c => c.metadata.country))];
    const states = [...new Set(campaigns.map(c => c.metadata.state))];
    const allTags = [...new Set(campaigns.flatMap(c => c.metadata.tags || []))];

    const applyFilters = () => {
        const filtered = campaigns.filter((campaign) => {
            const searchMatch = searchTerm.length === 0 || 
                campaign.user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                ethers.formatEther(campaign.Goal).toLowerCase().includes(searchTerm.toLowerCase()) || 
                campaign.metadata.title?.toLowerCase().includes(searchTerm.toLowerCase())||
                campaign.metadata.goal?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const categoryMatch = !filters.category || campaign.metadata.category === filters.category;
            const countryMatch = !filters.country || campaign.metadata.country === filters.country;
            const stateMatch = !filters.state || campaign.metadata.state === filters.state;
            const tagMatch = !filters.tag || campaign.metadata.tags?.includes(filters.tag);
            
            return searchMatch && categoryMatch && countryMatch && stateMatch && tagMatch;
        });
        
        setData(filtered);
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const newSearchTerm = term.toLowerCase();
        
        if (term.length === 0 && !hasActiveFilters()) {
            setData(campaigns);
            return;
        }
        
        applyFilters();
    };

    const resetFilters = () => {
        setFilters({
            category: "",
            country: "",
            state: "",
            tag: ""
        });
        
        if (searchTerm.length === 0) {
            setData(campaigns);
        } else {
            handleSearch(searchTerm);
        }
    };

    const hasActiveFilters = () => {
        return Object.values(filters).some(value => value !== "");
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Apply filters whenever they change
    React.useEffect(() => {
        applyFilters();
    }, [filters]);

    return (
        <div className="w-full max-w-lg">
            <motion.div 
                className="relative flex items-center bg-white rounded-lg shadow-md p-2 w-full"
                initial={{ y: 0 }}
                animate={{ y: 0 }}
            >
                <CiSearch className="w-5 h-5 ml-3 text-blue-600 font-extrabold" />
                <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="w-full bg-transparent px-3 py-2 outline-none text-black"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="relative">
                    <button 
                        onClick={toggleFilters}
                        className={`p-2 rounded-md bg-gray-900  ${hasActiveFilters() ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-600'} transition-all delay-300 ease-in-out`}
                    >
                        <IoFilterOutline className="w-5 h-5 text-white font-bold" />
                        {hasActiveFilters() && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {Object.values(filters).filter(v => v !== "").length}
                            </span>
                        )}
                    </button>
                </div>
            </motion.div>

            {showFilters && (
                <motion.div 
                    className="mt-2 p-4 px-12 bg-gradient-to-br from-blue-500 to-slate-800 rounded-lg shadow-md absolute z-30"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-white">Filters</h3>
                        <div className="flex gap-2">
                            {hasActiveFilters() && (
                                <button 
                                    onClick={resetFilters}
                                    className="text-sm text-amber-500 hover:text-amber-700"
                                >
                                    Reset
                                </button>
                            )}
                            <button 
                                onClick={toggleFilters}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <IoMdClose className="w-5 h-5 text-red-600" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Category</label>
                            <select 
                                className="w-full p-2 rounded-md text-sm bg-cyan-400"
                                value={filters.category}
                                onChange={(e) => handleFilterChange("category", e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Tag</label>
                            <select 
                                className="w-full p-2 bg-cyan-400 rounded-md text-sm"
                                value={filters.tag}
                                onChange={(e) => handleFilterChange("tag", e.target.value)}
                            >
                                <option value="">All Tags</option>
                                {allTags.map((tag) => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Country</label>
                            <select 
                                className="w-full p-2  bg-cyan-400 rounded-md text-sm"
                                value={filters.country}
                                onChange={(e) => handleFilterChange("country", e.target.value)}
                            >
                                <option value="">All Countries</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">State</label>
                            <select 
                                className="w-full p-2 bg-cyan-400 rounded-md text-sm"
                                value={filters.state}
                                onChange={(e) => handleFilterChange("state", e.target.value)}
                            >
                                <option value="">All States</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={toggleFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Apply
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};