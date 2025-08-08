import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const UpgradePage: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className={`${theme} bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 min-h-screen font-sans antialiased`}>
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-700/[0.05] dark:bg-grid-slate-700/[0.2] [mask-image:linear-gradient(to_bottom,white_10%,transparent_100%)]"></div>
            <div className="relative z-10">
                <Header />
                <main className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-200 tracking-tight">
                        Unlock More Power
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
                        Upgrade your account to access exclusive features like Stealth Calling, advanced AI tools, and more.
                    </p>

                    <div className="mt-12 p-8 bg-slate-800/50 border border-slate-700 rounded-2xl">
                         <h2 className="text-2xl font-bold text-white">Upgrade Plans Coming Soon!</h2>
                         <p className="mt-4 text-gray-400">We're putting the finishing touches on our premium subscription tiers. Check back soon to elevate your Whisspra experience.</p>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default UpgradePage;
