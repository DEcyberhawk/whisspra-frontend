

import React from 'react';
import { User } from '../../types';
import Avatar from '../Avatar';

interface IncomingCallModalProps {
    caller: User;
    onAccept: () => void;
    onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ caller, onAccept, onDecline }) => {
    return (
        <div className="fixed bottom-5 right-5 z-[100] bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-4 w-full max-w-sm animate-fade-in-right">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <Avatar avatar={caller.avatar} name={caller.name} size="lg" className="w-12 h-12 text-xl" />
                </div>
                <div className="ml-4 flex-1">
                    <p className="font-bold text-white">{caller.name}</p>
                    <p className="text-sm text-slate-300">Incoming video call...</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={onDecline} className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-full text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <button onClick={onAccept} className="w-10 h-10 flex items-center justify-center bg-green-600 hover:bg-green-700 rounded-full text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;