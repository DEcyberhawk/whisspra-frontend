import React from 'react';
import { GhostNoteMessage } from '../../types';

interface GhostNoteBubbleProps {
    message: GhostNoteMessage;
}

const GhostNoteBubble: React.FC<GhostNoteBubbleProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-end w-full">
            <div className="max-w-sm md:max-w-md w-full flex justify-end">
                <div className="bg-slate-800/60 border-2 border-dashed border-slate-700 rounded-2xl rounded-br-none px-4 py-2">
                    <p className="text-sm text-slate-300" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {message.text}
                    </p>
                </div>
            </div>
            <p className="flex items-center text-xs text-slate-500 mt-1 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a6 6 0 00-6 6v3.586A3 3 0 012.586 13H2v2h2.586A3 3 0 017 16.414V18h6v-1.586A3 3 0 0115.414 15H18v-2h-.586A3 3 0 0116 11.586V8a6 6 0 00-6-6zm-3 8a1 1 0 112 0 1 1 0 01-2 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <span>Ghost Note (Only you can see this)</span>
            </p>
        </div>
    );
};

export default GhostNoteBubble;
