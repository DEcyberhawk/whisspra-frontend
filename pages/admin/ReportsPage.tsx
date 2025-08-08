


import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import FlaggedContentTable from '../../components/admin/reports/FlaggedContentTable';
import { useNotification } from '../../context/NotificationContext';

const API_URL = 'http://localhost:5000/api/admin/reports';

const ReportsPage: React.FC = () => {
    const [flaggedContent, setFlaggedContent] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addNotification } = useNotification();

    const fetchFlaggedContent = async () => {
        const token = localStorage.getItem('whisspra_token');
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/flagged`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch flagged content.');
            const data = await response.json();
            setFlaggedContent(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlaggedContent();
    }, []);

    const handleModeration = async (messageId: string, action: 'dismiss' | 'delete') => {
        const token = localStorage.getItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/flagged/${messageId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Moderation action failed.');
            
            addNotification(`Action '${action}' was successful.`, 'success');
            await fetchFlaggedContent(); // Refresh the list
        } catch (err: any) {
            addNotification(err.message, 'error');
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Flagged Content Reports</h1>
             <p className="text-slate-500 dark:text-slate-400 mb-8">
                Review content automatically flagged by the AI safety scanner.
            </p>
            {loading && <p className="text-center p-8">Loading reports...</p>}
            {error && <p className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</p>}
            {!loading && !error && (
                <FlaggedContentTable
                    messages={flaggedContent}
                    onModerate={handleModeration}
                />
            )}
        </DashboardLayout>
    );
};

export default ReportsPage;