

import React from 'react';
import { User } from '../../types';
import VerifiedBadge from '../VerifiedBadge';
import Avatar from '../Avatar';
import { Link } from 'react-router-dom';

interface CreatorProfileModalProps {
    user: User;
    onClose: () => void;
    onSendTip: () => void;
}

const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({ user, onClose, onSendTip }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative text-center"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="mx-auto -mt-16 border-4 border-slate-800 rounded-full">
                    <Avatar avatar={user.avatar} name={user.name} size="lg" className="w-24 h-24 text-4xl" />
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-4">
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    {user.isVerified && <VerifiedBadge />}
                </div>
                <p className="text-sm text-indigo-400">@{user.name.toLowerCase().replace(' ','')}</p>
                
                <p className="text-slate-300 mt-4 max-w-sm mx-auto">{user.bio}</p>
                
                <div className="mt-6 flex justify-center space-x-6">
                    <div>
                        <p className="text-xl font-bold text-white">{Intl.NumberFormat('en-US', { notation: 'compact' }).format(user.followers || 0)}</p>
                        <p className="text-sm text-slate-400">Followers</p>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link
                        to={`/store/${user.id}`}
                        className="w-full sm:flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
                    >
                        Visit Store
                    </Link>
                    <button
                        onClick={onSendTip}
                        className="w-full sm:flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20"
                    >
                        Send Tip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatorProfileModal;