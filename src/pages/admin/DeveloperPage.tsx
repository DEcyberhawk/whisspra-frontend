
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import ApiKeysTable from '../../components/admin/developer/ApiKeysTable';
import CreateApiKeyModal from '../../components/admin/developer/CreateApiKeyModal';
import { ApiKey } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { API_URL } from '../../config';
import { getStorageItem } from '../../utils/storage';

const DeveloperPage: React.FC = () => {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newApiKey, setNewApiKey] = useState<string | null>(null);
    const { addNotification } = useNotification();

    const fetchApiKeys = async () => {
        const token = await getStorageItem('whisspra_token');
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/developer/keys`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch API keys.');
            const data = await response.json();
            setKeys(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const handleGenerateKey = async () => {
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/developer/keys`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to generate key.');
            setNewApiKey(data.apiKey);
            setIsModalOpen(true);
            addNotification('New API Key generated!', 'success');
            await fetchApiKeys(); // Refresh the list
        } catch (err: any) {
            addNotification(err.message, 'error');
        }
    };

    const handleRevokeKey = async (keyId: string) => {
        if (!window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
            return;
        }
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/developer/keys/${keyId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to revoke key.');
            addNotification('API Key successfully revoked.', 'info');
            await fetchApiKeys();
        } catch (err: any) {
            addNotification(err.message, 'error');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewApiKey(null);
    };

    return (
        <DashboardLayout>
            {newApiKey && isModalOpen && <CreateApiKeyModal apiKey={newApiKey} onClose={closeModal} />}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Developer Settings</h1>
                <button
                    onClick={handleGenerateKey}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Generate New API Key
                </button>
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                Manage API keys for third-party integrations and developer access.
            </p>

            {loading && <div className="text-center p-8">Loading API Keys...</div>}
            {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-lg">Error: {error}</div>}
            
            {!loading && !error && (
                <ApiKeysTable keys={keys} onRevoke={handleRevokeKey} />
            )}
        </DashboardLayout>
    );
};

export default DeveloperPage;
