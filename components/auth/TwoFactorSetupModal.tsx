

import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

interface TwoFactorSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const API_URL = 'http://localhost:5000/api';

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-48">
        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);


const TwoFactorSetupModal: React.FC<TwoFactorSetupModalProps> = ({ isOpen, onClose }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [verificationToken, setVerificationToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const { addNotification } = useNotification();
    const { fetchUser } = useAuth();
    const token = localStorage.getItem('whisspra_token');

    useEffect(() => {
        if (!isOpen) return;
        const generateSecret = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/auth/2fa/generate`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Failed to generate secret.');
                setQrCodeUrl(data.qrCodeUrl);
            } catch (error: any) {
                addNotification(error.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        generateSecret();
    }, [isOpen, token, addNotification]);
    
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifying(true);
        try {
            const response = await fetch(`${API_URL}/auth/2fa/verify-setup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token: verificationToken })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Verification failed.');
            addNotification('2FA enabled successfully!', 'success');
            if (token) await fetchUser(token);
            onClose();
        } catch (error: any) {
             addNotification(error.message, 'error');
        } finally {
            setVerifying(false);
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
                <h2 className="text-2xl font-bold text-white mb-4">Set Up Two-Factor Authentication</h2>

                {loading && <LoadingSpinner />}
                
                {!loading && qrCodeUrl && (
                    <div className="text-center">
                        <p className="text-slate-300 mb-4">1. Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
                        <div className="bg-white p-4 inline-block rounded-lg">
                            <img src={qrCodeUrl} alt="2FA QR Code" />
                        </div>
                        <p className="text-slate-300 my-4">2. Enter the 6-digit code from your app to verify.</p>
                        
                        <form onSubmit={handleVerify} className="flex gap-2">
                            <input 
                                type="text"
                                value={verificationToken}
                                onChange={e => setVerificationToken(e.target.value)}
                                maxLength={6}
                                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                            <button
                                type="submit"
                                disabled={verifying || verificationToken.length < 6}
                                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                            >
                                {verifying ? 'Verifying...' : 'Verify'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TwoFactorSetupModal;