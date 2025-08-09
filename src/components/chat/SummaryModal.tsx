import React from 'react';

interface SummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: string;
    isLoading: boolean;
    error: string | null;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, summary, isLoading, error }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-700 relative transform transition-all duration-300 scale-95"
                style={{ transform: isOpen ? 'scale(1)' : 'scale(0.95)' }}
                onClick={e => e.stopPropagation()}
            >
                 <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">Chat Summary</h2>
                
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-48">
                        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-slate-400">Generating summary...</p>
                    </div>
                )}
                {error && (
                     <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg">
                        <p className="font-semibold">Could not generate summary</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}
                {summary && !isLoading && (
                    <div className="max-h-[60vh] overflow-y-auto pr-2 text-slate-300 whitespace-pre-wrap selection:bg-indigo-500/50">
                        <p>{summary}</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SummaryModal;