
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WhispraLogo from './WhispraLogo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
      { name: "Features", path: "/#features", type: 'anchor' },
      { name: "Security", path: "/#security", type: 'anchor' },
      { name: "For Business", path: "/business", type: 'route' },
      { name: "Contact", path: "/#contact", type: 'anchor' },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleNav = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  }

  const isLandingPage = location.pathname === '/';

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <WhispraLogo />
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            if (link.type === 'anchor' && isLandingPage) {
              return (
                <a key={link.name} href={link.path.substring(1)} className="text-gray-300 hover:text-[var(--color-accent)] transition-colors duration-300">
                  {link.name}
                </a>
              );
            }
            return (
              <Link key={link.name} to={link.path} className="text-gray-300 hover:text-[var(--color-accent)] transition-colors duration-300">
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('/chat')}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Open App
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-[var(--color-accent)] transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleNav('/login')} className="text-gray-300 hover:text-white font-semibold transition-colors duration-300">
                Log In
              </button>
              <button
                onClick={() => handleNav('/register')}
                className="bg-[var(--color-primary)] hover:brightness-90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col space-y-4 px-2 pb-4">
             {navLinks.map((link) => {
              if (link.type === 'anchor' && isLandingPage) {
                 return (
                  <a key={link.name} href={link.path.substring(1)} onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-slate-700 rounded-md py-2 px-3 text-center transition-colors duration-300">
                    {link.name}
                  </a>
                 )
              }
              return (
                 <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className="text-gray-300 hover:bg-slate-700 rounded-md py-2 px-3 text-center transition-colors duration-300">
                   {link.name}
                 </Link>
              )
            })}
            {isAuthenticated ? (
               <>
                 <button onClick={() => handleNav('/chat')} className="bg-[var(--color-primary)] hover:brightness-90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-center">
                   Open App
                 </button>
                 <button onClick={handleLogout} className="text-gray-300 hover:bg-slate-700 rounded-md py-2 px-3 text-center transition-colors duration-300">
                   Logout
                 </button>
               </>
            ) : (
              <>
                 <button onClick={() => handleNav('/login')} className="text-gray-300 hover:bg-slate-700 rounded-md py-2 px-3 text-center transition-colors duration-300">
                   Log In
                 </button>
                 <button onClick={() => handleNav('/register')} className="bg-[var(--color-primary)] hover:brightness-90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-center">
                   Sign Up
                 </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;