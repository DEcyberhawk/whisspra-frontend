
import React, { useState } from 'react';
import { Conversation, User, MessageSendContent } from '../../types';

interface MessageInputProps {
    onSendMessage: (content: MessageSendContent) => void;
    [key: string]: any; // Accept other props but ignore them for this visual update
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        if (text.trim()) {
            onSendMessage({ type: 'text', content: text, isGhost: false });
            setText('');
        }
    };

    return (
        <div className="p-4 bg-gray-100 dark:bg-[#36393f] flex-shrink-0">
            <div className="bg-white dark:bg-slate-700 rounded-lg flex items-center px-2">
                <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-1 bg-transparent py-3 px-2 text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSend()) : null}
                />
                <div className="flex items-center space-x-1 p-2">
                    <button className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </button>
                    <button className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;
