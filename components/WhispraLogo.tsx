
import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const WhispraLogo: React.FC = () => {
    const { settings, loading } = useSettings();

    if (loading) {
        return <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse"></div>;
    }

    if (settings?.logoUrl) {
        return (
            <Link to="/" className="flex items-center space-x-2 group" aria-label="Whisspra Home">
                <img src={settings.logoUrl} alt="Custom Logo" className="w-8 h-8 object-contain" />
                <span className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300 tracking-tight">Whisspra</span>
            </Link>
        );
    }
    
    // Default SVG Logo
    return (
      <Link to="/" className="flex items-center space-x-2 group" aria-label="Whisspra Home">
        <svg
          className="w-8 h-8 text-[var(--color-accent)] group-hover:brightness-90 transition-colors duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10z"></path>
            <path d="M8 10l2 2 2-4 2 4 2-2"></path>
        </svg>
        <span className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300 tracking-tight">Whisspra</span>
      </Link>
    );
};

export default WhispraLogo;