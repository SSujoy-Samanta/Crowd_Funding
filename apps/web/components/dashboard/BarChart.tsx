'use client';
import React, { useState, useEffect, SetStateAction } from "react";
import { RxCrossCircled } from "react-icons/rx";
interface BarChartProps{
    total:number,
    yes:number,
    no: number,
    setChart:React.Dispatch<SetStateAction<boolean>>
}
const VerticalVoteBarChart = ({total,yes,no,setChart}:BarChartProps) => {
    // Sample data - replace with your actual data
    const [data, setData] = useState({
        total,
        yes,
        no,
        pending:(total-(yes+no))
    });

    // Animation state
    const [animated, setAnimated] = useState({
        yes: 0,
        no: 0,
        pending: 0,
    });

    // Colors for the bars
    const colors = {
        yes: "bg-green-500",
        no: "bg-red-500",
        pending: "bg-yellow-500",
    };

    // Labels for categories
    const labels = {
        yes: "Yes",
        no: "No",
        pending: "Pending",
    };

    // Animate on load
    useEffect(() => {
        const duration = 1000; // Animation duration in ms
        const steps = 20; // Number of animation steps
        const interval = duration / steps;

        let step = 0;

        const timer = setInterval(() => {
        step++;
        setAnimated((prev) => ({
            yes: Math.min((data.yes * step) / steps, data.yes),
            no: Math.min((data.no * step) / steps, data.no),
            pending: Math.min((data.pending * step) / steps, data.pending),
        }));

        if (step >= steps) {
            clearInterval(timer);
        }
        }, interval);

        return () => clearInterval(timer);
    }, [data]);

   

    // Calculate the max value for scaling
    const maxValue = Math.max(...Object.values(data)) || 1;
    
    return (
        <div className="w-full max-w-lg p-10 bg-white rounded-lg shadow-lg relative ">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Vote Results</h2>
         <div className="flex justify-center items-center p-2 absolute top-2 right-2 cursor-pointer " onClick={()=>{setChart(x=>!x)}}>
            <RxCrossCircled size={25} color="red"/>
        </div>

        {/* Total votes counter */}
        <div className="flex justify-between mb-4">
            <span className="font-medium">Total Votes:</span>
            <span className="font-bold">{data.total}</span>
        </div>

        {/* Vertical chart container */}
        <div className="relative flex justify-around items-end h-64 mb-6 border-b border-l border-gray-300 ">
            {/* Y-axis labels */}
            <div className="absolute -left-5 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                {[1, 0.75, 0.5, 0.25, 0].map((mark) => (
                    <span key={mark}>{Number((maxValue * mark).toFixed(1))}</span>
                ))}
            </div>

            {/* Horizontal grid lines */}
            <div className="absolute left-0 top-0 w-full h-full">
                {[0.25, 0.5, 0.75, 1].map((mark) => (
                    <div
                        key={mark}
                        className="border-t border-gray-200 absolute w-full"
                        style={{ top: `${100 - mark * 100}%` }}
                    />
                ))}
            </div>

            {/* Bars */}
            {Object.entries(animated).map(([key, value]) => {
                const typedKey = key as keyof typeof animated; // Ensure TypeScript understands the key type

                return (
                    <div key={key} className="flex flex-col items-center w-16 h-full ">
                        
                        <div className="absolute flex flex-col items-center z-20">
                            {/* Vote count and percentage */}
                            <div className="text-sm font-medium">{Math.round(value)}</div>
                            <div className="text-xs text-gray-500">
                                ({Math.round((value / data.total) * 100)}%)
                            </div>
                            <span className="text-sm font-medium">{labels[typedKey]}</span>
                        </div>
                        {/* Bar container */}
                        <div className="relative h-full w-10 flex items-end">
                            <div
                                className={`w-full ${colors[typedKey]} transition-all duration-500 ease-out`}
                                style={{
                                    height: `${(value / maxValue) * 100}%`, // Ensures proper scaling
                                    maxHeight: "100%",
                                }}
                            />
                            
                        </div>

                    
                
                    </div>
                );
                })}


        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mb-4">
            {Object.entries(colors).map(([key, color]) => {
                const typedKey = key as keyof typeof animated;
            return <div key={key} className="flex items-center">
                <div className={`w-4 h-4 ${color} rounded mr-1`} />
                <span className="text-sm capitalize">{labels[typedKey]}</span>
            </div>
            })}
        </div>
        </div>
    );
};

export default VerticalVoteBarChart;
