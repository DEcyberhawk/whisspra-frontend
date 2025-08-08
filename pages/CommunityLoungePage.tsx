

import React, { useState, useEffect } from 'react';
import { Community, SmartFeed } from '../types';
import { useNotification } from '../context/NotificationContext';
import CommunityCard from '../components/edu/CommunityCard';
import CreateCommunityModal from '../components/edu/CreateCommunityModal';
import NoticeboardTab from '../components/edu/noticeboard/NoticeboardTab';
import NoticeCard from '../components/edu/noticeboard/NoticeCard';

const API_URL = 'http://localhost:5000/api';

const CommunityLoungePage: React.FC<{ onJoinCommunity: () => void }> = ({ onJoinCommunity }) => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [smartFeed, setSmartFeed] = useState<SmartFeed | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'communities' | 'noticeboard'>('communities');
    const { addNotification } = useNotification();
    const token = localStorage.getItem('whisspra_token');

    const fetchLoungeData = async () => {
        setIsLoading(true);
        try {
            const communitiesPromise = fetch(`${API_URL}/communities`, { headers: { 'Authorization': `Bearer ${token}` } });
            const feedPromise = fetch(`${API_URL}/edu/feed`, { headers: { 'Authorization': `Bearer ${token}` } });
            
            const [communitiesRes, feedRes] = await Promise.all([communitiesPromise, feedPromise]);
            
            if (!communitiesRes.ok) throw new Error('Failed to fetch communities.');
            setCommunities(await communitiesRes.json());
            
            if (!feedRes.ok) throw new Error('Failed to fetch smart feed.');
            setSmartFeed(await feedRes.json());
            
        } catch (error: any) {
            addNotification(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLoungeData();
    }, []);

    const handleJoin = async (communityId: string) => {
        try {
            const response = await fetch(`${API_URL}/communities/${communityId}/join`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to join community.');
            addNotification('Joined community successfully!', 'success');
            onJoinCommunity(); // This will trigger a re-fetch of conversations
        } catch (error: any) {
            addNotification(error.message, 'error');
        }
    };

    const handleCreate = async (details: { name: string, description: string, category: string }) => {
        try {
            const response = await fetch(`${API_URL}/communities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(details)
            });
            if (!response.ok) {
                 const data = await response.json();
                 throw new Error(data.message || 'Failed to create community.');
            }
            addNotification('Community created!', 'success');
            setIsCreateModalOpen(false);
            fetchLoungeData();
            onJoinCommunity();
        } catch (error: any) {
            addNotification(error.message, 'error');
        }
    };
    
    const renderCommunitiesTab = () => (
        <>
            {smartFeed && (smartFeed.recommendedCommunities.length > 0 || smartFeed.relevantNotices.length > 0) && (
                 <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">For You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {smartFeed.recommendedCommunities.map(c => <CommunityCard key={c._id} community={c} onJoin={handleJoin} />)}
                        {smartFeed.relevantNotices.map(n => <NoticeCard key={n._id} notice={n} />)}
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-white">All Communities</h2>
                <button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg">
                    Create Community
                </button>
            </div>
             <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 overflow-y-auto pr-2">
                {communities.map(community => (
                    <CommunityCard key={community._id} community={community} onJoin={handleJoin} />
                ))}
            </div>
        </>
    );

    return (
        <div className="flex flex-col h-full w-full bg-slate-900 p-6">
            {isCreateModalOpen && <CreateCommunityModal onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreate} />}
            
            <div className="flex border-b border-slate-700 mb-6">
                <button onClick={() => setActiveTab('communities')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'communities' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400'}`}>Communities</button>
                <button onClick={() => setActiveTab('noticeboard')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'noticeboard' ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400'}`}>Noticeboard</button>
            </div>

            {isLoading ? <p className="text-slate-400">Loading...</p> : (
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'communities' && renderCommunitiesTab()}
                    {activeTab === 'noticeboard' && <NoticeboardTab />}
                </div>
            )}
        </div>
    );
};

export default CommunityLoungePage;