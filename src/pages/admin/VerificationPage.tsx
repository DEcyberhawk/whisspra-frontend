
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import VerificationQueueTable from '../../components/admin/verification/VerificationQueueTable';
import { User } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { API_URL } from '../../config';
import { getStorageItem } from '../../utils/storage';

const VerificationPage: React.FC = () => {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addNotification } = useNotification();

    const fetchPendingVerifications = async () => {
        setLoading(true);
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/admin/verifications/pending`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch pending verifications.');
            const data = await response.json();
            setPendingUsers(data.map((u: any) => ({ ...u, id: u._id })));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingVerifications();
    }, []);

    const handleProcessRequest = async (userId: string, action: 'approve' | 'reject') => {
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/admin/verifications/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to process request.');
            
            addNotification(`User successfully ${action === 'approve' ? 'approved' : 'rejected'}.`, 'success');
            await fetchPendingVerifications(); // Refresh list
        } catch (err: any) {
            addNotification(err.message, 'error');
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Verification Requests</h1>
            {loading && <p className="text-center p-8">Loading requests...</p>}
            {error && <p className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</p>}
            {!loading && !error && (
                <VerificationQueueTable
                    users={pendingUsers}
                    onProcessRequest={handleProcessRequest}
                />
            )}
        </DashboardLayout>
    );
};

export default VerificationPage;
