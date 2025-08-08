import React, { useState, useMemo } from 'react';

interface MemoryCapsuleModalProps {
    onClose: () => void;
    onSend: (content: string, releaseAt: Date) => void;
}

const MemoryCapsuleModal: React.FC<MemoryCapsuleModalProps> = ({ onClose, onSend }) => {
    const [content, setContent] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [releaseTime, setReleaseTime] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !releaseDate || !releaseTime) {
            setError('All fields are required.');
            return;
        }

        const releaseAt = new Date(`${releaseDate}T${releaseTime}`);
        if (isNaN(releaseAt.getTime()) || releaseAt <= new Date()) {
            setError('Please select a valid date and time in the future.');
            return;
        }
        setError('');
        onSend(content, releaseAt);
    };

    const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">Create a Memory Capsule</h2>
                
                <div className="space-y-4">
                    <textarea
                        placeholder="Your secret message..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={5}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="releaseDate" className="block text-sm font-medium text-slate-300 mb-1">Release Date</label>
                             <input
                                id="releaseDate"
                                type="date"
                                value={releaseDate}
                                onChange={e => setReleaseDate(e.target.value)}
                                min={minDate}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                             <label htmlFor="releaseTime" className="block text-sm font-medium text-slate-300 mb-1">Release Time</label>
                            <input
                                id="releaseTime"
                                type="time"
                                value={releaseTime}
                                onChange={e => setReleaseTime(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20">
                        Lock & Send Capsule
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MemoryCapsuleModal;