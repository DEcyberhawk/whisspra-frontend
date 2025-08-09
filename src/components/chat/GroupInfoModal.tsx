
import React, { useState, useEffect } from 'react';
import { Conversation, User, ImageMessage, DocumentMessage } from '../../types';
import Avatar from '../Avatar';

const API_URL = 'http://localhost:5000/api';

interface ConversationInfoModalProps {
    conversation: Conversation;
    currentUser: User;
    onClose: () => void;
    onUpdateGroup: (data: { name?: string, participants?: string[] }) => void;
}

const ConversationInfoModal: React.FC<ConversationInfoModalProps> = ({ conversation, currentUser, onClose, onUpdateGroup }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'media'>('details');
    const [media, setMedia] = useState<{ images: ImageMessage[], documents: DocumentMessage[] }>({ images: [], documents: [] });
    const [isMediaLoading, setIsMediaLoading] = useState(false);

    useEffect(() => {
        if (activeTab !== 'media') return;
        
        const fetchMedia = async () => {
            setIsMediaLoading(true);
            const token = localStorage.getItem('whisspra_token');
            try {
                const response = await fetch(`${API_URL}/chats/${conversation.id}/media`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch media');
                const data = await response.json();
                setMedia(data);
            } catch (error) {
                console.error("Error fetching media:", error);
            } finally {
                setIsMediaLoading(false);
            }
        };

        fetchMedia();
    }, [activeTab, conversation.id]);

    const isGroup = conversation.type === 'group';
    const isAdmin = isGroup && conversation.admin.id === currentUser.id;
    const name = isGroup ? conversation.name : conversation.otherUser.name;
    const userForAvatar = isGroup ? { name: conversation.name, avatar: conversation.name } : conversation.otherUser;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md h-[80vh] flex flex-col border border-slate-700" onClick={e => e.stopPropagation()}>
                <div className="p-6 flex-shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <div className="flex flex-col items-center text-center">
                        <Avatar avatar={userForAvatar.avatar} name={name} size="lg" className="w-24 h-24 text-4xl mb-4" />
                        <h2 className="text-2xl font-bold text-white">{name}</h2>
                        <p className="text-slate-400">{isGroup ? `${conversation.members.length} members` : (conversation.otherUser.isOnline ? 'Online' : 'Offline')}</p>
                    </div>
                </div>

                <div className="px-6 border-b border-slate-700 flex-shrink-0">
                    <div className="flex space-x-4">
                        <button onClick={() => setActiveTab('details')} className={`py-2 border-b-2 font-semibold ${activeTab === 'details' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-slate-400 hover:text-white'}`}>Details</button>
                        <button onClick={() => setActiveTab('media')} className={`py-2 border-b-2 font-semibold ${activeTab === 'media' ? 'border-indigo-400 text-indigo-300' : 'border-transparent text-slate-400 hover:text-white'}`}>Media</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'details' && isGroup && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-white mb-2">Members</h3>
                            {conversation.members.map(member => (
                                <div key={member.id} className="flex items-center p-2 rounded-lg hover:bg-slate-700">
                                    <Avatar avatar={member.avatar} name={member.name} size="md" />
                                    <span className="ml-3 text-white">{member.name} {member.id === conversation.admin.id && <span className="text-xs text-indigo-400">(Admin)</span>}</span>
                                </div>
                            ))}
                        </div>
                    )}
                     {activeTab === 'details' && !isGroup && (
                        <div className="text-slate-300 space-y-2">
                           <p><span className="font-semibold">Bio:</span> {conversation.otherUser.bio || 'Not available.'}</p>
                           <p><span className="font-semibold">Role:</span> <span className="capitalize">{conversation.otherUser.role}</span></p>
                        </div>
                    )}
                    {activeTab === 'media' && (
                        <div>
                            {isMediaLoading ? <p className="text-slate-400 text-center">Loading media...</p> : (
                                <div>
                                    <h3 className="font-semibold text-white mb-2">Images</h3>
                                    {media.images.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {media.images.map(img => <a key={img.id} href={img.imageUrl} target="_blank" rel="noopener noreferrer"><img src={img.imageUrl} className="w-full h-24 object-cover rounded-md" /></a>)}
                                        </div>
                                    ) : <p className="text-sm text-slate-500">No images shared yet.</p>}

                                    <h3 className="font-semibold text-white mt-6 mb-2">Documents</h3>
                                     {media.documents.length > 0 ? (
                                        <div className="space-y-2">
                                            {media.documents.map(doc => (
                                                <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    <span className="ml-3 text-sm text-white truncate">{doc.fileName}</span>
                                                </a>
                                            ))}
                                        </div>
                                    ) : <p className="text-sm text-slate-500">No documents shared yet.</p>}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConversationInfoModal;