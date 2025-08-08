

import React from 'react';
import { User } from '../../types';
import Avatar from '../../Avatar';

interface VerificationQueueTableProps {
    users: User[];
    onProcessRequest: (userId: string, action: 'approve' | 'reject') => void;
}

const VerificationQueueTable: React.FC<VerificationQueueTableProps> = ({ users, onProcessRequest }) => {
    if (users.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center border border-dashed border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Verification Queue is Empty</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">There are no pending verification requests to review.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Joined</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <Avatar avatar={user.avatar} name={user.name} size="sm" />
                                        <div>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button
                                        onClick={() => onProcessRequest(user.id, 'approve')}
                                        className="font-medium text-green-600 dark:text-green-400 hover:underline"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => onProcessRequest(user.id, 'reject')}
                                        className="font-medium text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VerificationQueueTable;