
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import OfflineConnectModal from '../p2p/OfflineConnectModal';
import { useServerlessRTC } from '../../hooks/useServerlessRTC';

interface MeshModeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MeshModeModal: React.FC<MeshModeModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [isConnecting, setIsConnecting] = useState(false);
    
    // This hook is for the QR connection logic. We pass a dummy onMessage for now.
    const { status, offer, answer, createOffer, handleOffer, handleAnswer, cleanup } = useServerlessRTC(user, (data) => {
        console.log('P2P Message Received (Mesh):', data);
    });

    const handleClose = () => {
        cleanup();
        setIsConnecting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {isConnecting && (
                <OfflineConnectModal
                    isOpen={isConnecting}
                    onClose={() => setIsConnecting(false)}
                    status={status}
                    offer={offer}
                    answer={answer}
                    createOffer={createOffer}
                    handleOffer={handleOffer}
                    handleAnswer={handleAnswer}
                />
            )}
            <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={handleClose}>
                <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                    <button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-500/10 p-2 rounded-lg">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">WhisperNet Control Center</h2>
                            <p className="text-slate-400 text-sm">Manage your offline & mesh connections.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-slate-700/50 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-white">1,402</p>
                                <p className="text-xs text-slate-400">Messages Relayed</p>
                            </div>
                            <div className="bg-slate-700/50 p-4 rounded-lg">
                                <p className="text-2xl font-bold text-white">{user?.whisprTokenBalance?.toFixed(2) || '7.01'}</p>
                                <p className="text-xs text-slate-400">Whispr Tokens Earned</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsConnecting(true)}
                            className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <h3 className="font-semibold text-white">Connect to a Nearby Peer</h3>
                            <p className="text-sm text-slate-400">Establish a direct, serverless connection via QR code for offline chat.</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MeshModeModal;
