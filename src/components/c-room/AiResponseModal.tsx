import React from 'react';

interface AiResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    response: string | null;
    isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-48">
        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-slate-400">AI is thinking...</p>
    </div>
);

const AiResponseModal: React.FC<AiResponseModalProps> = ({ isOpen, onClose, response, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-700 relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">AI Response</h2>
                
                {isLoading && <LoadingSpinner />}
                
                {response && !isLoading && (
                    <div className="max-h-[60vh] overflow-y-auto pr-2 text-slate-300 whitespace-pre-wrap">
                        <p>{response}</p>
                    </div>
                )}

                 {!isLoading && !response && (
                    <div className="text-center p-8">
                        <p className="text-slate-400">The AI response will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiResponseModal;