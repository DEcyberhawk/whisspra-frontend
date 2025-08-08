
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { API_URL } from '../../config';
import { getStorageItem } from '../../utils/storage';

interface CreateGroupModalProps {
    onClose: () => void;
    onCreateGroup: (groupName: string, selectedUsers: User[], isCognitive: boolean, isRoleplayRoom: boolean) => void;
}

const Toggle: React.FC<{ enabled: boolean; onChange: () => void, label: string, disabled?: boolean }> = ({ enabled, onChange, label, disabled }) => (
    <div className="flex items-center justify-between">
        <span className={`font-medium ${disabled ? 'text-slate-500' : 'text-white'}`}>{label}</span>
        <button
            type="button"
            onClick={onChange}
            disabled={disabled}
            className={`${enabled ? 'bg-indigo-600' : 'bg-slate-600'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300`} />
        </button>
    </div>
);

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onCreateGroup }) => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [groupName, setGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCognitive, setIsCognitive] = useState(false);
    const [isRoleplayRoom, setIsRoleplayRoom] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = await getStorageItem('whisspra_token');
            try {
                const response = await fetch(`${API_URL}/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setAllUsers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleSelectUser = (user: User) => {
        if (selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (groupName.trim() && selectedUsers.length > 0) {
            onCreateGroup(groupName, selectedUsers, isCognitive, isRoleplayRoom);
        }
    };

    const handleToggleRoleplay = () => {
        const newIsRoleplay = !isRoleplayRoom;
        setIsRoleplayRoom(newIsRoleplay);
        if (newIsRoleplay) {
            setIsCognitive(false); // Roleplay rooms are not cognitive
        }
    };

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedUsers.some(su => su.id === user.id)
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">Create Group Chat</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                         <input
                            type="text"
                            placeholder="Search users to add..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 p-2 bg-slate-900/50 rounded-lg min-h-[40px]">
                        {selectedUsers.map(user => (
                            <div key={user.id} className="bg-indigo-500 text-white text-sm font-semibold px-2 py-1 rounded-full flex items-center gap-2">
                                <span>{user.name}</span>
                                <button type="button" onClick={() => handleSelectUser(user)} className="text-indigo-200 hover:text-white">&times;</button>
                            </div>
                        ))}
                    </div>

                    <div className="h-40 overflow-y-auto space-y-2 pr-2 mb-4">
                        {loading ? <p className="text-slate-400">Loading users...</p> : 
                            filteredUsers.map(user => (
                            <div key={user.id} onClick={() => handleSelectUser(user)} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-slate-700">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">{user.avatar}</div>
                                <span className="ml-3 text-white">{user.name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                            <Toggle 
                                enabled={isRoleplayRoom} 
                                onChange={handleToggleRoleplay}
                                label="Create Roleplay Room"
                            />
                            <p className="text-xs text-slate-400 mt-2">AI will generate a scenario and assign characters to everyone.</p>
                        </div>
                         <div className="p-3 bg-slate-700/50 rounded-lg">
                            <Toggle 
                                enabled={isCognitive} 
                                onChange={() => setIsCognitive(!isCognitive)}
                                label="Enable Cognitive AI Features"
                                disabled={isRoleplayRoom}
                            />
                            <p className="text-xs text-slate-400 mt-2">C-Rooms can summarize chats and answer questions. Disabled for roleplay.</p>
                        </div>
                    </div>

                    <button type="submit" disabled={!groupName || selectedUsers.length < 1} className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:bg-indigo-400/50 disabled:cursor-not-allowed">
                        Create Group
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
