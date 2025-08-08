
import React, { useState } from 'react';
import { SafetyAnalysis } from '../../../types';

interface SafetyWarningBubbleProps {
    analysis: SafetyAnalysis;
    children: React.ReactNode;
}

const WarningIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.01a1 1 0 010 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);


const SafetyWarningBubble: React.FC<SafetyWarningBubbleProps> = ({ analysis, children }) => {
    const [isRevealed, setIsRevealed] = useState(false);

    const warningMessages = {
        deepfake: 'Potential Deepfake Detected',
        scam_link: 'Suspicious Link Detected',
    };

    const warningText = analysis.type ? warningMessages[analysis.type] : 'Potentially harmful content';
    
    if (isRevealed) {
        return <>{children}</>;
    }

    return (
        <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-3 w-64">
            <div className="flex">
                <WarningIcon />
                <div>
                    <h3 className="text-sm font-bold text-yellow-300">{warningText}</h3>
                    <p className="text-xs text-yellow-400/80 mt-1">{analysis.reason || 'This content was flagged by our AI as potentially harmful.'}</p>
                    <button 
                        onClick={() => setIsRevealed(true)}
                        className="text-xs font-semibold text-white mt-3 bg-yellow-500/20 hover:bg-yellow-500/40 px-2 py-1 rounded-md"
                    >
                        View Anyway
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SafetyWarningBubble;