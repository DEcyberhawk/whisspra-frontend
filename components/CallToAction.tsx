
import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="relative isolate overflow-hidden bg-slate-800 px-6 py-24 text-center shadow-2xl rounded-2xl sm:px-16 border border-slate-700">
          <div className="absolute -top-24 left-1/2 -z-10 h-64 w-[200%] -translate-x-1/2 scale-x-150 bg-gradient-to-tr from-[var(--color-primary)]/50 to-purple-500/50 blur-2xl sm:h-96" />
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Reclaim Your Privacy?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join the Whisspra beta and experience a new standard in secure messaging. Create an anonymous account in seconds.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-[var(--color-primary)] hover:brightness-90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-[var(--color-primary)]/20 transform hover:scale-105"
            >
              Start Chatting Securely
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;