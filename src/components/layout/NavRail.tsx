import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { name: 'Chat', path: '/chat', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { name: 'Echoes', path: '/echoes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
    { name: 'Live', path: '/live', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0m-12.728 0l12.728 12.728" /></svg> },
    { name: 'Dreamscapes', path: '/dreamscapes', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
    { name: 'Market', path: '/market', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
    { name: 'EDU', path: '/edu', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.568 1.84L10 9.75l7.824-2.288a1 1 0 00.568-1.84l-7-3.5z" /><path d="M3 9.75L10 12.03l7-2.28V15a1 1 0 01-1 1h-3v3a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3H6a1 1 0 01-1-1V9.75z" /></svg> },
    { name: 'Wallet', path: '/wallet', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
];

const NavRail: React.FC = () => {
    return (
        <nav className="w-20 bg-white dark:bg-[#202225] p-3 flex flex-col items-center flex-shrink-0 space-y-4">
            <div className="font-bold text-lg tracking-tighter text-slate-800 dark:text-white p-2 rounded-full bg-slate-200 dark:bg-slate-700">W</div>
            <ul className="flex-grow space-y-2">
                {navItems.map(item => (
                    <li key={item.name}>
                        <NavLink 
                          to={item.path} 
                          className={({ isActive }) => `flex items-center justify-center p-3 rounded-xl transition-colors duration-200 ${isActive ? 'bg-indigo-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                          title={item.name}
                        >
                            {item.icon}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavRail;
