'use client'
import { useState } from "react";

export const Description = ({text}:{text:string}) => {
    
  
    const [expanded, setExpanded] = useState(false);
    const previewText = text.slice(0, 300) + "..."; // Show only first 200 characters initially
  
    return (
      <p className="text-gray-400 mt-2">
        {expanded ? text : previewText}
        <span
          className="text-blue-500 cursor-pointer ml-2 font-medium"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Less" : "More..."}
        </span>
      </p>
    );
};