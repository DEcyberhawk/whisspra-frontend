

import React, { useState, useEffect, useRef } from 'react';
import { Conversation, User, ChatMessage, VibeReply, SimulatedTextMessage } from '../../../types';
import useGemini from '../../../hooks/useGemini';
import SimulatedMessageBubble from './SimulatedMessageBubble';
import MessageBubble from '../MessageBubble';

interface VibeTimelineModalProps {
    conversation: Conversation;
    currentUser: User;
    onClose: () => void;
    onSendMessage: (text: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-1.5 p-4">
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse-fast"></span>
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse-fast" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse-fast" style={{ animationDelay: '0.4s' }}></span>
    </div>
);

const VibeReplyBubble: React.FC<{ reply: VibeReply, onSelect: (reply: VibeReply) => void }> = ({ reply, onSelect }) => (
    <div
        onClick={() => onSelect(reply)}
        className="cursor-pointer p-3 rounded-xl border-2 border-dashed border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 hover:border-indigo-500 transition-all duration-200 w-56 transform hover:scale-105"
    >
        <p className="text-xs font-bold text-indigo-400 capitalize mb-1">{reply.tone} Path</p>
        <p className="text-sm text-slate-300">"{reply.text}"</p>
    </div>
);


const VibeTimelineModal: React.FC<VibeTimelineModalProps> = ({ conversation, currentUser, onClose, onSendMessage }) => {
    const { vibeReplies, vibeRepliesLoading, vibeRepliesError, generateVibeReplies } = useGemini();
    const [simulatedMessages, setSimulatedMessages] = useState<SimulatedTextMessage[]>([]);
    const [hypotheticalMessage, setHypotheticalMessage] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [simulatedMessages, vibeReplies, vibeRepliesLoading]);

    const handleSimulate = async () => {
        if (!hypotheticalMessage.trim()) return;
        setIsThinking(true);

        const userHypotheticalMsg: SimulatedTextMessage = {
            id: `sim-user-${Date.now()}`,
            senderId: currentUser.id,
            text: hypotheticalMessage,
            timestamp: '',
            type: 'simulated-text',
            isHypothetical: true,
        };
        setSimulatedMessages(prev => [...prev, userHypotheticalMsg]);
        setHypotheticalMessage('');

        await generateVibeReplies(conversation, userHypotheticalMsg.text, currentUser);
        setIsThinking(false);
    };

    const handleSelectReply = (reply: VibeReply) => {
        const aiReplyMsg: SimulatedTextMessage = {
            id: `sim-ai-${Date.now()}`,
            senderId: conversation.type === 'direct' ? conversation.otherUser.id : 'group-member-ai',
            text: reply.text,
            timestamp: '',
            type: 'simulated-text',
            tone: reply.tone,
        };
        setSimulatedMessages(prev => [...prev, aiReplyMsg]);
        // Clear the choices to show the input again by calling with empty message
        generateVibeReplies({ ...conversation, messages: [] }, '', currentUser);
    };
    
    const handleSendForReal = (text: string) => {
        onSendMessage(text);
        onClose();
    }

    const otherUser = conversation.type === 'direct' ? conversation.otherUser : null;
    
    const getBranchStyle = (index: number, total: number): React.CSSProperties => {
        if (total === 1) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        if (total === 2) {
             return index === 0 
                ? { top: '50%', left: '0%', transform: 'translateY(-50%)'}
                : { top: '50%', left: '100%', transform: 'translate(-100%, -50%)'};
        }
        // Case for 3
        switch(index) {
            case 0: return { top: '0', left: '0', transform: 'translate(10%, 10%) rotate(-5deg)' };
            case 1: return { top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.05)' };
            case 2: return { top: '0', right: '0', transform: 'translate(-10%, 10%) rotate(5deg)' };
            default: return {};
        }
    };


    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex flex-col p-4 sm:p-8" onClick={onClose}>
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl w-full max-w-4xl mx-auto flex flex-col h-full" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-1 4h.01M9 15h.01" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 18.364a4 4 0 10-5.656 0" /></svg>
                        <h2 className="text-xl font-bold text-white">Vibe Timeline</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                </div>

                {/* Chat History & Simulation */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
                    {conversation.messages.slice(-5).map(msg => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwnMessage={msg.senderId === currentUser.id}
                            isGroup={conversation.type === 'group'}
                            sender={msg.senderId === currentUser.id ? currentUser : otherUser}
                            onRevealGhostMessage={() => {}}
                            isAiMessage={false}
                            onStartWhisperThread={() => {}}
                            onOpenWhisperThread={() => {}}
                        />
                    ))}
                    <div className="border-t border-dashed border-slate-600 my-4 pt-4 space-y-4">
                        {simulatedMessages.map(msg => (
                            <SimulatedMessageBubble 
                                key={msg.id} 
                                message={msg} 
                                isOwnMessage={msg.senderId === currentUser.id} 
                                sender={msg.senderId === currentUser.id ? currentUser : otherUser} 
                                onSendForReal={handleSendForReal}
                            />
                        ))}
                    </div>
                    {vibeReplies.length > 0 && !vibeRepliesLoading && (
                        <div className="pt-8 pb-4 relative flex justify-center">
                            <div className="w-full max-w-xl h-48 relative">
                                {vibeReplies.map((reply, index) => (
                                    <div
                                        key={index}
                                        className="absolute transition-all duration-500 ease-in-out"
                                        style={getBranchStyle(index, vibeReplies.length)}
                                    >
                                        <VibeReplyBubble reply={reply} onSelect={handleSelectReply} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                     {(vibeRepliesLoading || isThinking) && <LoadingSpinner />}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-700">
                    {vibeReplies.length === 0 && !vibeRepliesLoading && !isThinking && (
                         <div className="flex items-center space-x-3">
                             <input
                                type="text"
                                placeholder="What if I say..."
                                value={hypotheticalMessage}
                                onChange={(e) => setHypotheticalMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSimulate()}
                                className="flex-1 bg-slate-700/80 border-transparent rounded-lg py-2 pl-4 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={isThinking}
                                autoFocus
                            />
                            <button onClick={handleSimulate} disabled={isThinking || !hypotheticalMessage.trim()} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
                                Simulate
                            </button>
                        </div>
                    )}
                    {vibeRepliesError && <p className="text-red-400 text-center text-sm mt-2">{vibeRepliesError}</p>}
                </div>
            </div>
        </div>
    );
};

export default VibeTimelineModal;
