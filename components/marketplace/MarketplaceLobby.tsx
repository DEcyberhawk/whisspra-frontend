

import React, { useState, useEffect } from 'react';
import { MarketplaceItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import ListItemModal from './ListItemModal';
import PurchaseItemModal from './PurchaseItemModal';

const API_URL = 'http://localhost:5000/api';

const MarketplaceLobby: React.FC = () => {
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isListItemModalOpen, setIsListItemModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
    const { user } = useAuth();

    const fetchItems = async () => {
        const token = localStorage.getItem('whisspra_token');
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/marketplace`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch marketplace items", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleItemCreated = (newItem: MarketplaceItem) => {
        setItems(prev => [newItem, ...prev]);
        setIsListItemModalOpen(false);
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-900 p-6">
            {isListItemModalOpen && <ListItemModal onClose={() => setIsListItemModalOpen(false)} onItemCreated={handleItemCreated} />}
            {selectedItem && <PurchaseItemModal item={selectedItem} onClose={() => setSelectedItem(null)} onPurchaseSuccess={fetchItems} />}
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Marketplace</h1>
                {user?.isCreator && (
                    <button 
                        onClick={() => setIsListItemModalOpen(true)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        List New Item
                    </button>
                )}
            </div>
            {isLoading ? <p className="text-slate-400">Loading items...</p> : (
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-y-auto pr-2">
                    {items.map(item => (
                        <div key={item._id} className="bg-slate-800 rounded-lg flex flex-col cursor-pointer hover:ring-2 ring-indigo-500 transition-all" onClick={() => setSelectedItem(item)}>
                            <img src={item.thumbnailUrl || 'https://placehold.co/400x300'} alt={item.title} className="w-full h-40 object-cover rounded-t-lg" />
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="font-bold text-white flex-grow">{item.title}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-sm text-slate-400">by {item.creator.name}</div>
                                    <div className="font-bold text-indigo-400">${item.price.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MarketplaceLobby;