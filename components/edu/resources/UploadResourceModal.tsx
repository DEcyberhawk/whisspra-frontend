

import React, { useState, useRef } from 'react';
import { useNotification } from '../../../context/NotificationContext';

const API_URL = 'http://localhost:5000/api/edu';

interface UploadResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    communityId: string | undefined;
    onResourceUploaded: () => void;
}

const UploadResourceModal: React.FC<UploadResourceModalProps> = ({ isOpen, onClose, communityId, onResourceUploaded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title || !communityId) {
            addNotification('Title and file are required.', 'error');
            return;
        }
        setIsLoading(true);
        const token = localStorage.getItem('whisspra_token');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);

        try {
            const res = await fetch(`${API_URL}/communities/${communityId}/resources`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) throw new Error('Failed to upload resource.');
            addNotification('Resource uploaded successfully!', 'success');
            onResourceUploaded();
            onClose();
        } catch (err: any) {
            addNotification(err.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 border border-slate-700" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-white mb-4">Upload a Resource</h2>
                <div className="space-y-4">
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Resource Title" required className="w-full bg-slate-700 p-2 rounded-md" />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description (optional)" className="w-full bg-slate-700 p-2 rounded-md" rows={2} />
                    <input type="file" ref={fileInputRef} onChange={e => setFile(e.target.files ? e.target.files[0] : null)} required className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    <div className="flex gap-2 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 bg-slate-600 hover:bg-slate-500 font-semibold py-2 rounded-lg">Cancel</button>
                        <button type="submit" disabled={isLoading} className="flex-1 bg-indigo-500 hover:bg-indigo-600 font-semibold py-2 rounded-lg disabled:opacity-50">{isLoading ? 'Uploading...' : 'Upload'}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UploadResourceModal;