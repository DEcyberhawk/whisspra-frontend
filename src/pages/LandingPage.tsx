import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const LandingPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`${theme} bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 min-h-screen font-sans antialiased`}>
      <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-700/[0.05] dark:bg-grid-slate-700/[0.2] [mask-image:linear-gradient(to_bottom,white_10%,transparent_100%)]"></div>
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Features />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;