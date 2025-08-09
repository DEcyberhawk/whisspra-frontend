
import React, { useState } from 'react';
import { GroupConversation, User } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface StealthCallSetupModalProps {
    conversation: GroupConversation;
    onClose: () => void;
    onStartCall: (participants: User[]) => void;
}

const StealthCallSetupModal: React.FC<StealthCallSetupModalProps> = ({ conversation, onClose, onStartCall }) => {
    const { user: currentUser } = useAuth();
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const handleToggleUser = (user: User) => {
        setSelectedUsers(prev =>
            prev.some(u => u.id === user.id)
                ? prev.filter(u => u.id !== user.id)
                : [...prev, user]
        );
    };

    const handleSubmit = () => {
        if (selectedUsers.length > 0) {
            onStartCall(selectedUsers);
        }
    };

    const availableMembers = conversation.members.filter(m => m.id !== currentUser?.id);

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold text-white mb-2">Setup Stealth Call</h2>
                <p className="text-slate-400 mb-6">Select participants to include. Each will receive a 1-on-1 call from you.</p>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mb-6">
                    {availableMembers.map(member => (
                        <div 
                            key={member.id} 
                            onClick={() => handleToggleUser(member)}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedUsers.some(u => u.id === member.id) ? 'bg-indigo-500/30' : 'hover:bg-slate-700'}`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedUsers.some(u => u.id === member.id)}
                                onChange={() => {}} // Click is handled by the div
                                className="h-4 w-4 rounded border-slate-500 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm ml-3">{member.avatar}</div>
                            <span className="ml-3 text-white">{member.name}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={selectedUsers.length === 0}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
                >
                    Start Stealth Call with {selectedUsers.length} {selectedUsers.length === 1 ? 'person' : 'people'}
                </button>
            </div>
        </div>
    );
};

export default StealthCallSetupModal;
