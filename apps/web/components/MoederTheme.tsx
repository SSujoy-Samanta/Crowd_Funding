"use client"
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WaveProps {
  color: string;
  speed: number;
  opacity: number;
  offset: number;
}

const ModernUITheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Track scroll for parallax effects
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Dynamic gradient orbs that follow mouse
  const gradientOrbs = [
    { color: '#4F46E5', x: mousePosition.x * 0.02, y: mousePosition.y * 0.02 + scrollPosition * 0.05 },
    { color: '#7C3AED', x: mousePosition.x * -0.01, y: mousePosition.y * -0.01 + scrollPosition * 0.03 },
    { color: '#EC4899', x: mousePosition.x * 0.01, y: mousePosition.y * 0.01 - scrollPosition * 0.04 },
  ];
  
  // Wave animation components
  const waves: WaveProps[] = [
    { color: '#818CF8', speed: 15, opacity: 0.3, offset: 0 },
    { color: '#C084FC', speed: 20, opacity: 0.2, offset: 120 },
    { color: '#F472B6', speed: 25, opacity: 0.1, offset: 240 },
  ];
  
  const WaveComponent: React.FC<WaveProps> = ({ color, speed, opacity, offset }) => {
    return (
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-64"
        initial={{ translateX: 0 }}
        animate={{ 
          translateX: [0, -100, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ opacity }}
      >
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1440 320" 
          preserveAspectRatio="none"
          style={{ transform: `translateX(${offset}px)` }}
        >
          <path 
            fill={color} 
            fillOpacity="1" 
            d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,149.3C672,171,768,181,864,170.7C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </motion.div>
    );
  };
  
  // Cool grid pattern for background
  const GridPattern = () => {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden opacity-5">
        <div className="absolute inset-0 bg-grid-pattern" 
          style={{ 
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-x-hidden" ref={containerRef}>
      {/* Background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 bg-gray-900"
          style={{
            background: 'linear-gradient(45deg, #0f172a 0%, #1e293b 100%)'
          }}
        />
        
        {/* Dynamic gradient orbs */}
        {gradientOrbs.map((orb, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full blur-3xl"
            animate={{
              x: orb.x,
              y: orb.y,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              width: `${index === 0 ? '600px' : index === 1 ? '700px' : '500px'}`,
              height: `${index === 0 ? '600px' : index === 1 ? '700px' : '500px'}`,
              left: `${index === 0 ? '10%' : index === 1 ? '60%' : '30%'}`,
              top: `${index === 0 ? '20%' : index === 1 ? '50%' : '10%'}`,
              opacity: 0.4,
            }}
          />
        ))}
        
        {/* Grid pattern */}
        <GridPattern />
        
        {/* Wave animations at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          {waves.map((wave, index) => (
            <WaveComponent key={index} {...wave} />
          ))}
        </div>
      </div>
      
      {/* Animated content entrance */}
       <AnimatePresence>
        {children}
      </AnimatePresence>
      
      {/* Decorative elements */}
      <div className="fixed top-10 right-10 w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 blur-xl opacity-20" />
      <div className="fixed bottom-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 blur-xl opacity-20" />
    </div>
  );
};

export default ModernUITheme;