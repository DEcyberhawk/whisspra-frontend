import React, { useState, useEffect } from 'react';
import useGemini from '../../../hooks/useGemini';

interface MoodTranslatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    originalText: string;
    onApplyTranslation: (newText: string) => void;
}

const moods = ['More Professional', 'More Friendly', 'More Confident', 'More Calm', 'More Concise'];

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-24">
        <svg className="animate-spin h-6 w-6 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const MoodTranslatorModal: React.FC<MoodTranslatorModalProps> = ({ isOpen, onClose, originalText, onApplyTranslation }) => {
    const { translationLoading, translationError, translateTextMessage } = useGemini();
    const [currentTranslation, setCurrentTranslation] = useState('');

    const handleTranslate = async (mood: string) => {
        setCurrentTranslation('');
        const result = await translateTextMessage(originalText, mood);
        if (result) {
            setCurrentTranslation(result);
        }
    };
    
    useEffect(() => {
        if(isOpen) {
            setCurrentTranslation('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-4">Translate Mood</h2>

                <div className="space-y-4">
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                        <p className="text-xs text-slate-400 mb-1">Original Text:</p>
                        <p className="text-slate-300 italic">"{originalText}"</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {moods.map(mood => (
                            <button
                                key={mood}
                                onClick={() => handleTranslate(mood)}
                                disabled={translationLoading}
                                className="bg-slate-700 hover:bg-slate-600 text-sm text-indigo-300 font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                            >
                                {mood}
                            </button>
                        ))}
                    </div>

                    <div className="bg-slate-900/50 p-3 rounded-lg min-h-[100px] flex items-center justify-center">
                        {translationLoading ? (
                            <LoadingSpinner />
                        ) : translationError ? (
                            <p className="text-red-400 text-sm">{translationError}</p>
                        ) : currentTranslation ? (
                            <p className="text-slate-200">{currentTranslation}</p>
                        ) : (
                            <p className="text-slate-500">Select a mood to see the AI's suggestion.</p>
                        )}
                    </div>
                    
                    <button
                        onClick={() => onApplyTranslation(currentTranslation)}
                        disabled={!currentTranslation || translationLoading}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Use This Version
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoodTranslatorModal;
