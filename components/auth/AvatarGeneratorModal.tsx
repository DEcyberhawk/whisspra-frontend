import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const API_URL = 'http://localhost:5000/api';

interface AvatarGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-48 col-span-2">
        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);


const AvatarGeneratorModal: React.FC<AvatarGeneratorModalProps> = ({ isOpen, onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { updateUserProfile } = useAuth();
    const { addNotification } = useNotification();

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setImages([]);
        const token = localStorage.getItem('whispra_token');
        try {
            const response = await fetch(`${API_URL}/ai/generate-avatar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ prompt }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to generate images.');
            setImages(data.images);
        } catch (error: any) {
            addNotification(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAvatar = async (base64Image: string) => {
        const dataUri = `data:image/png;base64,${base64Image}`;
        try {
            await updateUserProfile({ avatar: dataUri });
            addNotification('Avatar updated successfully!', 'success');
            onClose();
        } catch (error) {
            addNotification('Failed to update avatar.', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl p-6 border border-slate-700 relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-4">Generate AI Avatar</h2>

                <div className="flex items-center gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="e.g., a fox reading a book, studio ghibli style"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        className="flex-1 bg-slate-700 p-2 rounded-md"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="bg-indigo-500 hover:bg-indigo-600 font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                    >
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 h-96 overflow-y-auto bg-slate-900/50 p-4 rounded-lg">
                    {isLoading && <LoadingSpinner />}
                    {!isLoading && images.length === 0 && (
                        <div className="col-span-2 flex items-center justify-center text-slate-400">
                            Your generated avatars will appear here.
                        </div>
                    )}
                    {images.map((img, index) => (
                        <div key={index} className="aspect-square bg-slate-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-indigo-500" onClick={() => handleSelectAvatar(img)}>
                            <img src={`data:image/png;base64,${img}`} alt={`Generated avatar ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AvatarGeneratorModal;
