

import React from 'react';
import { ChatHeaderProps } from '../../types';
import Avatar from '../Avatar';

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
    onBack, 
    conversation,
}) => {
    const name = conversation.type === 'direct' ? conversation.otherUser.name : conversation.name;
    const isOnline = conversation.type === 'direct' && conversation.otherUser.isOnline;
    const presence = conversation.type === 'direct' ? conversation.otherUser.presence : undefined;
    const avatarUser = conversation.type === 'direct' ? conversation.otherUser : { name: conversation.name, avatar: 'G', isOnline: false };

    const getStatusText = () => {
        if (presence?.message) {
            return <p className="text-sm text-slate-400 truncate">{presence.message}</p>;
        }
        if (isOnline) {
            return <p className="text-sm text-green-500">Online</p>;
        }
        if (presence && presence.status !== 'online') {
            return <p className="text-sm text-yellow-400 capitalize">{presence.status}</p>;
        }
        return <p className="text-sm text-slate-500">Offline</p>
    };

    return (
        <header className="flex-shrink-0 flex items-center justify-between p-4 bg-gray-100 dark:bg-[#36393f] border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Avatar avatar={avatarUser.avatar || ''} name={avatarUser.name || 'U'} size="md" className="w-12 h-12" />
                    {isOnline && <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-gray-100 dark:border-[#36393f]"></span>}
                </div>
                <div>
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white">{name}</h2>
                    {getStatusText()}
                </div>
            </div>
            <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
                 <button className="hover:text-slate-800 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </button>
                 <button className="hover:text-slate-800 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                 </button>
            </div>
        </header>
    );
};

export default ChatHeader;