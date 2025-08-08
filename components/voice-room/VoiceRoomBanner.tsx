
import React from 'react';

interface VoiceRoomBannerProps {
    onJoin: () => void;
}

const VoiceRoomBanner: React.FC<VoiceRoomBannerProps> = ({ onJoin }) => {
    return (
        <div className="bg-green-500/10 text-green-300 p-3 flex items-center justify-between text-sm border-b border-green-800/50 animate-fade-in">
            <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-green-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0m-12.728 0l12.728 12.728" />
                </svg>
                <p className="font-bold">A live voice chat is happening now.</p>
            </div>
            <button
                onClick={onJoin}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full text-xs"
            >
                Join
            </button>
        </div>
    );
};

export default VoiceRoomBanner;
