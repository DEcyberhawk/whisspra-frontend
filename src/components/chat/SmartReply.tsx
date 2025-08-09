import React from 'react';
import { SmartReply as SmartReplyType } from '../../types';

interface SmartReplyProps {
    suggestions: SmartReplyType[];
    loading: boolean;
    onSelectReply: (text: string) => void;
}

const SmartReply: React.FC<SmartReplyProps> = ({ suggestions, loading, onSelectReply }) => {
    
    if (loading) {
        return (
            <div className="px-4 pb-2 pt-1 flex items-center space-x-2">
                <div className="animate-pulse h-8 w-24 bg-slate-700 rounded-full"></div>
                <div className="animate-pulse h-8 w-20 bg-slate-700 rounded-full"></div>
                <div className="animate-pulse h-8 w-28 bg-slate-700 rounded-full"></div>
            </div>
        );
    }
    
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="px-4 pb-2 pt-1">
             <div className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap pb-2">
                {suggestions.map((reply) => (
                    <button
                        key={reply.id}
                        onClick={() => onSelectReply(reply.text)}
                        className="inline-block bg-slate-700/80 text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full hover:bg-slate-600/80 transition-colors duration-200 backdrop-blur-sm border border-slate-600"
                    >
                        {reply.text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SmartReply;
