
import React, { useState, useMemo } from 'react';
import { Conversation, TDMSettings } from '../../../types';

interface TDMConfigModalProps {
    conversation: Conversation;
    onClose: () => void;
    onSetTDM: (settings: TDMSettings) => void;
}

const TDMConfigModal: React.FC<TDMConfigModalProps> = ({ conversation, onClose, onSetTDM }) => {
    const [unhideDate, setUnhideDate] = useState('');
    const [unhideTime, setUnhideTime] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        let unhideAt: string | undefined = undefined;

        if (unhideDate && unhideTime) {
            const releaseAt = new Date(`${unhideDate}T${unhideTime}`);
            if (isNaN(releaseAt.getTime()) || releaseAt <= new Date()) {
                setError('Please select a valid date and time in the future.');
                return;
            }
            unhideAt = releaseAt.toISOString();
        } else if (unhideDate || unhideTime) {
            setError('Please set both a date and a time, or leave both empty.');
            return;
        }

        setError('');
        onSetTDM({
            conversationId: conversation.id,
            isHidden: true,
            unhideAt,
        });
    };

    const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-2">Temporal Disguise Mode</h2>
                <p className="text-slate-400 mb-6">Hide this chat. You can set a time for it to automatically reappear.</p>
                
                <div className="space-y-4">
                    <p className="text-sm text-slate-300">Auto-reappear at (optional):</p>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            value={unhideDate}
                            onChange={e => setUnhideDate(e.target.value)}
                            min={minDate}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        />
                        <input
                            type="time"
                            value={unhideTime}
                            onChange={e => setUnhideTime(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                        />
                    </div>
                     {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all"
                    >
                        Hide Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TDMConfigModal;
