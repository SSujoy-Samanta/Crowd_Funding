"use client"
import { useCountUp } from "@/hook/CountUp";
import { ArrowUp, LucideProps } from "lucide-react";

interface StatCardProps{
  title:string, 
  value:string,
  trend?:string,
  IconComponent: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
  bgGradient:string,
  animationDelay?:string,
  originalValue?:number
}

export const StatCard = ({  title, value, trend, IconComponent, bgGradient, animationDelay = "0",originalValue=0 }:StatCardProps) => {
  const animatedValue = useCountUp(parseInt(value.replace(/[^0-9]/g, '')), 1500);
  const displayValue = typeof value === 'string' && value.includes('$') ? 
    `${animatedValue.toLocaleString()} ETH` : animatedValue;

  return (
    <div 
      className={`rounded-2xl p-6 text-white shadow-lg transform transition-all duration-500 hover:scale-105 ${bgGradient}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex justify-between items-start">
        <div className="bg-white bg-opacity-20 p-3 rounded-2xl">
          <IconComponent size={24} className="text-white" />
        </div>
        {trend && (
          <div className="flex items-center bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
            <ArrowUp size={12} className="mr-1" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-white text-opacity-80 mt-4 text-sm uppercase tracking-wide font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-1">{originalValue?`${originalValue} ETH`:displayValue}</p>
    </div>
  );
};