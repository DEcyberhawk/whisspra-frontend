import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import { useNotification } from '../../context/NotificationContext';
import { useSettings } from '../../context/SettingsContext';
import { API_URL } from '../../config';
import { getStorageItem } from '../../utils/storage';
import FeatureFlagTable from '../../components/admin/features/FeatureFlagTable';

export interface FeatureFlag {
    _id: string;
    name: string;
    description: string;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}

const FeaturesPage: React.FC = () => {
    const [features, setFeatures] = useState<FeatureFlag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addNotification } = useNotification();
    const { refetchSettings } = useSettings();

    const fetchFeatures = async () => {
        setLoading(true);
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/admin/features`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch feature flags.');
            const data = await response.json();
            setFeatures(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    const handleToggleFeature = async (featureId: string, isEnabled: boolean) => {
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/admin/features/${featureId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isEnabled })
            });
            if (!response.ok) throw new Error('Failed to update feature flag.');

            addNotification('Feature flag updated successfully.', 'success');
            await fetchFeatures(); // Refresh the list
            refetchSettings(); // Refresh global settings context
        } catch (err: any) {
            addNotification(err.message, 'error');
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Feature Flags</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                Globally enable or disable major platform features in real-time.
            </p>
            {loading && <p className="text-center p-8">Loading features...</p>}
            {error && <p className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</p>}
            {!loading && !error && (
                <FeatureFlagTable features={features} onToggle={handleToggleFeature} />
            )}
        </DashboardLayout>
    );
};

export default FeaturesPage;
