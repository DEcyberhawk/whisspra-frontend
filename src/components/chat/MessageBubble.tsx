

import React from 'react';
import { ChatMessage, User } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const MessageStatus: React.FC<{ status?: 'sent' | 'delivered' | 'glimpsed' | 'read' }> = ({ status }) => {
    const { theme } = useTheme();

    const GlimpsedIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C3.732 4.943 9.522 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-9.03 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
    );

    const ReadIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: theme === 'dark' ? 'var(--color-accent)' : 'var(--color-primary)' }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    );

    switch (status) {
        case 'sent':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
        case 'delivered':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; // Mock, better icon needed
        case 'glimpsed':
            return <GlimpsedIcon />;
        case 'read':
            return <ReadIcon />;
        default:
            return null;
    }
};

interface MessageBubbleProps {
    message: ChatMessage;
    isOwnMessage: boolean;
    sender: User;
    // Other props are unused in this visual update
    [key: string]: any; 
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, sender }) => {
    
    const bubbleWrapperClasses = isOwnMessage
        ? 'flex items-end gap-2 max-w-lg md:max-w-xl self-end flex-row-reverse'
        : 'flex items-end gap-2 max-w-lg md:max-w-xl self-start';

    const bubbleClasses = isOwnMessage
        ? 'bg-emerald-200 dark:bg-emerald-800 text-slate-800 dark:text-emerald-100 rounded-2xl rounded-br-none'
        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-bl-none';

    if (message.type !== 'text') {
        // This visual update focuses on text messages as per the image
        return null;
    }

    return (
         <div className={bubbleWrapperClasses}>
             <div className="flex flex-col">
                <div className={`${bubbleClasses} px-4 py-2`}>
                    <p className="text-base" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {message.text}
                    </p>
                </div>
                 <div className={`flex items-center gap-1 mt-1 px-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <p className={`text-xs text-slate-400 dark:text-slate-500`}>
                        {message.timestamp}
                    </p>
                    {isOwnMessage && (
                        <div className="text-slate-400 dark:text-slate-500">
                           <MessageStatus status={message.readStatus} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
