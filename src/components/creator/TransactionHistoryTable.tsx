

import React from 'react';
import { Transaction } from '../../types';
import Avatar from '../Avatar';

interface TransactionHistoryTableProps {
    transactions: Transaction[];
}

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({ transactions }) => {
    if (transactions.length === 0) {
        return (
            <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
                <p className="text-slate-400">No transactions yet. Start sharing your work to earn!</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-lg shadow-md border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-300 uppercase bg-slate-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">From</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <tr key={tx._id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-600/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(tx.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <Avatar avatar={tx.fromUser.avatar} name={tx.fromUser.name} size="sm" />
                                        <span>{tx.fromUser.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                                        tx.details?.type === 'tip' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
                                    }`}>
                                        {tx.details?.type === 'tip' ? 'Tip' : `Sale: ${tx.details?.title || 'Item'}`}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-green-400">
                                    +${tx.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistoryTable;