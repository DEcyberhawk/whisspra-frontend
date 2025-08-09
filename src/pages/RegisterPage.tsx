import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WhispraLogo from '../components/WhispraLogo';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, anonymousLogin, loading } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    try {
      const success = await register(email.trim(), password);
      if (success) navigate('/chat');
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message || err?.message;
      console.error("Registration failed", apiMsg);
      // Show friendlier text if it was a network/URL issue
      const isFetchFail = /Failed to fetch|Network Error|ECONNREFUSED|CORS/i.test(apiMsg || "");
      setError(isFetchFail
        ? 'Cannot reach the server. Check your API URL (VITE_API_BASE) and CORS settings.'
        : (apiMsg || 'Registration failed. Please try again.'));
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      const success = await anonymousLogin();
      if (success) navigate('/chat');
    } catch (error) {
      console.error("Anonymous login failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col justify-center items-center p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-700/[0.1]"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <WhispraLogo className="max-h-10 w-auto mx-auto" /> {/* keeps logo small */}
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white text-center mb-2">Create Account</h2>
          <p className="text-gray-400 text-center mb-8">Join Whisspra to chat securely.</p>
          <form onSubmit={handleRegister}>
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
            <div className="mb-4">
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
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-500/20 disabled:bg-indigo-400"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
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
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
