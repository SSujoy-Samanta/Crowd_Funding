"use client"
import { useEffect, useState } from "react";
interface AnimatedProgressBarProps{
    raised:number;
    goal:number;
    color?:string
}
export const AnimatedProgressBar = ({ raised, goal, color = "from-blue-400 to-indigo-600" }:AnimatedProgressBarProps) => {
    const percentage = Math.min((raised / goal) * 100, 100);
    const [width, setWidth] = useState(0);
    
    useEffect(() => {
      setTimeout(() => setWidth(percentage), 200);
    }, [percentage]);
    
    return (
      <div className="mt-2 mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-bold text-gray-800">{raised.toLocaleString()} eth</span>
          <span className="text-gray-500">Goal: {goal.toLocaleString()} eth</span>
        </div>
        <div className="h-3 bg-gray-200 bg-opacity-40 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1500 ease-out`}
            style={{ width: `${width}%` }}
          ></div>
        </div>
        <div className="text-right text-xs font-medium mt-1 text-gray-500">
          {Math.round(percentage)}% Funded
        </div>
      </div>
    );
};