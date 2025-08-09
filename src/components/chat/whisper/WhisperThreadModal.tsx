
import React from 'react';
import { GroupConversation, User, MessageSendContent } from '../../types';
import MessageBubble from '../MessageBubble';
import MessageInput from '../MessageInput';
import { useAuth } from '../../context/AuthContext';

interface WhisperThreadModalProps {
    conversation: GroupConversation;
    currentUser: User;
    onClose: () => void;
    onSendMessage: (content: MessageSendContent) => void;
}

const WhisperThreadModal: React.FC<WhisperThreadModalProps> = ({ conversation, currentUser, onClose, onSendMessage }) => {
    const otherParticipant = conversation.members.find(m => m.id !== currentUser.id);

    return (
        <div className="fixed inset-0 bg-black/80 z-[70] flex flex-col p-4 sm:p-8" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl mx-auto flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <p className="text-sm text-indigo-400">Whisper Thread</p>
                        <h2 className="text-xl font-bold text-white">with {otherParticipant?.name}</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {conversation.messages.map(msg => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwnMessage={msg.senderId === currentUser.id}
                            isGroup={false} // Treat as a direct chat visually
                            sender={msg.senderId === currentUser.id ? currentUser : otherParticipant}
                            onRevealGhostMessage={() => {}}
                            isAiMessage={false}
                            onStartWhisperThread={() => {}} // Not possible within a whisper thread
                            onOpenWhisperThread={() => {}}
                        />
                    ))}
                </div>
                
                {/* Input */}
                <div className="flex-shrink-0">
                    <MessageInput
                        onSendMessage={onSendMessage}
                        onSendGhostNote={() => {}} // Ghost notes not supported in this context for simplicity
                        conversation={conversation}
                        currentUser={currentUser}
                    />
                </div>
            </div>
        </div>
    );
};

export default WhisperThreadModal;
