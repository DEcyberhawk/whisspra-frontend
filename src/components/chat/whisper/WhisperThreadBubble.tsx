
import React from 'react';
import { SystemMessage } from '../../../types';

interface WhisperThreadBubbleProps {
    message: SystemMessage;
    onOpenWhisperThread: (conversationId: string) => void;
}

const WhisperThreadBubble: React.FC<WhisperThreadBubbleProps> = ({ message, onOpenWhisperThread }) => {
    return (
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-2">
            <span>{message.text}</span>
            {message.relatedConversationId && (
                <button 
                    onClick={() => onOpenWhisperThread(message.relatedConversationId!)} 
                    className="ml-2 text-indigo-400 hover:underline font-semibold"
                >
                    View thread
                </button>
            )}
        </div>
    );
};

export default WhisperThreadBubble;
