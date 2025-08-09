
import React from 'react';
import { Transcription } from '../../types';

interface TranscriptionFeedProps {
    transcriptions: Transcription[];
}

const TranscriptionItem: React.FC<{ transcription: Transcription }> = ({ transcription }) => {
    return (
        <div className="animate-fade-in-up text-sm">
            <span className="font-bold text-indigo-300">{transcription.sender.name}:</span>
            <span className="text-slate-200 ml-2">{transcription.text}</span>
        </div>
    );
}

const TranscriptionFeed: React.FC<TranscriptionFeedProps> = ({ transcriptions }) => {
    if (transcriptions.length === 0) {
        return <div className="h-20 flex items-center justify-center text-slate-500 italic text-sm">AI Transcription will appear here...</div>;
    }

    return (
        <div className="h-20 p-3 bg-slate-900/50 rounded-lg overflow-hidden relative">
            <div className="flex flex-col justify-end h-full space-y-1">
                {transcriptions.map((t) => (
                    <TranscriptionItem key={t.id} transcription={t} />
                ))}
            </div>
        </div>
    );
};

export default TranscriptionFeed;
