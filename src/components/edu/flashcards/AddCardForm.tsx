
import React, { useState } from 'react';

interface AddCardFormProps {
    onAddCard: (front: string, back: string) => void;
}

const AddCardForm: React.FC<AddCardFormProps> = ({ onAddCard }) => {
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (front.trim() && back.trim()) {
            onAddCard(front, back);
            setFront('');
            setBack('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <h4 className="font-semibold text-sm text-slate-300">Add a New Card</h4>
            <div className="flex gap-2">
                <input type="text" value={front} onChange={e => setFront(e.target.value)} placeholder="Front side..." className="flex-1 bg-slate-900/80 p-2 rounded-md border border-slate-600" />
                <input type="text" value={back} onChange={e => setBack(e.target.value)} placeholder="Back side..." className="flex-1 bg-slate-900/80 p-2 rounded-md border border-slate-600" />
                <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 font-semibold px-4 rounded-md">+</button>
            </div>
        </form>
    );
};

export default AddCardForm;
