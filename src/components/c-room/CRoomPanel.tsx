
import React, { useState } from 'react';
import { CRoomPanelProps } from '../../types';

const CRoomPanel: React.FC<CRoomPanelProps> = ({ isOpen, onClose, onGetSummary, onAskMemory, isLoading }) => {
    const [question, setQuestion] = useState('');

    if (!isOpen) return null;

    const handleAsk = () => {
        if (question.trim()) {
            onAskMemory(question);
            setQuestion('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-indigo-500/10 p-2 rounded-lg">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                    </div>
                    <div>
                         <h2 className="text-2xl font-bold text-white">C-Room AI Tools</h2>
                         <p className="text-slate-400 text-sm">Interact with this chat's memory.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={onGetSummary}
                        disabled={isLoading}
                        className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <h3 className="font-semibold text-white">Generate Summary</h3>
                        <p className="text-sm text-slate-400">Get a concise summary of the conversation so far.</p>
                    </button>

                    <div className="space-y-2">
                        <textarea
                            placeholder="Ask a question about this conversation's history..."
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        />
                         <button
                            onClick={handleAsk}
                            disabled={isLoading || !question.trim()}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 disabled:bg-indigo-400/50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Thinking...' : 'Ask Room Memory'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CRoomPanel;
