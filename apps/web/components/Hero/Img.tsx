"use client";
import React, { useEffect, useState } from 'react';

interface CauseCircleProps {
  imageSrc: string;
  label: string;
  position?: 'top' | 'left' | 'right';
}

const CauseCircle: React.FC<CauseCircleProps> = ({ imageSrc, label, position = 'top' }) => {
  // Position-based styles for the label
  const getLabelStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2';
      case 'left':
        return 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2';
      case 'right':
        return 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2';
    }
  };

  return (
    <div className="relative group cursor-pointer transition-all duration-300 hover:scale-105">
      {/* Outer circle with gradient border */}
      <div className="rounded-full p-1 bg-gradient-to-r from-green-500 to-green-300">
        {/* Inner circle with image */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-white">
          <img 
            src={imageSrc} 
            alt={label} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Label */}
      <div className={`absolute ${getLabelStyles()} bg-gray-100 px-4 py-1 rounded-full shadow-md`}>
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
    </div>
  );
};


const CauseCircles: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setIsLoaded(true);
    }, []);
    // Define all 6 causes
    const Cause1 = { id: "Your cause", imageSrc: "/family.jpg", label: "Your cause" };
    const Cause2 = { id: "Health", imageSrc: "/health.jpeg", label: "Health" };
    const Cause3 = { id: "Education", imageSrc: "/education.jpeg", label: "Education" };
    const Cause4 = { id: "Sports", imageSrc: "/sports.avif", label: "Sports" };
    const Cause5 = { id: "Business", imageSrc: "/startup.png", label: "Business" };
    const Cause6 = { id: "Animal", imageSrc: "/dog.jpg", label: "Animal" };
    const Cause7 = { id: "Emergency", imageSrc: "/medical.jpeg", label: "Emergency" };

  return (
    <div className="flex items-start justify-center min-h-screen w-full pt-28">
      <div className={`relative w-5/6 mx-auto h-full md:h-[32rem] transition-opacity delay-1000 duration-1000 ${isLoaded ? 'opacity-40' : 'opacity-0'} `}>
        {/* Top center circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 ">
          <CauseCircle 
            imageSrc={Cause1.imageSrc}
            label={Cause1.label}
            position="left"
          />
        </div>
        
        {/* Left side circles */}
        <div className="absolute top-1/4 left-0">
          <CauseCircle 
            imageSrc={Cause2.imageSrc}
            label={Cause2.label}
            position="right"
          />
        </div>
        
        <div className="absolute top-1/2 left-4">
          <CauseCircle 
            imageSrc={Cause3.imageSrc}
            label={Cause3.label}
            position="right"
          />
        </div>
        
        <div className="absolute -bottom-7 left-20">
          <CauseCircle 
            imageSrc={Cause4.imageSrc}
            label={Cause4.label}
            position="right"
          />
        </div>
        
        {/* Right side circles */}
        <div className="absolute top-1/4 right-0">
          <CauseCircle 
            imageSrc={Cause5.imageSrc}
            label={Cause5.label}
            position="left"
          />
        </div>
        
        <div className="absolute top-1/2 right-4">
          <CauseCircle 
            imageSrc={Cause6.imageSrc}
            label={Cause6.label}
            position="left"
          />
        </div>
        
        <div className="absolute -bottom-7 right-20">
          <CauseCircle 
            imageSrc={Cause7.imageSrc}
            label={Cause7.label}
            position="left"
          />
        </div>
        
        {/* Connecting lines */}
        {/* Connecting lines with proper coordinates */}
        <div className="absolute inset-0 z-0 top-24">
          <svg className="w-full h-full " viewBox="0 0 1000 800" preserveAspectRatio="none">
            {/* Connect top circle to left side circles */}
            <path 
              d="M500,80 L120,200" 
              fill="none" 
              stroke="#7B808E" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
            <path 
              d="M500,80 L120,370" 
              fill="none" 
              stroke="#7B808E" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
            <path 
              d="M500,80 L175,600" 
              fill="none" 
              stroke="#7B808E" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
            
            {/* Connect top circle to right side circles */}
            <path 
              d="M500,80 L880,200" 
              fill="none" 
              stroke="#7B808E" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
            <path 
              d="M500,80 L880,370" 
              fill="none" 
              stroke="#7B808E" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
            <path 
              d="M500,80 L830,600" 
              fill="none" 
              stroke="#7B808E" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CauseCircles;