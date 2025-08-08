
import React from 'react';
import { useAuth } from '../context/AuthContext';

const WalletPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-6 h-full overflow-y-auto text-white">
            <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
            <p className="text-slate-400 mb-8">Your balance and transaction history for the Whisspra ecosystem.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Balance Card */}
                <div className="bg-indigo-500/20 border border-indigo-500/50 rounded-lg p-6">
                    <p className="text-sm text-indigo-300 font-semibold">WHISPR TOKEN BALANCE</p>
                    <p className="text-4xl font-bold mt-2">{user?.whisprTokenBalance?.toFixed(4) || '0.0000'}</p>
                </div>

                {/* Relay Stats Card */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <p className="text-sm text-slate-400 font-semibold">MESH NETWORK STATS</p>
                     <div className="flex items-baseline mt-2">
                        <p className="text-4xl font-bold">1,402</p>
                        <p className="text-slate-400 ml-2">messages relayed</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                    <p className="text-slate-500">Transaction history is coming soon.</p>
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
