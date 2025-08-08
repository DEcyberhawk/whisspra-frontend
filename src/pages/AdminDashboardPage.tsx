
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/admin/DashboardLayout';
import StatCard from '../components/admin/StatCard';
import { AdminStats, Transaction } from '../types';
import EarningsChart from '../components/admin/EarningsChart';
import TransactionTable from '../components/admin/TransactionTable';
import { API_URL } from '../config';
import { getStorageItem } from '../utils/storage';

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = await getStorageItem('whisspra_token');
            if (!token) {
                setError("No authentication token found.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const headers = { 'Authorization': `Bearer ${token}` };
                
                const statsPromise = fetch(`${API_URL}/admin/stats`, { headers });
                const transactionsPromise = fetch(`${API_URL}/admin/transactions`, { headers });

                const [statsResponse, transactionsResponse] = await Promise.all([statsPromise, transactionsPromise]);

                if (!statsResponse.ok) throw new Error('Failed to fetch platform statistics');
                const statsData = await statsResponse.json();
                setStats(statsData.stats);

                if (!transactionsResponse.ok) throw new Error('Failed to fetch transactions');
                const transactionsData = await transactionsResponse.json();
                setTransactions(transactionsData);
                
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Admin Dashboard</h1>
            
            {loading && <div className="text-center p-8">Loading dashboard data...</div>}
            {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">Error: {error}</div>}
            
            {!loading && !error && stats && (
                <div className="space-y-8">
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Users" value={stats.totalUsers} />
                        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
                        <StatCard title="Tips Volume" value={`$${stats.totalTips.toFixed(2)}`} />
                        <StatCard title="Marketplace Sales" value={`$${stats.totalMarketplaceSales.toFixed(2)}`} />
                    </div>

                    {/* Earnings Chart */}
                    <EarningsChart chartData={stats.dailyRevenueChartData} />
                    
                    {/* Recent Transactions */}
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Recent Transactions</h2>
                        <TransactionTable transactions={transactions} />
                    </div>

                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminDashboardPage;
