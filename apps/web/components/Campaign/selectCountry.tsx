"use client";

import React, { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { countries } from "@/utils/country";

interface CountryProps{
    selectedCountry:string;
    setSelectedCountry:React.Dispatch<SetStateAction<string>>;
    selectedState:string;
    setSelectedState:React.Dispatch<SetStateAction<string>>;
}

export  function CountryStateSelect({
    selectedCountry, 
    setSelectedCountry,
    selectedState, 
    setSelectedState
}:CountryProps
){
    
    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCountry(event.target.value);
        setSelectedState(""); // Reset state when country changes
    };

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full p-3  flex justify-between gap-5"
        >
            {/* Country Selection */}
            <div className="mb-2 w-2/6">
                <label className="block text-gray-900 font-medium mb-1">Country</label>
                <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-md focus:ring-2 focus:ring-blue-400 transition"
                >
                    <option value="" disabled>Select a country</option>
                    {countries.map((country) => (
                        <option key={country.code} value={country.name}>
                        {country.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* State Selection */}
            {selectedCountry && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-2/6"
                >
                <label className="block text-gray-900 font-medium mb-1">State</label>
                <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white shadow-md focus:ring-2 focus:ring-blue-400 transition"
                >
                    <option value="" disabled>Select a state</option>
                    {countries
                    .find((c) => c.name === selectedCountry)
                    ?.states.map((state) => (
                        <option key={state} value={state}>
                        {state}
                        </option>
                    ))}
                </select>
                </motion.div>
            )}
        </motion.div>
    );
}
