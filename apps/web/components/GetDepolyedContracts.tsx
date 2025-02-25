"use client";

import { CrowdfundingFactoryABI } from "@repo/common/ABI";
import { useReadContract } from "wagmi";
import { motion } from "framer-motion";
import { type Address } from "viem";
import { useEffect, useState } from "react";

export const GetDeployedContracts = () => {
    const [addressData, setAddressData] = useState<`0x${string}`[]>([]);
    const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address | undefined;

    if(!FACTORY_ADDRESS){
        return;
    }
    const { data, isLoading, error } = useReadContract({
        address: FACTORY_ADDRESS,
        abi: CrowdfundingFactoryABI,
        functionName: "getDeployedContracts",
    });

    // Effect to update state when data changes
    useEffect(() => {
        if (Array.isArray(data)) {
            setAddressData(data);
        }
    }, [data]);

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-6 text-gray-700 relative top-32"
            >
                <p className="mt-3 text-lg font-semibold">Fetching Deployed Contracts...</p>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-6 text-red-600 relative top-32"
            >
                <p className="mt-3 text-lg font-semibold">Failed to load contracts</p>
                <p className="text-sm">{error?.message}</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto p-6 bg-cyan-700 shadow-lg rounded-lg relative top-32"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Deployed Contracts ({addressData.length})
            </h2>

            {addressData.length === 0 ? (
                <p className="text-gray-500">No contracts deployed yet.</p>
            ) : (
                <ul className="space-y-3">
                    {addressData.map((address) => (
                        <motion.li
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-4 bg-gray-800 rounded-md shadow-sm"
                        >
                            <p className="font-mono text-blue-600 truncate">{address}</p>
                        </motion.li>
                    ))}
                </ul>
            )}
        </motion.div>
    );
};
