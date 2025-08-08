
import React, { useState, useEffect } from 'react';
import { Notice } from '../../../types';
import { useNotification } from '../../../context/NotificationContext';
import NoticeCard from './NoticeCard';
import CreateNoticeModal from './CreateNoticeModal';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config';
import { getStorageItem } from '../../../utils/storage';

const NoticeboardTab: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { addNotification } = useNotification();
    const { user } = useAuth();

    const fetchNotices = async () => {
        const token = await getStorageItem('whisspra_token');
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/edu/notices`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Failed to fetch notices.');
            setNotices(await res.json());
        } catch (err: any) { addNotification(err.message, 'error'); }
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleCreateNotice = async (details: { title: string, content: string, category: string }) => {
        const token = await getStorageItem('whisspra_token');
        try {
            const res = await fetch(`${API_URL}/edu/notices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(details)
            });
            if (!res.ok) throw new Error('Failed to create notice.');
            addNotification('Notice posted!', 'success');
            setIsCreateModalOpen(false);
            fetchNotices();
        } catch (err: any) { addNotification(err.message, 'error'); }
    };

    return (
        <div className="h-full">
            {isCreateModalOpen && <CreateNoticeModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreateNotice} />}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Campus Noticeboard</h1>
                    <p className="text-slate-400">Latest news, events, and alerts.</p>
                </div>
                {user?.role === 'admin' && (
                     <button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg">
                        + New Notice
                    </button>
                )}
            </div>
            {isLoading ? <p>Loading notices...</p> : (
                <div className="space-y-4">
                    {notices.map(notice => <NoticeCard key={notice._id} notice={notice} />)}
                </div>
            )}
        </div>
    );
};

export default NoticeboardTab;
