

import React from 'react';
import { User } from '../../types';
import Avatar from '../Avatar';

interface ParticipantAvatarProps {
    participant: { user: User, isSpeaking: boolean };
}

const ParticipantAvatar: React.FC<ParticipantAvatarProps> = ({ participant }) => {
    return (
        <div className="flex flex-col items-center space-y-2 text-center">
            <Avatar 
                avatar={participant.user.avatar} 
                name={participant.user.name} 
                size="lg" 
                className={`transition-all duration-200 ${participant.isSpeaking ? 'ring-4 ring-green-400 shadow-lg shadow-green-400/30' : 'ring-2 ring-slate-600'}`}
            />
            <p className="text-xs text-slate-300 truncate w-20">{participant.user.name}</p>
        </div>
    );
};

export default ParticipantAvatar;