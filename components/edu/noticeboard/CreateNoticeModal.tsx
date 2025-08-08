
import React, { useState } from 'react';

interface CreateNoticeModalProps {
    onClose: () => void;
    onCreate: (details: { title: string, content: string, category: string }) => void;
}

const categories = ['News', 'Event', 'Alert'];

const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({ onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onCreate({ title, content, category });
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-700" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4">Create New Notice</h2>
                <div className="space-y-4">
                     <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Notice Title" required className="w-full bg-slate-700 p-2 rounded-md" />
                     <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content..." required className="w-full bg-slate-700 p-2 rounded-md" rows={5}></textarea>
                     <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-700 p-2 rounded-md">
                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                     </select>
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 bg-slate-600 hover:bg-slate-500 font-semibold py-2 rounded-lg">Cancel</button>
                        <button type="submit" disabled={isLoading} className="flex-1 bg-indigo-500 hover:bg-indigo-600 font-semibold py-2 rounded-lg disabled:opacity-50">{isLoading ? 'Posting...' : 'Post Notice'}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateNoticeModal;
