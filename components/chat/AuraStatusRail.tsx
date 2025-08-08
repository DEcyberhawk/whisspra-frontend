
import React from 'react';
import Avatar from '../Avatar';

const mockStatuses = [
    { id: '1', user: { name: 'You', avatar: 'M' }, gradient: ['#86EFAC', '#10B981'] },
    { id: '2', user: { name: 'Emily', avatar: 'E' }, gradient: ['#FBBF24', '#F59E0B'] },
    { id: '3', user: { name: 'Design Team', avatar: 'D' }, gradient: ['#93C5FD', '#3B82F6'] },
    { id: '4', user: { name: 'Alex', avatar: 'A' }, gradient: ['#F9A8D4', '#EC4899'] },
    { id: '5', user: { name: 'Chris', avatar: 'C' }, gradient: ['#A78BFA', '#7C3AED'] },
];

const AuraStatusRail: React.FC = () => {
    return (
        <div className="p-4 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2 -mb-2">
                {mockStatuses.map(status => (
                    <div key={status.id} className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer group">
                         <div className="relative p-0.5 rounded-full" style={{ background: `linear-gradient(45deg, ${status.gradient[0]}, ${status.gradient[1]})`}}>
                            <div className="bg-gray-100 dark:bg-[#2F3136] p-0.5 rounded-full">
                                <Avatar name={status.user.name} avatar={status.user.avatar} size="lg" className="w-14 h-14 text-2xl" />
                            </div>
                         </div>
                         <p className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">{status.user.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuraStatusRail;
