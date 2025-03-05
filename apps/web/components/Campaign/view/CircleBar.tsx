import { CircleProgressBar } from '@/components/Progress/CircleProgress';
import React from 'react';

import { useEffect, useState } from 'react';
export const CircleBar = ({
  max
}: {
  max: number;
}) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        if (percentage < max) {
            setPercentage((prev) => prev + 5);
        } else {
            clearInterval(interval);
        }
        }, 100);

        return () => clearInterval(interval);
    }, [percentage,max]);
    return (
        <CircleProgressBar percentage={percentage}/>
    );
};
