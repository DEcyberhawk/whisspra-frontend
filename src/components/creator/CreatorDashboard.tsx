
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Transaction } from '../../types';
import StatCard from '../admin/StatCard';
import TransactionHistoryTable from './TransactionHistoryTable';
import { API_URL } from '../../config';
import { getStorageItem } from '../../utils/storage';

const CreatorDashboard: React.FC = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState({ totalEarnings: 0, tipCount: 0, saleCount: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEarnings = async () => {
            const token = await getStorageItem('whisspra_token');
            if (!token) {
                setError("Authentication required.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/creators/earnings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch earnings data.');
                
                const data = await response.json();
                setTransactions(data.data);
                
                // Calculate stats
                const totalEarnings = data.totalEarnings || 0;
                const tipCount = data.data.filter((t: Transaction) => t.details?.type === 'tip').length;
                const saleCount = data.data.filter((t: Transaction) => t.details?.type === 'marketplace_sale').length;
                setStats({ totalEarnings, tipCount, saleCount });

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.isCreator) {
            fetchEarnings();
        }
    }, [user]);

    if (isLoading) {
        return <div className="p-6 text-center text-slate-400">Loading Creator Dashboard...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-400">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-900 p-6 overflow-y-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
            <p className="text-slate-400 mb-8">Welcome back, {user?.name}. Here's how you're doing.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Earnings" value={`$${stats.totalEarnings.toFixed(2)}`} />
                <StatCard title="Tips Received" value={stats.tipCount} />
                <StatCard title="Items Sold" value={stats.saleCount} />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4 text-white">Recent Transactions</h2>
                <TransactionHistoryTable transactions={transactions} />
            </div>
        </div>
    );
};

export default CreatorDashboard;
