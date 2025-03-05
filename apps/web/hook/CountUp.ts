import { useEffect, useState } from "react";

export const useCountUp = (end:number, duration = 2000, start = 0) => {
    const [count, setCount] = useState(start);
    
    useEffect(() => {
        let startTime:number;
        let animationFrame:number;
        
        const animate = (timestamp:number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentCount = Math.floor(progress * (end - start) + start);
        
        setCount(currentCount);
        
        if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
        }
        };
        
        animationFrame = requestAnimationFrame(animate);
        
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, start]);
    
    return count;
};