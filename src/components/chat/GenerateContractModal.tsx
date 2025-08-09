
import React from 'react';
import { GeneratedContract } from '../../types';
import { useNotification } from '../../context/NotificationContext';

interface GenerateContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    contractData: GeneratedContract | null;
    onSendToChat: (text: string) => void;
}

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-48">
        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-slate-400">Analyzing conversation...</p>
    </div>
);

const GenerateContractModal: React.FC<GenerateContractModalProps> = ({ isOpen, onClose, isLoading, contractData, onSendToChat }) => {
    const { addNotification } = useNotification();
    
    if (!isOpen) return null;

    const formatContractForChat = (): string => {
        if (!contractData) return '';
        return `**Informal Agreement Summary**
---
**Parties:** ${contractData.parties}
**Effective Date:** ${contractData.effectiveDate}

**Agreed Terms:**
${contractData.terms.map(term => `- ${term}`).join('\n')}
---
This is an AI-generated summary and not a legally binding document.`;
    };
    
    const handleCopyToClipboard = () => {
        const textToCopy = formatContractForChat();
        navigator.clipboard.writeText(textToCopy);
        addNotification('Agreement copied to clipboard!', 'success');
    };

    const handleSend = () => {
        const textToSend = formatContractForChat();
        onSendToChat(textToSend);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-4">Chat-to-Agreement</h2>
                
                {isLoading && <LoadingSpinner />}
                
                {!isLoading && contractData && (
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-indigo-400">Parties</h3>
                            <p className="text-slate-300">{contractData.parties}</p>
                        </div>
                         <div className="bg-slate-900/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-indigo-400">Effective Date</h3>
                            <p className="text-slate-300">{contractData.effectiveDate}</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-lg">
                            <h3 className="font-semibold text-indigo-400">Agreed Terms</h3>
                            <ul className="list-disc list-inside space-y-1 text-slate-300 mt-2">
                                {contractData.terms.map((term, index) => <li key={index}>{term}</li>)}
                            </ul>
                        </div>
                        <p className="text-xs text-slate-500 text-center">This is an AI-generated summary and not legally binding.</p>
                        
                        <div className="flex gap-4 pt-4">
                            <button onClick={handleCopyToClipboard} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg">Copy to Clipboard</button>
                            <button onClick={handleSend} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg">Send to Chat</button>
                        </div>
                    </div>
                )}
                
                {!isLoading && !contractData && (
                    <div className="text-center p-8">
                        <p className="text-slate-400">Could not generate an agreement. There may not be enough information in the chat, or an error occurred.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateContractModal;
