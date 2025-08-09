
import React from 'react';
import { User } from '../../types';
import Avatar from '../Avatar';
import VerifiedBadge from '../VerifiedBadge';

interface StorefrontHeaderProps {
    creator: User;
}

const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({ creator }) => {
    const bannerUrl = creator.storefrontSettings?.bannerUrl || 'https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2670&auto=format&fit=crop';

    return (
        <div className="relative">
            <div className="h-48 md:h-64 bg-slate-800 rounded-2xl overflow-hidden">
                <img src={bannerUrl} alt={`${creator.name}'s banner`} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="p-1.5 bg-slate-900 rounded-full">
                    <Avatar avatar={creator.avatar} name={creator.name} size="lg" className="w-28 h-28 md:w-36 md:h-36 text-5xl" />
                </div>
            </div>
        </div>
    );
};

export default StorefrontHeader;
