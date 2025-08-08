

import React, { useState } from 'react';
import { MarketplaceItem } from '../../types';
import { useNotification } from '../../context/NotificationContext';

const API_URL = 'http://localhost:5000/api';

interface ListItemModalProps {
    onClose: () => void;
    onItemCreated: (item: MarketplaceItem) => void;
}

const ListItemModal: React.FC<ListItemModalProps> = ({ onClose, onItemCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [assetUrl, setAssetUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/marketplace`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title, description, price, thumbnailUrl, assetUrl })
            });
            if (!response.ok) throw new Error('Failed to list item.');
            const newItem = await response.json();
            addNotification('Item listed successfully!', 'success');
            onItemCreated(newItem);
        } catch (error) {
            addNotification('Error listing item.', 'error');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-4">List a New Marketplace Item</h2>
                <div className="space-y-4">
                     <input type="text" placeholder="Item Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md" />
                     <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md" rows={3}></textarea>
                     <input type="number" placeholder="Price (USD)" value={price} onChange={e => setPrice(parseFloat(e.target.value))} required min="0" step="0.01" className="w-full bg-slate-700 p-2 rounded-md" />
                     <input type="text" placeholder="Thumbnail Image URL" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md" />
                     <input type="text" placeholder="Digital Asset URL" value={assetUrl} onChange={e => setAssetUrl(e.target.value)} required className="w-full bg-slate-700 p-2 rounded-md" />
                    <button type="submit" disabled={isLoading} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50">
                        {isLoading ? 'Listing...' : 'List Item'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ListItemModal;