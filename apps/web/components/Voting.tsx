'use client';

import { CrowdFundingABI } from "@repo/common/ABI";
import { useState } from "react";
import { useWriteContract } from "wagmi";

export const Voting = () => {
    const { data: hash, writeContract } = useWriteContract();
    
    const [selectedVote, setSelectedVote] = useState<string>('');  // Dropdown selection
    const [inputVote, setInputVote] = useState<string>('');        // Written input

    function handleVoting() {
        if (!selectedVote || !inputVote) {
            alert("Please select and type 'Yes' or 'No'");
            return;
        }

        // Convert input to lowercase for case-insensitive comparison
        const isVoteYes = selectedVote.toLowerCase() === "yes";

        if (selectedVote.toLowerCase() !== inputVote.toLowerCase()) {
            alert("Mismatch! The written input must match the selected option.");
            return;
        }

        try {
            // Send transaction
            writeContract({
                address: "0x8398bCD4f633C72939F9043dB78c574A91C99c0A",
                abi: CrowdFundingABI,
                functionName: "vote",
                args: [isVoteYes],
            });

            console.log("Transaction sent! Hash:", hash);
        } catch (error) {
            console.error("Transaction error:", error);
        }
    }

    return (
        <div className="p-4 border rounded-lg shadow-lg w-96 mx-auto">
            <h2 className="text-xl font-bold mb-4">Vote for Funding</h2>

            {/* Dropdown for Yes/No */}
            <label className="block mb-2">Choose your vote:</label>
            <select
                value={selectedVote}
                onChange={(e) => setSelectedVote(e.target.value)}
                className="w-full p-2 border rounded mb-4"
            >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>

            {/* Text Input for Yes/No */}
            <label className="block mb-2">Type your vote:</label>
            <input
                type="text"
                value={inputVote}
                onChange={(e) => setInputVote(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Type 'Yes' or 'No'"
            />

            {/* Submit Button */}
            <button
                onClick={handleVoting}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Submit Vote
            </button>
        </div>
    );
};
