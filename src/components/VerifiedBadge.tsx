
import React from 'react';

interface VerifiedBadgeProps {
    size?: 'xs' | 'sm' | 'md';
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 'sm' }) => {
    const sizeClasses = {
        xs: 'w-3.5 h-3.5',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
    };
    
    return (
        <div className={`flex-shrink-0 ${sizeClasses[size]}`} title="Verified User">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
        </div>
    );
};

export default VerifiedBadge;
