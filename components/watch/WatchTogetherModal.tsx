
import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import type { YouTubePlayer, YouTubeProps } from 'react-youtube';
import { WatchPartyState, PlaybackControl } from '../../types';

interface WatchTogetherModalProps {
    partyState: WatchPartyState;
    isHost: boolean;
    onPlaybackControl: (control: PlaybackControl) => void;
    onEndParty: () => void;
}

const DraggableHeader: React.FC<{ onMouseDown: (e: React.MouseEvent) => void }> = ({ onMouseDown }) => (
    <div
        className="h-8 bg-slate-700 cursor-move rounded-t-lg flex items-center justify-center"
        onMouseDown={onMouseDown}
    >
        <div className="w-10 h-1.5 bg-slate-500 rounded-full"></div>
    </div>
);

const WatchTogetherModal: React.FC<WatchTogetherModalProps> = ({ partyState, isHost, onPlaybackControl, onEndParty }) => {
    const playerRef = useRef<YouTubePlayer | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth / 2 - 280, y: window.innerHeight / 2 - 200 });
    const dragStartPos = useRef({ x: 0, y: 0 });

    const onPlayerReady = (event: { target: YouTubePlayer }) => {
        playerRef.current = event.target;
    };

    const handlePlayerStateChange = async (event: { data: number }) => {
        if (!isHost || !playerRef.current) return;
        const state = event.data;
        if (state === 1) { // Playing
            onPlaybackControl({ type: 'PLAY', timestamp: await playerRef.current.getCurrentTime() });
        } else if (state === 2) { // Paused
            onPlaybackControl({ type: 'PAUSE', timestamp: await playerRef.current.getCurrentTime() });
        }
    };
    
     useEffect(() => {
        if (isHost) return;

        const syncPlayer = async () => {
            if (!playerRef.current) return;
            const currentTime = await playerRef.current.getCurrentTime();
            const timeDiff = Math.abs(currentTime - partyState.timestamp);

            if (timeDiff > 1.5) { // Sync if more than 1.5s difference
                 playerRef.current.seekTo(partyState.timestamp, true);
            }
    
            const playerState = await playerRef.current.getPlayerState();
            if (partyState.isPlaying && playerState !== 1) {
                playerRef.current.playVideo();
            } else if (!partyState.isPlaying && playerState === 1) {
                playerRef.current.pauseVideo();
            }
        };
        
        if (playerRef.current) {
            syncPlayer();
        }
    }, [partyState, isHost]);


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
    
    const opts: YouTubeProps['opts'] = {
        height: '315',
        width: '560',
        playerVars: {
          autoplay: 1,
          controls: isHost ? 1 : 0,
          disablekb: isHost ? 0 : 1,
          modestbranding: 1,
        },
      };

    return (
        <div
            className="fixed z-[70] bg-slate-900/80 border border-slate-700 rounded-lg shadow-2xl"
            style={{ left: position.x, top: position.y, userSelect: isDragging ? 'none' : 'auto' }}
        >
            <DraggableHeader onMouseDown={handleMouseDown} />
            <div className="w-[560px] h-[315px]">
                <YouTube
                    videoId={partyState.videoId}
                    opts={opts}
                    onReady={onPlayerReady}
                    onStateChange={handlePlayerStateChange}
                    className="w-full h-full"
                />
            </div>
            {isHost && (
                <div className="p-2 bg-slate-700 rounded-b-lg text-center">
                    <button onClick={onEndParty} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded-full transition-colors">
                        End Watch Party
                    </button>
                </div>
            )}
        </div>
    );
};

export default WatchTogetherModal;