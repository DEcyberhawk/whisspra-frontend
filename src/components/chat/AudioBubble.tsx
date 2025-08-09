import React, { useState, useRef, useEffect } from 'react';
import { useTranscription } from '../../hooks/useTranscription';

interface AudioBubbleProps {
    audioUrl: string;
    duration: number;
    isOwnMessage: boolean;
}

const formatDuration = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const AudioBubble: React.FC<AudioBubbleProps> = ({ audioUrl, duration, isOwnMessage }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { isTranscribing, transcription, error, startTranscription } = useTranscription();

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        const handleTimeUpdate = () => {
             if (audio.duration > 0) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        
        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const handleTranscriptionClick = () => {
        if (!transcription && !isTranscribing && !error) {
            startTranscription(audioUrl);
        }
    };

    const playPauseIconColor = isOwnMessage ? 'text-white' : 'text-indigo-300';
    const progressBgColor = isOwnMessage ? 'bg-indigo-400/60' : 'bg-slate-500';
    const progressFgColor = isOwnMessage ? 'bg-white' : 'bg-indigo-300';
    const textColor = isOwnMessage ? 'text-indigo-200' : 'text-slate-400';

    return (
        <div className="flex flex-col space-y-2 w-64">
            <div className="flex items-center space-x-3">
                <audio ref={audioRef} src={audioUrl} preload="metadata" />
                <button onClick={togglePlayPause} className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${playPauseIconColor}`}>
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
                <div className="flex-grow h-1.5 rounded-full relative" style={{ backgroundColor: progressBgColor }}>
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: progressFgColor }}></div>
                </div>
                <span className={`text-xs font-mono ${textColor}`}>{formatDuration(duration)}</span>
            </div>
             <div className="pl-11 pr-2">
                {transcription && (
                    <blockquote className="border-l-2 border-slate-500 pl-2">
                        <p className="text-sm italic text-slate-300">"{transcription}"</p>
                    </blockquote>
                )}
                {isTranscribing && (
                     <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Transcribing...</span>
                    </div>
                )}
                {error && <p className="text-xs text-red-400/80">Error: {error}</p>}

                {!transcription && !isTranscribing && !error && (
                     <button
                        onClick={handleTranscriptionClick}
                        className={`flex items-center space-x-1 text-xs font-semibold transition-colors ${isOwnMessage ? 'text-indigo-200 hover:text-white' : 'text-indigo-300 hover:text-indigo-100'}`}
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                       </svg>
                       <span>Transcribe</span>
                   </button>
                )}
            </div>
        </div>
    );
};

export default AudioBubble;