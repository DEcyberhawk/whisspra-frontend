
import React from 'react';
import { ActivityLog } from '../../types';

interface ActivityLogTableProps {
    logs: ActivityLog[];
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ logs }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
             <div className="overflow-y-auto max-h-[600px]">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Action</th>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                         {logs.slice(0, 15).map(log => ( // Show latest 15 logs
                            <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-600/50">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-800 dark:text-slate-200">{log.action.replace(/_/g, ' ')}</p>
                                    <p className="text-xs">by {log.actor.name}</p>
                                </td>
                                <td className="px-6 py-4 text-xs">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityLogTable;
