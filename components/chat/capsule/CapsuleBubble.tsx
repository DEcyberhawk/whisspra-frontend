import React, { useState, useEffect, useMemo } from 'react';
import { CapsuleMessage } from '../../../types';

interface CapsuleBubbleProps {
    message: CapsuleMessage;
    isOwnMessage: boolean;
}

const formatTimeLeft = (difference: number) => {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const CapsuleBubble: React.FC<CapsuleBubbleProps> = ({ message, isOwnMessage }) => {
    const releaseAt = useMemo(() => new Date(message.releaseAt), [message.releaseAt]);
    const [isUnlocked, setIsUnlocked] = useState(new Date() >= releaseAt);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (isUnlocked) return;

        const updateTimer = () => {
            const now = new Date();
            const difference = releaseAt.getTime() - now.getTime();

            if (difference <= 0) {
                setIsUnlocked(true);
                if (interval) clearInterval(interval);
                return;
            }
            setTimeLeft(formatTimeLeft(difference));
        };

        const interval = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(interval);
    }, [isUnlocked, releaseAt]);

    const textColor = isOwnMessage ? 'text-indigo-200' : 'text-slate-400';

    if (isUnlocked) {
        return (
            <div className="p-2 border-l-4 border-indigo-400/50">
                 <p className="text-xs text-indigo-300 font-semibold mb-1">Memory Capsule Unlocked</p>
                <p className="text-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {message.text}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center p-4 w-56">
            <div className={`mb-3 ${textColor}`}>
                <LockIcon />
            </div>
            <p className="text-sm font-semibold">Memory Capsule</p>
            <p className={`text-xs ${textColor}`}>Unlocks in</p>
            <p className="text-lg font-mono font-bold mt-1">{timeLeft || '...'}</p>
        </div>
    );
};

export default CapsuleBubble;