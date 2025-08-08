
import React, { useEffect, useRef } from 'react';
import { User, ChatMessage, ChatWindowProps } from '../../types';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';


const AiScannerBubble: React.FC<{ message: { text: string } }> = ({ message }) => (
    <div className="flex items-center space-x-3 p-3 my-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </div>
        <div>
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">AI Scanser</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{message.text}</p>
        </div>
    </div>
);


const ChatWindow: React.FC<ChatWindowProps> = ({ 
    conversation, 
    currentUser, 
    onSendMessage, 
    onSendGhostNote, 
    onBack, 
    typingText, 
    onSummarize, 
    onRevealGhostMessage, 
    onOpenCreatorProfile, 
    onOpenConversationInfo, 
    onStartWatchParty, 
    onStartCall, 
    onOpenCRoomPanel,
    onOpenStudyHub, 
    onOpenMemoryCapsule, 
    onEnterVibeTimeline, 
    onGetRoleplayPrompt,
    onGenerateContract,
    p2pStatus,
    onStartStealthCall,
    onOpenTDMConfig,
    onStartVoiceRoom,
    onStartWhisperThread,
    onOpenWhisperThread,
    onOpenMoodTranslator,
    isAiTwinModeActive,
    onToggleAiTwinMode,
    aiTwinSuggestion,
    onClearAiSuggestion,
    onLocalP2PConnect,
    localP2PStatus,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation.messages, typingText]);


    const otherUser = conversation.type === 'direct' ? conversation.otherUser : null;

    return (
        <div className="flex flex-col h-full w-full bg-gray-100 dark:bg-[#36393f]">
            <ChatHeader 
                onBack={onBack} 
                conversation={conversation}
                currentUser={currentUser}
                onOpenCreatorProfile={onOpenCreatorProfile}
                onOpenConversationInfo={onOpenConversationInfo}
                onStartWatchParty={onStartWatchParty}
                onStartCall={onStartCall}
                onOpenStudyHub={onOpenStudyHub}
                onGenerateContract={onGenerateContract}
                p2pStatus={p2pStatus}
                onStartStealthCall={onStartStealthCall}
                onOpenTDMConfig={onOpenTDMConfig}
                onStartVoiceRoom={onStartVoiceRoom}
                isAiTwinModeActive={isAiTwinModeActive}
                onToggleAiTwinMode={onToggleAiTwinMode}
                onLocalP2PConnect={onLocalP2PConnect}
                localP2PStatus={localP2PStatus}
            />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {(conversation.messages as any[]).map(msg => {
                    if (msg.isAiScan) {
                        return <AiScannerBubble key={msg.id} message={msg} />
                    }
                    const isOwn = msg.senderId === currentUser.id;
                    const sender = isOwn ? currentUser : (conversation.type === 'direct' ? otherUser : conversation.members.find(m => m.id === msg.senderId));
                    return (
                        <MessageBubble 
                            key={msg.id} 
                            message={msg} 
                            isOwnMessage={isOwn}
                            onRevealGhostMessage={() => onRevealGhostMessage(msg.id)}
                            sender={sender as User}
                            isGroup={conversation.type === 'group'}
                            isAiMessage={false}
                            onStartWhisperThread={onStartWhisperThread}
                            onOpenWhisperThread={onOpenWhisperThread}
                        />
                    );
                })}
                {typingText && <TypingIndicator typingText={typingText} />}
                <div ref={messagesEndRef} />
            </div>
            <MessageInput 
                onSendMessage={onSendMessage}
                onSendGhostNote={onSendGhostNote}
                conversation={conversation}
                currentUser={currentUser}
            />
        </div>
    );
};

export default ChatWindow;
