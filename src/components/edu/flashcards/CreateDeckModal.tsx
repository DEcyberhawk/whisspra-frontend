
import React, { useState } from 'react';

interface CreateDeckModalProps {
    onClose: () => void;
    onCreate: (name: string) => void;
}

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onCreate(name);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-slate-700" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4">Create New Deck</h2>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Deck Name (e.g., Chapter 5 Vocab)" className="w-full bg-slate-700 p-2 rounded-md" required />
                <div className="flex gap-2 mt-4">
                    <button type="button" onClick={onClose} className="flex-1 bg-slate-600 hover:bg-slate-500 font-semibold py-2 rounded-lg">Cancel</button>
                    <button type="submit" className="flex-1 bg-indigo-500 hover:bg-indigo-600 font-semibold py-2 rounded-lg">Create</button>
                </div>
            </form>
        </div>
    );
};

export default CreateDeckModal;
