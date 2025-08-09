
import React, { useState, useRef } from 'react';
import { User, VoiceRoomParticipant, Transcription } from '../../types';
import ParticipantAvatar from './ParticipantAvatar';
import TranscriptionFeed from './TranscriptionFeed';

interface VoiceRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomState: {
        participants: VoiceRoomParticipant[];
    };
    currentUser: User;
    speakingPeers: Set<string>;
    onMuteToggle: () => void;
    remoteAudioStreams: Map<string, MediaStream>;
    transcriptions: Transcription[];
}

const DraggableHeader: React.FC<{ onMouseDown: (e: React.MouseEvent) => void }> = ({ onMouseDown }) => (
    <div
        className="h-8 bg-slate-700 cursor-move rounded-t-lg flex items-center justify-center"
        onMouseDown={onMouseDown}
    >
        <div className="w-10 h-1.5 bg-slate-500 rounded-full"></div>
    </div>
);


const VoiceRoomModal: React.FC<VoiceRoomModalProps> = ({ isOpen, onClose, roomState, currentUser, speakingPeers, onMuteToggle, remoteAudioStreams, transcriptions }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });

    const handleMute = () => {
        onMuteToggle();
        setIsMuted(prev => !prev);
    };

    // Dragging logic
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        setPosition({
            x: e.clientX - dragStartPos.current.x,
            y: e.clientY - dragStartPos.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    if (!isOpen) return null;
    
    // Combine roomState participants with current user for display
    const allParticipants = [
        ...(roomState.participants || []),
        // The backend might not send the current user back in the list, so we add them
        ...(roomState.participants?.some(p => p.user.id === currentUser.id) ? [] : [{ user: currentUser, role: 'speaker', isMuted: false }])
    ].map(p => ({...p, user: p.user, isSpeaking: speakingPeers.has(p.user.id) }));
    
    const speakers = allParticipants.filter(p => p.role !== 'listener');
    const listeners = allParticipants.filter(p => p.role === 'listener');

    return (
        <>
            {/* Hidden audio players for remote streams */}
            {Array.from(remoteAudioStreams.entries()).map(([userId, stream]) => (
                <audio key={userId} autoPlay ref={audio => { if (audio) audio.srcObject = stream; }} />
            ))}
            <div
                className="fixed z-[70] bg-slate-800/80 border border-slate-700 rounded-lg shadow-2xl flex flex-col backdrop-blur-md"
                style={{ left: position.x, top: position.y, width: 400, userSelect: isDragging ? 'none' : 'auto' }}
            >
                <DraggableHeader onMouseDown={handleMouseDown} />
                <div className="p-4 flex-1">
                    <h3 className="font-bold text-white mb-4">Live Voice Chat</h3>
                    
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-slate-400 mb-3">Speakers ({speakers.length})</p>
                        <div className="grid grid-cols-4 gap-4">
                            {speakers.map(p => <ParticipantAvatar key={p.user.id} participant={p} />)}
                        </div>
                    </div>

                    {listeners.length > 0 && (
                         <div className="mb-4">
                            <p className="text-sm font-semibold text-slate-400 mb-3">Listeners ({listeners.length})</p>
                            <div className="grid grid-cols-4 gap-4">
                               {listeners.map(p => <ParticipantAvatar key={p.user.id} participant={p} />)}
                            </div>
                        </div>
                    )}
                    
                    <TranscriptionFeed transcriptions={transcriptions} />

                </div>
                <div className="p-4 bg-slate-900/50 rounded-b-lg flex items-center justify-center space-x-4">
                     <button
                        onClick={handleMute}
                        className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${isMuted ? 'bg-white text-slate-800' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ?
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l4-4m0 0l-4-4m4 4H7" /></svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.586 15H14a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C21.077 3.663 22 4.109 22 5v14c0 .891-1.077 1.337-1.707.707L15.586 15z" /></svg>
                        }
                    </button>
                    <button onClick={onClose} className="w-14 h-12 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-lg text-white" title="Leave Room">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24"><path d="M13.21 17.37a15.045 15.045 0 01-1.41-.7L5.05 13.4A1 1 0 016 12h2a1 1 0 001-1V5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 001 1h2a1 1 0 01.95 1.4l-3.75 6.25a1 1 0 01-1.63.37z" /></svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default VoiceRoomModal;
