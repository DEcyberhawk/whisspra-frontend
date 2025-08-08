
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { API_URL } from '../../config';
import { getStorageItem } from '../../utils/storage';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
    const { fetchUser } = useAuth();
    const { addNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        const token = await getStorageItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/users/verification/submit`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to submit request.');
            
            addNotification('Verification request submitted for review.', 'success');
            if(token) await fetchUser(token);
            onClose();
        } catch (error: any) {
            addNotification(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-4">Identity Verification</h2>
                <p className="text-slate-300 mb-6">
                    Submit your profile for verification to get a badge. This helps prove your authenticity. 
                    An administrator will review your request.
                </p>
                <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                    {isLoading ? 'Submitting...' : 'Submit for Review'}
                </button>
            </div>
        </div>
    );
};

export default VerificationModal;
