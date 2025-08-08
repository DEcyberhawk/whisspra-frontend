
import React, { useState, useMemo } from 'react';
import { GroupConversation, User } from '../../../types';

interface ScenarioInfoBannerProps {
    conversation: GroupConversation;
    currentUser: User;
}

const ScenarioInfoBanner: React.FC<ScenarioInfoBannerProps> = ({ conversation, currentUser }) => {
    const [isVisible, setIsVisible] = useState(true);

    const userRole = useMemo(() => {
        return conversation.roleplaySettings?.characterRoles.find(role => role.userId.toString() === currentUser.id);
    }, [conversation, currentUser]);

    if (!isVisible || !conversation.isRoleplayRoom || !userRole) {
        return null;
    }

    return (
        <div className="bg-indigo-900/50 text-indigo-200 p-3 flex items-start justify-between text-sm border-b border-indigo-800/50">
            <div className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div>
                    <p className="font-bold">Welcome to the Roleplay!</p>
                    <p className="mt-1"><span className="font-semibold text-indigo-300">Your Role:</span> {userRole.characterName}</p>
                    <p className="mt-1 text-indigo-300/80"><span className="font-semibold text-indigo-300">Scenario:</span> {conversation.roleplaySettings?.scenario}</p>
                </div>
            </div>
            <button onClick={() => setIsVisible(false)} className="p-1 rounded-full hover:bg-indigo-800/50 flex-shrink-0 ml-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default ScenarioInfoBanner;
