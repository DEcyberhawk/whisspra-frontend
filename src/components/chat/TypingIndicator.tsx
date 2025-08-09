import React from 'react';

const AiAvatar = () => (
     <div className="w-10 h-10 rounded-full bg-slate-700 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 dark:text-indigo-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.5.88 4.93 1.78c-1.59.68-3.26 1.02-4.93 1.02s-3.34-.34-4.93-1.02zM12 14c-2.03 0-4.44.8-6.35 2.59-.22.22-.35.51-.35.81 0 .66.54 1.2 1.2 1.2.2 0 .39-.06.55-.17C8.68 17.21 10.4 16.4 12 16.4s3.32.81 4.95 1.93c.16.11.35.17.55.17.66 0 1.2-.54 1.2-1.2 0-.3-.13-.59-.35-.81C16.44 14.8 14.03 14 12 14zm-3-3c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm6 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"/>
        </svg>
    </div>
);

const TypingIndicator: React.FC<{ typingText: string }> = ({ typingText }) => {
    const isAiTyping = typingText.toLowerCase().includes('ai');
    
    return (
        <div className="flex items-end space-x-2">
            <div className="flex-shrink-0">
                {isAiTyping
                    ? <AiAvatar />
                    : <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                }
            </div>
            <div className="flex flex-col">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 ml-2">{typingText}</p>
                <div className="flex items-center justify-center space-x-1.5 bg-slate-200 dark:bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse-fast"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse-fast" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse-fast" style={{animationDelay: '0.4s'}}></span>
                </div>
            </div>
        </div>
    );
};

const styleId = 'pulse-fast-animation';
if (!document.getElementById(styleId)) {
    const styles = `
    @keyframes pulse-fast {
      50% { opacity: .5; }
    }
    .animate-pulse-fast {
      animation: pulse-fast 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default TypingIndicator;