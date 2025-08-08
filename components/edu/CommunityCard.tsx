
import React from 'react';
import { Community } from '../../types';

interface CommunityCardProps {
    community: Community;
    onJoin: (communityId: string) => void;
}

const categoryStyles = {
    'Study Group': 'bg-blue-500/20 text-blue-300',
    'Social Club': 'bg-purple-500/20 text-purple-300',
    'Campus Event': 'bg-yellow-500/20 text-yellow-300',
    'Resource Hub': 'bg-green-500/20 text-green-300',
};

const CommunityCard: React.FC<CommunityCardProps> = ({ community, onJoin }) => {
    return (
        <div className="bg-slate-800 rounded-lg flex flex-col p-5 border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-white mb-1">{community.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryStyles[community.category] || categoryStyles['Social Club']}`}>
                        {community.category}
                    </span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{community.description}</p>
            </div>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-700">
                <div className="text-xs text-slate-400">
                    <p>{community.memberCount} {community.memberCount === 1 ? 'member' : 'members'}</p>
                    <p>Created by {community.creator.name}</p>
                </div>
                <button 
                    onClick={() => onJoin(community._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg text-sm"
                >
                    Join
                </button>
            </div>
        </div>
    );
};

export default CommunityCard;
