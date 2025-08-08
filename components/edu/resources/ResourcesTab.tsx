
import React, { useState, useEffect } from 'react';
import { Resource } from '../../../types';
import { useNotification } from '../../../context/NotificationContext';

const API_URL = 'http://localhost:5000/api/edu';

interface ResourcesTabProps {
    conversationId: string;
    onUpload: () => void;
    onPlayVideo: (url: string) => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const ResourcesTab: React.FC<ResourcesTabProps> = ({ conversationId, onUpload, onPlayVideo }) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addNotification } = useNotification();
    const token = localStorage.getItem('whispra_token');

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            try {
                // This assumes communityId can be derived from conversationId on the backend
                // or the conversation object has community details.
                // A better approach would be to pass communityId directly.
                // For now, we proceed assuming the backend can handle it.
                // const res = await fetch(`${API_URL}/communities/${communityId}/resources`, { headers: { 'Authorization': `Bearer ${token}` } });
                // if (!res.ok) throw new Error('Failed to fetch resources.');
                // setResources(await res.json());
                
                // Mocking data since we don't have communityId
                console.warn("Resource fetching is mocked. Requires communityId.");
                setResources([]);


            } catch (err: any) { addNotification(err.message, 'error'); }
            finally { setIsLoading(false); }
        };
        fetchResources();
    }, [conversationId]);
    
    if (isLoading) return <p>Loading resources...</p>;

    const documents = resources.filter(r => r.fileType === 'document');
    const videos = resources.filter(r => r.fileType === 'video');

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">Shared Resources</h3>
                <button onClick={onUpload} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-1 px-3 text-sm rounded-lg">+ Upload</button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <h4 className="text-slate-400 font-semibold text-sm mb-2">Lecture Replays</h4>
                    {videos.length > 0 ? videos.map(v => (
                        <div key={v._id} onClick={() => onPlayVideo(v.fileUrl)} className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg cursor-pointer">
                            {v.title} <span className="text-xs text-slate-500">- by {v.uploader.name}</span>
                        </div>
                    )) : <p className="text-xs text-slate-500 italic">No videos uploaded yet.</p>}
                </div>
                <div>
                    <h4 className="text-slate-400 font-semibold text-sm mb-2">Documents & Notes</h4>
                    {documents.length > 0 ? documents.map(d => (
                         <a key={d._id} href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg flex justify-between items-center">
                            <span>{d.title}</span>
                            <span className="text-xs text-slate-500">{d.fileName}</span>
                        </a>
                    )) : <p className="text-xs text-slate-500 italic">No documents uploaded yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ResourcesTab;
