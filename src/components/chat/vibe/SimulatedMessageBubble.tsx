
import React from 'react';
import { SimulatedTextMessage, User } from '../../../types';

interface SimulatedMessageBubbleProps {
    message: SimulatedTextMessage;
    isOwnMessage: boolean;
    sender?: User | null;
    onSendForReal: (text: string) => void;
}

const UserAvatar: React.FC<{ user?: User | null }> = ({ user }) => (
     <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center flex-shrink-0 font-bold text-slate-800 dark:text-white">
        {user?.avatar}
    </div>
);

const SimulatedMessageBubble: React.FC<SimulatedMessageBubbleProps> = ({ message, isOwnMessage, sender, onSendForReal }) => {
    const isAiReply = !isOwnMessage && !message.isHypothetical;

    const bubbleClasses = isOwnMessage
        ? 'bg-indigo-900/30 border-indigo-700/50'
        : 'bg-slate-800/40 border-slate-700/50';

    return (
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-end gap-2 max-w-sm md:max-w-md ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-shrink-0 self-end">
                     {!isOwnMessage && <UserAvatar user={sender} />}
                </div>

                <div className="flex flex-col group">
                    <div className={`px-4 py-2 rounded-2xl border ${bubbleClasses}`}>
                        {isAiReply && <p className="text-xs font-bold text-indigo-400 capitalize mb-1">{message.tone} Tone</p>}
                        <p className="text-sm text-slate-300" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {message.text}
                        </p>
                    </div>
                    {message.isHypothetical && (
                        <div className="mt-2 flex justify-end">
                             <button
                                onClick={() => onSendForReal(message.text)}
                                className="text-xs bg-indigo-500 text-white font-semibold py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Send for Real
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <p className={`flex items-center text-xs text-slate-500 mt-1 ${isOwnMessage ? 'mr-2' : 'ml-10'}`}>
                (Simulated)
            </p>
        </div>
    );
};

export default SimulatedMessageBubble;
