

import React, { useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Conversation, TDMSettings } from '../../types';
import Avatar from '../Avatar';
import { useSocket } from '../../context/SocketContext';
import AuraStatusRail from './AuraStatusRail';
import UserProfileBar from './UserProfileBar';

interface SidebarProps {
    conversations: Conversation[];
    selectedConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onOpenSettings: () => void;
    onActivateWhistleblower: () => void;
    onOpenCreateGroup: () => void;
    onViewChange: (view: 'chats' | 'marketplace' | 'dashboard' | 'edu') => void;
    currentView: 'chats' | 'marketplace' | 'dashboard' | 'edu';
    tdmSettings: Record<string, TDMSettings>;
    showHiddenChats: boolean;
    onToggleShowHiddenChats: () => void;
}

const SearchBar: React.FC<{ onOpenCreateGroup: () => void; }> = ({ onOpenCreateGroup }) => {
    return (
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center space-x-2">
            <div className="relative flex-1">
                 <input type="text" placeholder="Search chats..." className="w-full bg-gray-200 dark:bg-slate-800 border-transparent rounded-lg py-2 pl-4 pr-10 text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
        </div>
    );
};

const ConversationItem: React.FC<{ conv: Conversation; isSelected: boolean; onSelect: () => void; }> = ({ conv, isSelected, onSelect }) => {
    const name = conv.type === 'direct' ? conv.otherUser.name : conv.name;
    const avatarUser = conv.type === 'direct' ? conv.otherUser : { name: conv.name, avatar: conv.name.charAt(0).toUpperCase(), isOnline: false };
    const itemRef = useRef<HTMLLIElement>(null);
    const socket = useSocket();
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && conv.unreadCount > 0 && socket) {
                    socket.emit('glimpseMessages', { conversationId: conv.id });
                    // We don't update the unread count here, that happens on full 'read'
                }
            },
            { threshold: 0.8 } // Trigger when 80% of the item is visible
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => {
            if (itemRef.current) {
                observer.unobserve(itemRef.current);
            }
        };
    }, [conv.id, conv.unreadCount, socket]);

    return (
        <li ref={itemRef} onClick={onSelect} className={`flex items-center p-3 cursor-pointer transition-colors duration-200 rounded-lg mx-2 ${isSelected ? 'bg-gray-200 dark:bg-slate-700' : 'hover:bg-gray-200/50 dark:hover:bg-slate-700/50'}`}>
            <div className="relative flex-shrink-0">
                <Avatar avatar={avatarUser.avatar || ''} name={avatarUser.name || 'U'} className="w-12 h-12 text-xl" />
                {avatarUser.isOnline && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-gray-100 dark:border-[#2F3136]"></span>}
            </div>
            <div className="flex-1 ml-3 min-w-0">
                <p className="font-semibold text-sm truncate text-slate-800 dark:text-white">{name}</p>
                <p className="text-xs truncate text-slate-500 dark:text-slate-400">{conv.lastMessage}</p>
            </div>
            <div className="flex flex-col items-end text-xs text-slate-400 dark:text-slate-500 space-y-1">
                <span>{conv.timestamp}</span>
                {conv.unreadCount > 0 && <span className="bg-indigo-500 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">{conv.unreadCount}</span>}
            </div>
        </li>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ conversations, selectedConversationId, onSelectConversation, onOpenSettings, onActivateWhistleblower, onOpenCreateGroup, onViewChange, currentView, tdmSettings, showHiddenChats, onToggleShowHiddenChats }) => {
    return (
        <div className="w-full flex flex-col h-full">
            <SearchBar onOpenCreateGroup={onOpenCreateGroup} />
            <nav className="flex-1 overflow-y-auto py-2">
                <ul>
                    {conversations.map(conv => (
                        <ConversationItem 
                            key={conv.id}
                            conv={conv}
                            isSelected={conv.id === selectedConversationId}
                            onSelect={() => onSelectConversation(conv.id)}
                        />
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;