
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../../types';

interface VideoCallModalProps {
    localStream: MediaStream | null;
    remoteStreams: Map<string, MediaStream>;
    onEndCall: () => void;
    onToggleMute: () => void;
    onToggleVideo: () => void;
    isScreenSharing: boolean;
    onToggleScreenShare: () => void;
    isStealthHost?: boolean;
}

const VideoPlayer: React.FC<{ stream: MediaStream | null }> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    return <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />;
};

const VideoCallModal: React.FC<VideoCallModalProps> = ({ 
    localStream, 
    remoteStreams, 
    onEndCall, 
    onToggleMute, 
    onToggleVideo, 
    isScreenSharing, 
    onToggleScreenShare,
    isStealthHost
}) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    
    // Dragging state
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth / 2 - 400, y: 100 });
    const dragStartPos = useRef({ x: 0, y: 0 });

    const handleToggleMute = () => {
        onToggleMute();
        setIsMuted(prev => !prev);
    };

    const handleToggleVideo = () => {
        onToggleVideo();
        setIsVideoOff(prev => !prev);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
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
    
    const remoteStreamsArray = Array.from(remoteStreams.values());
    const participantCount = remoteStreamsArray.length;
    const gridCols = participantCount <= 1 ? 'grid-cols-1' : 'grid-cols-2';
    const gridRows = participantCount <= 2 ? 'grid-rows-1' : 'grid-rows-2';

    return (
        <div 
            className="fixed z-[80] bg-slate-900/80 border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden"
            style={{ left: position.x, top: position.y, width: 800, height: 600, userSelect: isDragging ? 'none' : 'auto' }}
        >
            <div className="h-8 bg-slate-800 cursor-move" onMouseDown={handleMouseDown}></div>

            <div className="flex-1 relative bg-black">
                {participantCount > 0 ? (
                    <div className={`w-full h-full grid ${gridCols} ${gridRows} gap-px bg-slate-700`}>
                       {remoteStreamsArray.map((stream, index) => (
                           <div key={index} className="w-full h-full bg-black">
                               <VideoPlayer stream={stream} />
                           </div>
                       ))}
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">Connecting...</div>
                )}
                <div className="absolute bottom-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-slate-700 overflow-hidden">
                    <VideoPlayer stream={localStream} />
                </div>
            </div>

            <div className="h-20 bg-slate-800 flex items-center justify-center space-x-4">
                <button 
                    onClick={handleToggleMute} 
                    className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors ${isMuted ? 'bg-white text-slate-800' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l4-4m0 0l-4-4m4 4H7" /></svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.586 15H14a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C21.077 3.663 22 4.109 22 5v14c0 .891-1.077 1.337-1.707.707L15.586 15z" /></svg>
                    }
                </button>
                 <button 
                    onClick={handleToggleVideo} 
                    className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors ${isVideoOff ? 'bg-white text-slate-800' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                    title={isVideoOff ? "Start Video" : "Stop Video"}
                >
                     {isVideoOff ? 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 15.5l.5-2.5m-3.5.5l2.5-.5m6 6l-2.5-.5M12 8V5.5m0 3.5v-3.5m0 3.5H9.5m2.5 0h2.5M10 15.5a2 2 0 11-4 0 2 2 0 014 0zM19 14a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                     }
                 </button>
                 <button 
                    onClick={onToggleScreenShare} 
                    className={`w-14 h-14 flex items-center justify-center rounded-full transition-colors ${isScreenSharing ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
                    title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                 </button>
                <button onClick={onEndCall} className="w-16 h-14 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-lg text-white" title="End Call">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24"><path d="M13.21 17.37a15.045 15.045 0 01-1.41-.7L5.05 13.4A1 1 0 016 12h2a1 1 0 001-1V5a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 001 1h2a1 1 0 01.95 1.4l-3.75 6.25a1 1 0 01-1.63.37z" /></svg>
                </button>
            </div>
        </div>
    );
};

export default VideoCallModal;
