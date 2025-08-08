


import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Conversation, ChatMessage, User } from '../types';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import AuraStatusRail from '../components/chat/AuraStatusRail';
import UserProfileBar from '../components/chat/UserProfileBar';

// Mock data to replicate the UI from the image
const mockUser = {
  id: 'currentUser',
  name: 'Max Collins',
  avatar: 'M',
  isAnonymous: false,
  presence: { status: 'online' as 'online' | 'away' | 'busy' | 'driving' | 'sleeping', message: 'Building new features ✨' }
};

const mockConversations: Conversation[] = [
  {
    id: '1',
    type: 'direct',
    otherUser: { id: 'emily', name: 'Emily', avatar: 'E', isOnline: true, isCreator: false, isAnonymous: false, presence: { status: 'online' } },
    messages: [],
    lastMessage: 'Thankss.',
    timestamp: '10:34 AM',
    unreadCount: 0,
    isAiConversation: false,
  },
  {
    id: '2',
    type: 'group',
    name: 'Design Team',
    avatar: <div />,
    members: [],
    admin: mockUser as User,
    messages: [],
    lastMessage: 'Let\'s review the mockups.',
    timestamp: 'Yesterday',
    unreadCount: 3,
    isAiConversation: false,
  },
  {
    id: '3',
    type: 'direct',
    otherUser: { id: 'alex', name: 'Alex', avatar: 'A', isOnline: false, isCreator: false, isAnonymous: false, presence: { status: 'busy', message: 'In a meeting' } },
    messages: [],
    lastMessage: 'I\'ll get back to you.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isAiConversation: false,
  }
];

const mockSelectedConversation: Conversation & { messages: (ChatMessage | { isAiScan: boolean, text: string, id: string })[] } = {
  id: '3',
  type: 'direct',
  otherUser: { id: 'alex', name: 'Alex', avatar: 'A', isOnline: false, isCreator: false, isAnonymous: false, presence: { status: 'busy', message: 'In a meeting' } },
  messages: [
    { id: 'm1', senderId: 'emily', text: 'Mieting tommorrowno?', timestamp: '10:30 AM', type: 'text', readStatus: 'read' },
    { id: 'm2', senderId: 'currentUser', text: 'Yeah, Ht. Ill wa itch on that next week?', timestamp: '10:30 AM', type: 'text', readStatus: 'read' },
    { id: 'm3', senderId: 'emily', text: 'Sure. Ill senoi jut tme report.', timestamp: '10:32 AM', type: 'text', readStatus: 'read' },
    { id: 'm4', senderId: 'currentUser', text: 'Ill glad send rend the report.', timestamp: '10:32 AM', type: 'text', readStatus: 'glimpsed' },
    { id: 'm5', senderId: 'emily', text: 'Thankss.', timestamp: '10:34 AM', type: 'text', readStatus: 'delivered' },
    { id: 'm6', isAiScan: true, text: 'No issues found by AI scan', timestamp: '10:35 AM' } as any
  ],
  lastMessage: 'I\'ll get back to you.',
  timestamp: 'Yesterday',
  unreadCount: 0,
  isAiConversation: false,
};


const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.364-8.364l-.707.707M4.343 4.343l-.707.707m16.97 8.364l.707.707M3.636 19.364l.707.707M21 12h-1M4 12H3m15.364-7.657l.707-.707M4.343 19.364l.707-.707" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      )}
    </button>
  );
};

const NavigationSidebar = () => {
    const navItems = [
        { name: 'Chat', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>, active: true },
        { name: 'AI Room', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>, active: false },
        { name: 'Student Mode', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.568 1.84L10 9.75l7.824-2.288a1 1 0 00.568-1.84l-7-3.5z" /><path d="M3 9.75L10 12.03l7-2.28V15a1 1 0 01-1 1h-3v3a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3H6a1 1 0 01-1-1V9.75z" /></svg>, active: false },
        { name: 'Whistleblower', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, active: false },
        { name: 'Stealth Call', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.789-2.75 9.566l-2.75-2.75a2.25 2.25 0 01.07-3.212L8.5 12.5l-2.518-2.518a2.25 2.25 0 01-3.182-3.182L5 4.07V2.25A2.25 2.25 0 017.25 0h1.5M12 11c0-3.517 1.009-6.789 2.75-9.566l2.75 2.75a2.25 2.25 0 01-.07 3.212L15.5 12.5l2.518 2.518a2.25 2.25 0 013.182 3.182L19 19.93V21.75a2.25 2.25 0 01-2.25 2.25h-1.5" /></svg>, active: false },
        { name: 'Persona', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, active: false },
        { name: 'Mesh Network', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>, active: false },
        { name: 'Watch Party', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>, active: false },
        { name: 'Marketplace', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>, active: false },
    ];
    return (
        <nav className="w-72 bg-white dark:bg-[#202225] p-3 flex flex-col flex-shrink-0">
            <div className="font-bold text-2xl tracking-tighter text-slate-800 dark:text-white p-4">WHISSPRA</div>
            <ul className="flex-grow space-y-2 mt-4">
                {navItems.map(item => (
                    <li key={item.name}>
                        <a href="#" className={`flex items-center space-x-4 p-3 rounded-lg font-semibold transition-colors duration-200 ${item.active ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
                            {item.icon}
                            <span>{item.name}</span>
                        </a>
                    </li>
                ))}
            </ul>
            <div className="mt-auto flex items-center justify-between p-2">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Theme</span>
                <ThemeToggle />
            </div>
        </nav>
    );
};

const FeaturePanel = () => {
    const features = [
        { name: 'Study Room', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" /></svg> },
        { name: 'Stealth Conference Call', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> },
        { name: 'Persona', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
        { name: 'Mesh Network', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg> },
        { name: 'Flashcards & Quizzes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
        { name: 'Watch Party', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { name: 'Live Transcriber', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        { name: 'Marketplace', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
    ];

    return (
        <aside className="w-[360px] bg-gray-50 dark:bg-[#2F3136] p-4 flex-shrink-0 flex flex-col border-l border-gray-200 dark:border-slate-800">
            <div className="relative mb-4">
                <input type="text" placeholder="Search" className="w-full bg-gray-200 dark:bg-slate-700 rounded-lg p-2 pl-4 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto">
                {features.map(feature => (
                    <div key={feature.name} className="bg-white dark:bg-slate-800/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-2 aspect-square cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="text-slate-500 dark:text-slate-400">{feature.icon}</div>
                        <p className="font-semibold text-sm text-slate-700 dark:text-slate-200">{feature.name}</p>
                    </div>
                ))}
            </div>
        </aside>
    );
};

const ChatPage: React.FC = () => {
    // We use mock data for this visual representation.
    // In a real app, this would come from state management.
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [selectedConversation, setSelectedConversation] = useState(mockSelectedConversation);
    const { user } = useAuth(); // We can still use the auth context for user info
    const currentUser = user || mockUser as User;
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;
        
        const handleStatusUpdate = ({ conversationId, newStatus }: { conversationId: string, newStatus: 'delivered' | 'glimpsed' | 'read' }) => {
            const updateMessages = (messages: ChatMessage[]) => messages.map(msg => 
                msg.senderId === currentUser.id ? { ...msg, readStatus: newStatus } : msg
            );
            
            setConversations(prev => prev.map(c => 
                c.id === conversationId ? { ...c, messages: updateMessages(c.messages) } : c
            ));
            
            if (selectedConversation && selectedConversation.id === conversationId) {
                setSelectedConversation(prev => ({...prev, messages: updateMessages(prev.messages)}));
            }
        };

        (socket as any).on('messageStatusUpdate', handleStatusUpdate);

        return () => {
            (socket as any).off('messageStatusUpdate', handleStatusUpdate);
        };
    }, [socket, currentUser.id, selectedConversation]);

    const handleSelectConversation = (id: string) => {
         const conversation = conversations.find(c => c.id === id);
         // For mock purposes, we always show the detailed one
         setSelectedConversation(mockSelectedConversation); 
         if (socket && conversation && conversation.unreadCount > 0) {
             socket.emit('readMessages', { conversationId: id });
         }
    };

    return (
        <div className="flex h-screen bg-gray-200 dark:bg-[#36393f] font-sans">
            <NavigationSidebar />
            <aside className="w-96 bg-gray-100 dark:bg-[#2F3136] flex flex-col flex-shrink-0">
                <AuraStatusRail />
                <div className="flex-1 min-h-0 flex flex-col">
                    <Sidebar
                        conversations={conversations}
                        selectedConversationId={selectedConversation.id}
                        onSelectConversation={handleSelectConversation}
                        onOpenSettings={() => {}}
                        onActivateWhistleblower={() => {}}
                        onOpenCreateGroup={() => {}}
                        onViewChange={() => {}}
                        currentView="chats"
                        tdmSettings={{}}
                        showHiddenChats={false}
                        onToggleShowHiddenChats={() => {}}
                    />
                </div>
                <UserProfileBar />
            </aside>
            <main className="flex-1 flex flex-col">
                <ChatWindow
                    conversation={selectedConversation}
                    currentUser={currentUser as User}
                    onSendMessage={() => {}}
                    onSendGhostNote={() => {}}
                    onBack={() => {}}
                    typingText={null}
                    onSummarize={() => {}}
                    onRevealGhostMessage={() => {}}
                    onOpenCreatorProfile={() => {}}
                    onOpenConversationInfo={() => {}}
                    onStartWatchParty={() => {}}
                    onStartCall={() => {}}
                    onOpenStudyHub={() => {}}
                    onOpenCRoomPanel={() => {}}
                    onEnterVibeTimeline={() => {}}
                    p2pStatus="disconnected"
                    onStartStealthCall={() => {}}
                    onOpenTDMConfig={() => {}}
                    onStartVoiceRoom={() => {}}
                    onStartWhisperThread={() => {}}
                    onOpenWhisperThread={() => {}}
                    onOpenMoodTranslator={() => {}}
                />
            </main>
            <FeaturePanel />
        </div>
    );
};

export default ChatPage;