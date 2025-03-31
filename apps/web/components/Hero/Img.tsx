"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CauseCircleProps {
  imageSrc: string;
  label: string;
  position?: 'top' | 'left' | 'right';
  index: number;
}

const CauseCircle: React.FC<CauseCircleProps> = ({ imageSrc, label, position = 'top', index }) => {
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
    <motion.div 
      className="relative group cursor-pointer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: index * 0.2, 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05, 
        transition: { duration: 0.3 } 
      }}
    >
      {/* Outer circle with gradient border */}
      <motion.div 
        className="rounded-full p-1 bg-gradient-to-r from-green-500 to-green-300"
        whileHover={{ 
          boxShadow: "0 0 30px rgba(52, 211, 153, 0.7)",
          transition: { duration: 0.3 }
        }}
      >
        {/* Inner circle with image */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-4 border-white">
          <motion.img 
            src={imageSrc} 
            alt={label} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1, transition: { duration: 0.5 } }}
          />
        </div>
      </motion.div>
      
      {/* Label */}
      <motion.div 
        className={`absolute ${getLabelStyles()} bg-gray-100 px-4 py-1 rounded-full shadow-md`}
        initial={{ opacity: 0,}}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
      >
        <span className="text-gray-700 font-medium">{label}</span>
      </motion.div>
    </motion.div>
  );
};

const CauseCircles: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [linesVisible, setLinesVisible] = useState(Array(6).fill(false));
    
    useEffect(() => {
        setIsLoaded(true);
        
        // Animate lines sequentially
        linesVisible.forEach((_, index) => {
            setTimeout(() => {
                setLinesVisible(prev => {
                    const newState = [...prev];
                    newState[index] = true;
                    return newState;
                });
            }, 1500 + (index * 200)); // Stagger the line animations
        });
    }, []);
    
    // Define all causes
    const causes = [
      { id: "Your cause", imageSrc: "/family.jpg", label: "Your cause", position: "left" as const },
      { id: "Health", imageSrc: "/health.jpeg", label: "Health", position: "right" as const },
      { id: "Education", imageSrc: "/education.jpeg", label: "Education", position: "right" as const },
      { id: "Sports", imageSrc: "/sports.avif", label: "Sports", position: "right" as const },
      { id: "Business", imageSrc: "/startup.png", label: "Business", position: "left" as const },
      { id: "Animal", imageSrc: "/dog.jpg", label: "Animal", position: "left" as const },
      { id: "Emergency", imageSrc: "/medical.jpeg", label: "Emergency", position: "left" as const }
    ];

  // Define all paths
  const paths = [
    { d: "M500,80 L120,200", index: 0 },  // Top to left-top
    { d: "M500,80 L120,370", index: 1 },  // Top to left-middle
    { d: "M500,80 L175,600", index: 2 },  // Top to left-bottom
    { d: "M500,80 L880,200", index: 3 },  // Top to right-top
    { d: "M500,80 L880,370", index: 4 },  // Top to right-middle
    { d: "M500,80 L830,600", index: 5 },  // Top to right-bottom
  ];

  return (
    <div className="flex items-start justify-center min-h-screen w-full pt-28">
        <motion.div 
            className="relative w-5/6 mx-auto h-full md:h-[32rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1 }}
        >
            {/* Top center circle */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                <CauseCircle 
                    imageSrc={causes[0]!.imageSrc}
                    label={causes[0]!.label}
                    position={causes[0]!.position}
                    index={0}
                />
            </div>
            
            {/* Left side circles */}
            <div className="absolute top-1/4 left-0 z-10 blur-md hover:blur-0 transition-all duration-500 ease-in-out">
                <CauseCircle 
                    imageSrc={causes[1]!.imageSrc}
                    label={causes[1]!.label}
                    position={causes[1]!.position}
                    index={1}
                />
            </div>
            
            <div className="absolute top-1/2 left-4 z-10 blur-md hover:blur-0 transition-all duration-500 ease-in-out">
                <CauseCircle 
                    imageSrc={causes[2]!.imageSrc}
                    label={causes[2]!.label}
                    position={causes[2]!.position}
                    index={2}
                />
            </div>
            
            <div className="absolute -bottom-7 left-20 z-10 blur-md hover:blur-0 transition-all duration-500 ease-in-out">
                <CauseCircle 
                    imageSrc={causes[3]!.imageSrc}
                    label={causes[3]!.label}
                    position={causes[3]!.position}
                    index={3}
                />
            </div>
            
            {/* Right side circles */}
            <div className="absolute top-1/4 right-0 z-10 blur-md hover:blur-0 transition-all duration-500 ease-in-out">
                <CauseCircle 
                    imageSrc={causes[4]!.imageSrc}
                    label={causes[4]!.label}
                    position={causes[4]!.position}
                    index={4}
                />
            </div>
         
            <div className="absolute top-1/2 right-4 z-10 blur-md hover:blur-0 transition-all duration-500 ease-in-out">
                <CauseCircle 
                    imageSrc={causes[5]!.imageSrc}
                    label={causes[5]!.label}
                    position={causes[5]!.position}
                    index={5}
                />
            </div>
            
                <div className="absolute -bottom-7 right-10 z-20 blur-md hover:blur-0 transition-all duration-500 ease-in-out">
                <CauseCircle 
                    imageSrc={causes[6]!.imageSrc}
                    label={causes[6]!.label}
                    position={causes[6]!.position}
                    index={6}
                />
            </div>
            
            {/* Connecting lines with properly animated dotted lines */}
            <div className="absolute inset-0 z-0 top-24 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="none">
                    {paths.map((path, i) => (
                        <motion.path 
                            key={i}
                            d={path.d} 
                            fill="none" 
                            stroke="#7B808E" 
                            strokeWidth="4"
                            strokeDasharray="5,5"  // Makes the path dotted
                            strokeDashoffset="10"  // Initial offset
                            initial={{ opacity: 0, pathLength: 0, strokeDashoffset: 10 }}
                            animate={{ 
                                pathLength: linesVisible[i] ? 1 : 0,
                                opacity: linesVisible[i] ? 0.7 : 0,
                                strokeDashoffset: linesVisible[i] ? [10, 0] : 10// Moves the dashes
                            }}
                            transition={{ 
                                duration: 0.8,
                                ease: "easeInOut",
                                repeat: Infinity, // Makes the dash animation continuous
                                repeatType: "reverse"
                            }}
                        />
                    ))}
                </svg>

            </div>
      </motion.div>
    </div>
  );
};

export default CauseCircles;