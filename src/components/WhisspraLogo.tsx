import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

type Props = {
  className?: string;   // control image size, e.g. "h-8 w-auto"
  showText?: boolean;   // toggle the "Whisspra" wordmark
};

const WhisspraLogo: React.FC<Props> = ({ className = "h-8 w-auto", showText = true }) => {
  const { settings, loading } = useSettings();

  if (loading) {
    return <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse" />;
  }

  const src = settings?.logoUrl || "/whispra-logo.svg"; // fallback to a public asset if no custom logo

  return (
    <Link to="/" className="flex items-center space-x-2 group" aria-label="Whisspra Home">
      <img
        src={src}
        alt="Whisspra"
        className={className}
        loading="eager"
        decoding="async"
        style={{ display: 'inline-block', objectFit: 'contain' }}
      />
      {showText && (
        <span className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300 tracking-tight">
          Whisspra
        </span>
      )}
    </Link>
  );
};

export default WhisspraLogo;
