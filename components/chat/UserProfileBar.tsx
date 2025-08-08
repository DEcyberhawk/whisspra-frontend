
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../Avatar';
import { User } from '../../types';

type Status = 'online' | 'away' | 'busy' | 'driving' | 'sleeping';

const statusOptions: { status: Status, label: string, icon: JSX.Element }[] = [
    { status: 'online', label: 'Online', icon: <div className="w-2.5 h-2.5 rounded-full bg-green-500" /> },
    { status: 'away', label: 'Away', icon: <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> },
    { status: 'busy', label: 'Busy', icon: <div className="w-2.5 h-2.5 rounded-full bg-red-500" /> },
    { status: 'driving', label: 'Driving', icon: <div className="w-2.5 h-2.5 rounded-full bg-purple-500" /> },
    { status: 'sleeping', label: 'Sleeping', icon: <div className="w-2.5 h-2.5 rounded-full bg-slate-500" /> },
];

const StatusIndicator: React.FC<{ status: Status }> = ({ status }) => {
    const currentStatus = statusOptions.find(s => s.status === status);
    return currentStatus ? currentStatus.icon : statusOptions[0].icon;
}

const UserProfileBar: React.FC = () => {
    const { user, updateUserPresence } = useAuth();
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [customStatus, setCustomStatus] = useState(user?.presence?.message || '');
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user?.presence?.message) {
            setCustomStatus(user.presence.message);
        } else {
            setCustomStatus('');
        }
    }, [user?.presence?.message]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleStatusChange = (status: Status) => {
        updateUserPresence({ status, message: user?.presence?.message || '' });
        setIsStatusOpen(false);
    };
    
    const handleCustomStatusSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserPresence({
            status: user?.presence?.status || 'online',
            message: customStatus,
        });
        setIsStatusOpen(false);
    };

    if (!user) return null;

    return (
        <div className="p-3 bg-gray-200 dark:bg-slate-800/50 mt-auto flex-shrink-0 relative">
            {isStatusOpen && (
                 <div ref={popoverRef} className="absolute bottom-full left-3 right-3 mb-2 p-2 bg-slate-700 rounded-lg shadow-lg border border-slate-600 w-64">
                    <p className="text-xs font-semibold text-slate-400 px-2 pb-2">Set a status</p>
                    <ul className="space-y-1">
                        {statusOptions.map(option => (
                             <li key={option.status} onClick={() => handleStatusChange(option.status)} className="flex items-center gap-3 p-2 text-sm text-slate-200 hover:bg-slate-600/50 rounded-md cursor-pointer">
                                {option.icon}
                                <span className="capitalize">{option.label}</span>
                             </li>
                        ))}
                    </ul>
                    <div className="border-t border-slate-600 my-2"></div>
                    <form onSubmit={handleCustomStatusSubmit}>
                        <input
                            type="text"
                            placeholder="What's on your mind?"
                            value={customStatus}
                            onChange={(e) => setCustomStatus(e.target.value)}
                            maxLength={50}
                            className="w-full bg-slate-800 text-sm text-white placeholder-slate-400 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </form>
                </div>
            )}
            <div className="flex items-center space-x-3">
                <div className="relative cursor-pointer" onClick={() => setIsStatusOpen(!isStatusOpen)}>
                    <Avatar avatar={user.avatar} name={user.name} className="w-10 h-10" />
                    <div className="absolute bottom-0 right-0 p-0.5 bg-gray-100 dark:bg-slate-800 rounded-full">
                         <StatusIndicator status={user.presence?.status || 'online'} />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-slate-800 dark:text-white">{user.name}</p>
                    <p className="text-xs truncate text-slate-500 dark:text-slate-400 capitalize">{user.presence?.message || user.presence?.status || 'Online'}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfileBar;