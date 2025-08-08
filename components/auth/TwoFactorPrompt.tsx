
import React, { useState } from 'react';

interface TwoFactorPromptProps {
    onSubmit: (token: string) => void;
    onBack: () => void;
    isLoading: boolean;
}

const TwoFactorPrompt: React.FC<TwoFactorPromptProps> = ({ onSubmit, onBack, isLoading }) => {
    const [token, setToken] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(token);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Two-Factor Authentication</h2>
            <p className="text-gray-400 text-center mb-8">Enter the code from your authenticator app.</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="2fa-token">6-Digit Code</label>
                    <input 
                        id="2fa-token" 
                        type="text" 
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                        disabled={isLoading}
                        maxLength={6}
                        autoComplete="one-time-code"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:bg-indigo-400"
                    disabled={isLoading || token.length < 6}
                >
                    {isLoading ? 'Verifying...' : 'Verify'}
                </button>
            </form>
             <button 
                onClick={onBack}
                className="w-full text-center text-gray-400 mt-4 hover:text-indigo-300 text-sm"
                disabled={isLoading}
            >
                Back to login
            </button>
        </div>
    );
};

export default TwoFactorPrompt;