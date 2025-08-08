
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const BusinessHero: React.FC = () => (
    <section className="py-24 sm:py-32 text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-accent)] text-sm font-semibold py-1 px-3 rounded-full mb-4">
            For Teams, Creators & Organizations
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-200 tracking-tight">
            The Secure Hub for <br /> Modern Collaboration.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
            Whisspra provides the tools your organization needs to communicate securely, monetize content, and manage your community with an all-in-one, privacy-first platform.
          </p>
          <div className="mt-10">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-[var(--color-primary)] hover:brightness-90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-[var(--color-primary)]/20 transform hover:scale-105"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </div>
    </section>
);

const businessFeatures = [
    { 
        title: "Encrypted Team Chat", 
        description: "Collaborate with confidence in end-to-end encrypted chat rooms. Manage roles, create private threads, and ensure your team's sensitive discussions remain confidential.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    },
    { 
        title: "Creator Monetization", 
        description: "Build your community and earn directly. Whisspra integrates tipping, subscriptions, and a digital marketplace for selling goods like templates, bots, or content packs.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    },
    { 
        title: "Full Admin Control", 
        description: "Manage your platform with a powerful admin dashboard. Monitor analytics, track user activity, review flagged content, and manage roles and permissions with ease.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    { 
        title: "Custom Branding", 
        description: "Make Whisspra your own. Admins can upload a custom logo and change the primary and accent colors to match their brand identity for a fully white-labeled experience.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
    },
    { 
        title: "Developer API & Webhooks", 
        description: "Integrate Whisspra into your existing workflows. Generate secure API keys to build custom bots, connect third-party services, and receive real-time moderation alerts via webhooks.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
    },
    { 
        title: "Verified Profiles", 
        description: "Establish trust and authenticity within your community. Our admin-managed verification system allows you to approve and grant verified badges to creators, public figures, or team leaders.",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
];

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-primary)]/50 hover:bg-slate-800/80 hover:-translate-y-1">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </div>
);

const BusinessFeatures: React.FC = () => (
     <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Built for Your Organization</h2>
          <p className="mt-4 text-lg text-gray-400">
            From secure internal communications to public-facing communities, Whisspra provides a flexible and powerful toolset.
          </p>
        </div>
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessFeatures.map(feature => (
                <FeatureCard key={feature.title} {...feature} />
            ))}
        </div>
      </div>
    </section>
);

const BusinessPage: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className={`${theme} bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 min-h-screen font-sans antialiased`}>
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-700/[0.05] dark:bg-grid-slate-700/[0.2] [mask-image:linear-gradient(to_bottom,white_10%,transparent_100%)]"></div>
            <div className="relative z-10">
                <Header />
                <main>
                    <BusinessHero />
                    <BusinessFeatures />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default BusinessPage;