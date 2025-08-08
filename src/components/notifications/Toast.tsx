import React, { useEffect, useState } from 'react';
import { Notification } from '../../types';

interface ToastProps {
    notification: Notification;
    onDismiss: () => void;
}

const icons = {
    success: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    error: (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    info: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

const Toast: React.FC<ToastProps> = ({ notification, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onDismiss, 300); // Allow time for exit animation
        }, 4700);

        return () => clearTimeout(timer);
    }, [onDismiss]);
    
    const handleDismiss = () => {
         setIsExiting(true);
         setTimeout(onDismiss, 300);
    }

    const animationClasses = isExiting 
        ? 'animate-fade-out-right' 
        : 'animate-fade-in-right';

    return (
        <div 
            className={`flex items-start p-4 w-full max-w-sm bg-slate-800 border border-slate-700 rounded-xl shadow-lg ${animationClasses}`}
            role="alert"
        >
            <div className="flex-shrink-0">
                {icons[notification.type]}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-white">{notification.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button onClick={handleDismiss} className="inline-flex text-slate-400 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-800">
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};


const styleId = 'toast-animations';
if (!document.getElementById(styleId)) {
    const styles = `
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-fade-in-right { animation: fadeInRight 0.3s ease-out forwards; }

    @keyframes fadeOutRight {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(100%); }
    }
    .animate-fade-out-right { animation: fadeOutRight 0.3s ease-in forwards; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default Toast;