// components/TimeAgo.tsx
import { useState, useEffect } from 'react';

const TIME_INTERVALS = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
];

export function formatTimeAgo(timestamp: string | Date): string {
    // If timestamp is a string date or ISO format, convert to Date object
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    // Get time difference in seconds - fixed TypeScript error by getting timestamps
    const secondsDiff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    // Just now for very recent comments
    if (secondsDiff < 5) return 'just now';
    
    // Find the appropriate time interval
    const interval = TIME_INTERVALS.find(i => i.seconds <= secondsDiff);
    
    if (!interval) return 'just now';
    
    // Calculate units (e.g., 2 hours, 5 minutes, etc.)
    const count = Math.floor(secondsDiff / interval.seconds);     
    
    // Format the output with proper pluralization
    return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}

interface TimeAgoProps {
  timestamp: string | Date;
  updateInterval?: number;
}

export function TimeAgo({ timestamp, updateInterval = 60000 }: TimeAgoProps): JSX.Element {
    const [timeAgo, setTimeAgo] = useState<string>(() => formatTimeAgo(timestamp));
    
    useEffect(() => {
        // Update immediately on new timestamp
        setTimeAgo(formatTimeAgo(timestamp));
        
        // Set up the interval for live updates
        const intervalId = setInterval(() => {
        setTimeAgo(formatTimeAgo(timestamp));
        }, updateInterval);
        
        // Clean up on unmount
        return () => clearInterval(intervalId);
    }, [timestamp, updateInterval]);
    
    return <span>{timeAgo}</span>;
}


