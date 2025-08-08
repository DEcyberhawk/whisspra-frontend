
import React, { useState } from 'react';

interface StartWatchPartyModalProps {
    onClose: () => void;
    onStart: (videoUrl: string) => void;
}

const StartWatchPartyModal: React.FC<StartWatchPartyModalProps> = ({ onClose, onStart }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        // Basic YouTube URL validation
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
        if (!youtubeRegex.test(videoUrl)) {
            setError('Please enter a valid YouTube URL.');
            return;
        }
        setError('');
        onStart(videoUrl);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-white mb-2">Start a Watch Party</h2>
                <p className="text-slate-400 mb-6">Paste a YouTube video URL to watch with your group.</p>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                        className={`w-full bg-slate-700 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-600 focus:ring-indigo-500'}`}
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={!videoUrl}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:bg-indigo-400/50 disabled:cursor-not-allowed"
                    >
                        Start Party
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartWatchPartyModal;
