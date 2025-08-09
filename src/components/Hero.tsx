
import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-accent)] text-sm font-semibold py-1 px-3 rounded-full mb-4">
            Next-Generation Private Messaging
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-200 tracking-tight">
            Speak Freely. <br />
            Chat Securely.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
            Whisspra is the anonymous, encrypted chat platform designed for absolute privacy. From whistleblower protection to creator monetization, we empower secure communication for everyone.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-[var(--color-primary)] hover:brightness-90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-[var(--color-primary)]/20 transform hover:scale-105"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;