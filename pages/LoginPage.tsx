
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WhispraLogo from '../components/WhispraLogo';
import TwoFactorPrompt from '../components/auth/TwoFactorPrompt';
import { useNotification } from '../context/NotificationContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showTwoFactorPrompt, setShowTwoFactorPrompt] = useState(false);
    const [tempToken, setTempToken] = useState<string | null>(null);
    const { login, anonymousLogin, loginWithTwoFactor, loading } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login(email, password);
            if (result.twoFactorRequired && result.tempToken) {
                setTempToken(result.tempToken);
                setShowTwoFactorPrompt(true);
            } else if (result.success) {
                navigate('/chat');
            }
        } catch (error: any) {
            addNotification(error.message || "Login failed", 'error');
            console.error("Login failed", error);
        }
    };

    const handleTwoFactorSubmit = async (token: string) => {
        if (!tempToken) return;
        try {
            const success = await loginWithTwoFactor(token, tempToken);
            if (success) {
                navigate('/chat');
            }
        } catch (error: any) {
            addNotification(error.message || "2FA verification failed", 'error');
            console.error("2FA failed", error);
        }
    };

    const handleAnonymousLogin = async () => {
        try {
            const success = await anonymousLogin();
            if (success) {
                navigate('/chat');
            }
        } catch (error) {
            console.error("Anonymous login failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col justify-center items-center p-4">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-700/[0.1]"></div>
            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                   <WhispraLogo />
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
                    {showTwoFactorPrompt ? (
                        <TwoFactorPrompt onSubmit={handleTwoFactorSubmit} onBack={() => setShowTwoFactorPrompt(false)} isLoading={loading} />
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h2>
                            <p className="text-gray-400 text-center mb-8">Sign in to continue to Whisspra.</p>
                            <form onSubmit={handleLogin}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="email">Email</label>
                                    <input 
                                        id="email" 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="password">Password</label>
                                    <input 
                                        id="password" 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:bg-indigo-400"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging In...' : 'Log In'}
                                </button>
                            </form>
                            <div className="flex items-center my-6">
                                <div className="flex-grow border-t border-slate-600"></div>
                                <span className="flex-shrink mx-4 text-gray-400">OR</span>
                                <div className="flex-grow border-t border-slate-600"></div>
                            </div>
                             <button 
                                onClick={handleAnonymousLogin}
                                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? '...' : 'Continue Anonymously'}
                            </button>
                            <p className="text-center text-gray-400 mt-8">
                                Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">Sign up</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;