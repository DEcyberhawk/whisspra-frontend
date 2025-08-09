
import React from 'react';
import { Notice } from '../../../types';

interface NoticeCardProps {
    notice: Notice;
}

const categoryStyles = {
    'Event': 'bg-purple-500/20 text-purple-300',
    'News': 'bg-blue-500/20 text-blue-300',
    'Alert': 'bg-red-500/20 text-red-300',
};

const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
    return (
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700/50">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-white">{notice.title}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryStyles[notice.category] || categoryStyles['News']}`}>
                    {notice.category}
                </span>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-wrap mb-4">{notice.content}</p>
            <div className="text-xs text-slate-500 text-right">
                Posted by {notice.author.name} on {new Date(notice.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
};

export default NoticeCard;
