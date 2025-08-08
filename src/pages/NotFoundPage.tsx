import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const NotFoundPage: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className={`${theme} bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 min-h-screen font-sans antialiased flex items-center justify-center text-center p-4`}>
            <div className="relative z-10">
                <p className="text-6xl sm:text-8xl font-bold text-indigo-500">404</p>
                <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-slate-800 dark:text-white">Page not found</h1>
                <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-400">Sorry, we couldn’t find the page you’re looking for.</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
