
import React, { useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';

interface CreateApiKeyModalProps {
    apiKey: string;
    onClose: () => void;
}

const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({ apiKey, onClose }) => {
    const [copied, setCopied] = useState(false);
    const { addNotification } = useNotification();

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        addNotification('API Key copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-700 relative"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white mb-4">API Key Generated</h2>
                
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-lg mb-4">
                    <p className="font-semibold">Important: Copy this key now.</p>
                    <p className="text-sm mt-1">For your security, this is the only time the full API key will be displayed.</p>
                </div>

                <div className="relative bg-slate-900 p-3 rounded-lg flex items-center">
                    <pre className="flex-1 text-green-400 font-mono text-sm overflow-x-auto">
                        <code>{apiKey}</code>
                    </pre>
                    <button onClick={handleCopy} className="ml-4 text-slate-400 hover:text-white">
                        {copied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        )}
                    </button>
                </div>
                
                <button 
                    onClick={onClose}
                    className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default CreateApiKeyModal;
