import React from 'react';

const featurePhases = [
  {
    phase: "Core Security & Privacy",
    features: [
      { title: "End-to-End Encryption", description: "Your conversations are locked. Only you and the recipient have the keys." },
      { title: "True Anonymity", description: "Sign up with a single click—no email or phone number required." },
      { title: "Whistleblower Mode", description: "Disguise the app as a calculator with emergency data-wipe shortcuts." },
      { title: "Temporal Disguise Mode (TDM)", description: "Temporarily hide or disguise sensitive chats based on time, behavior, or phone actions." },
      { title: "2FA Security", description: "Two-factor authentication for creators and admins for an extra layer of security." },
      { title: "Deepfake/Scam Detector", description: "AI-powered scanner warns users of potentially fake or malicious media and links." },
    ]
  },
  {
    phase: "Advanced Communication",
    features: [
      { title: "Real-Time Chat", description: "1-on-1 and group messaging with admin/member roles, typing indicators, and online status." },
      { title: "Voice & Video Calls", description: "Encrypted peer-to-peer audio/video calling with screen sharing." },
      { title: "Stealth Conference Calling", description: "Initiate secure group calls where each participant sees only a 1-on-1 call interface." },
      { title: "Live Voice Rooms", description: "Drop-in audio chat rooms with spatial audio and AI-powered real-time transcription." },
      { title: "Media & File Sharing", description: "Securely send images, voice notes, videos, and documents." },
      { title: "P2P & Mesh Networking", description: "Chat directly with nearby devices via QR code connection (no internet) and support for future mesh networking." },
      { title: "Whisper Threads", description: "Start a private side-conversation within a group chat, visible only to the participants." },
    ]
  },
  {
    phase: "AI-Powered Intelligence",
    features: [
      { title: "Cognitive Rooms (C-Rooms)", description: "Smart chat rooms with persistent memory. Ask the AI to recap decisions or find information from chat history." },
      { title: "AI Twin Assistant", description: "Train an AI on your writing style to generate smart replies or even auto-respond when you're busy." },
      { title: "Mood Translator", description: "Rewrite your messages with an AI to sound more confident, professional, or friendly." },
      { title: "Chat-to-Contract", description: "Automatically generate an informal agreement summary from your chat history." },
      { title: "Vibe Timeline", description: "Simulate potential conversation paths before you send a message to see how the other person might react." },
      { title: "AI Study Assistant", description: "In EDU Mode, get AI-powered help with summaries, notes, and explanations." },
    ]
  },
  {
    phase: "Creator & Monetization Tools",
    features: [
      { title: "Tipping & Subscriptions", description: "Earn directly from your followers with a tipping system and premium subscription tiers." },
      { title: "Digital Marketplace", description: "A built-in marketplace for creators to sell digital goods like templates, bots, or caption packs." },
      { title: "Creator Dashboard", description: "Track your earnings, view transaction history, and manage your creator profile." },
      { title: "Verified Profiles", description: "An admin-managed verification system to establish authenticity for creators and public figures." },
      { title: "Roleplay Rooms", description: "Create scripted chat scenarios for interactive storytelling with AI-generated prompts." },
    ]
  },
  {
    phase: "Student & Academic Tools (EDU Mode)",
    features: [
      { title: "Community Lounge", description: "Discover and join academic or social communities like study groups and clubs." },
      { title: "Study Hub", description: "A dedicated space within chats for a shared planner, flashcards, and resource exchange." },
      { title: "Campus Noticeboard", description: "A central hub for official announcements, events, and campus-wide news, managed by admins." },
    ]
  },
  {
    phase: "Platform & User Experience",
    features: [
      { title: "PWA & Offline Support", description: "Install Whisspra as a Progressive Web App on your device and queue messages while offline." },
      { title: "Admin Dashboard", description: "A comprehensive backend for user management, content moderation, analytics, and platform settings." },
      { title: "Customizable Branding", description: "Admins can change the app logo, theme colors, and contact info for white-labeling." },
      { title: "Memory Capsules", description: "Send messages that can only be unlocked at a specific date and time in the future." },
      { title: "Watch Together Mode", description: "Watch YouTube videos in real-time with your group, with synchronized playback." },
      { title: "Developer API", description: "Admins can generate and manage API keys for third-party integrations." },
    ]
  }
];

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:border-[var(--color-primary)]/50 hover:bg-slate-800/80 hover:-translate-y-1">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
    </div>
);


const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">The Complete Whisspra Experience</h2>
          <p className="mt-4 text-lg text-gray-400">
            Whisspra combines cutting-edge privacy, AI intelligence, and creator tools into one powerful platform. Explore every feature that sets us apart.
          </p>
        </div>
        <div className="mt-20 space-y-16">
          {featurePhases.map((phase) => (
            <div key={phase.phase}>
              <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-[var(--color-accent)] mb-8">
                {phase.phase}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {phase.features.map((feature) => (
                  <FeatureCard key={feature.title} title={feature.title} description={feature.description} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;