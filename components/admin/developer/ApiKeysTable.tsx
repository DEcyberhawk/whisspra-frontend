
import React from 'react';
import { ApiKey } from '../../../types';

interface ApiKeysTableProps {
    keys: ApiKey[];
    onRevoke: (keyId: string) => void;
}

const ApiKeysTable: React.FC<ApiKeysTableProps> = ({ keys, onRevoke }) => {
    if (keys.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center border border-dashed border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">No API Keys Found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Generate your first API key to get started with integrations.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Prefix</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Created At</th>
                            <th scope="col" className="px-6 py-3">Last Used</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {keys.map(key => (
                            <tr key={key._id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                    {key.keyPrefix}...
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        key.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-400'
                                    }`}>
                                        {key.isActive ? 'Active' : 'Revoked'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(key.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {key.isActive && (
                                        <button 
                                            onClick={() => onRevoke(key._id)}
                                            className="font-medium text-red-600 dark:text-red-400 hover:underline"
                                        >
                                            Revoke
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApiKeysTable;
