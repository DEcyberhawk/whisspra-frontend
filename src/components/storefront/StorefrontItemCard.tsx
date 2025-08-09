
import React from 'react';
import { MarketplaceItem } from '../../types';

interface StorefrontItemCardProps {
    item: MarketplaceItem;
    onSelect: () => void;
}

const StorefrontItemCard: React.FC<StorefrontItemCardProps> = ({ item, onSelect }) => {
    return (
        <div 
            onClick={onSelect}
            className="bg-slate-800 rounded-lg flex flex-col cursor-pointer group overflow-hidden border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1"
        >
            <div className="h-48 bg-slate-700">
                <img src={item.thumbnailUrl || 'https://placehold.co/400x300'} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-white flex-grow">{item.title}</h3>
                <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-slate-400">by {item.creator.name}</div>
                    <div className="font-bold text-lg text-indigo-400">${item.price.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
};

export default StorefrontItemCard;
