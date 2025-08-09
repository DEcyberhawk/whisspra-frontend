
import React from 'react';
import { TextMessage } from '../../../types';

interface FlaggedContentTableProps {
    messages: any[]; // Using any to accommodate populated backend objects
    onModerate: (messageId: string, action: 'dismiss' | 'delete') => void;
}

const FlaggedContentTable: React.FC<FlaggedContentTableProps> = ({ messages, onModerate }) => {
    if (messages.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center border border-dashed border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">All Clear!</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">There is no flagged content to review at this time.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Content</th>
                            <th scope="col" className="px-6 py-3">Sender</th>
                            <th scope="col" className="px-6 py-3">Reason</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map(msg => (
                            <tr key={msg._id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                <td className="px-6 py-4 max-w-sm">
                                    <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                                        {msg.messageType === 'text' ? msg.content : `[${msg.messageType}]`}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    {msg.senderId?.name || 'Unknown User'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold capitalize text-yellow-600 dark:text-yellow-400">
                                        {msg.safetyAnalysis?.type?.replace('_', ' ') || 'Warning'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(msg.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                                    <button onClick={() => onModerate(msg._id, 'dismiss')} className="font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">Dismiss</button>
                                    <button onClick={() => onModerate(msg._id, 'delete')} className="font-medium text-red-600 dark:text-red-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FlaggedContentTable;
