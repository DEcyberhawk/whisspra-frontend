
import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

interface CreateCommunityModalProps {
    onClose: () => void;
    onCreate: (details: { name: string, description: string, category: string }) => void;
}

const categories = ['Study Group', 'Social Club', 'Campus Event', 'Resource Hub'];

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onCreate({ name, description, category });
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-4">Create a New Community</h2>
                <div className="space-y-4">
                     <input type="text" placeholder="Community Name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md" />
                     <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md" rows={3}></textarea>
                     <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-700 p-2 rounded-md">
                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                     </select>
                    <button type="submit" disabled={isLoading} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
                        {isLoading ? 'Creating...' : 'Create Community'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCommunityModal;
