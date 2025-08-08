


import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import TwoFactorSetupModal from './auth/TwoFactorSetupModal';
import VerificationModal from './auth/VerificationModal';
import Avatar from './Avatar';
import AvatarGeneratorModal from './auth/AvatarGeneratorModal';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    isWhistleblowerEnabled: boolean;
    onToggleWhistleblower: () => void;
}

const API_URL = 'http://localhost:5000/api';

const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
    <button
        onClick={onChange}
        className={`${
            enabled ? 'bg-indigo-600' : 'bg-slate-600'
        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-800`}
    >
        <span className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300`} />
    </button>
);


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isWhistleblowerEnabled, onToggleWhistleblower }) => {
    const { logout, user, updateUserProfile, fetchUser, disableTwoFactor } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { addNotification } = useNotification();
    const [isTraining, setIsTraining] = useState(false);
    const [isTwoFactorSetupOpen, setIsTwoFactorSetupOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isAvatarGeneratorOpen, setIsAvatarGeneratorOpen] = useState(false);
    
    // Academic Profile State
    const [institution, setInstitution] = useState(user?.academicProfile?.institution || '');
    const [academicStatus, setAcademicStatus] = useState(user?.academicProfile?.status || 'Student');
    const [subjects, setSubjects] = useState(user?.academicProfile?.subjects?.join(', ') || '');


    if (!isOpen) return null;
    
    const handleThemeChange = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        toggleTheme();
        if (!user?.isAnonymous) {
            updateUserProfile({ theme: newTheme });
        }
        addNotification(`Theme set to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    }

    const handleWhistleblowerChange = () => {
        onToggleWhistleblower();
        addNotification(`Whistleblower Mode ${!isWhistleblowerEnabled ? 'Enabled' : 'Disabled'}`, 'info');
        if (!isWhistleblowerEnabled) {
            onClose();
        }
    }

    const handleTrainAiTwin = async () => {
        setIsTraining(true);
        const token = localStorage.getItem('whisspra_token');
        try {
            const response = await fetch(`${API_URL}/ai/twin/train`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to train AI Twin.');
            addNotification('AI Twin successfully trained on your style!', 'success');
            if (token) await fetchUser(token);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addNotification(errorMessage, 'error');
        } finally {
            setIsTraining(false);
        }
    };
    
    const handleDisable2FA = async () => {
        const password = prompt("To disable 2FA, please re-enter your password:");
        if (password) {
            try {
                await disableTwoFactor(password);
                addNotification("Two-Factor Authentication has been disabled.", "success");
            } catch (error: any) {
                addNotification(error.message, 'error');
            }
        }
    }

    const handleSaveAcademicProfile = async () => {
        try {
            await updateUserProfile({
                academicProfile: {
                    institution,
                    status: academicStatus as 'Student' | 'Faculty' | 'Alumni' | 'Staff',
                    subjects: subjects.split(',').map(s => s.trim()).filter(Boolean)
                }
            });
            addNotification('Academic profile updated!', 'success');
        } catch (err) {
            addNotification('Failed to update academic profile.', 'error');
        }
    };
    
    const getVerificationStatus = () => {
        switch (user?.verificationStatus) {
            case 'pending': return { text: 'Pending Review', color: 'text-yellow-400' };
            case 'verified': return { text: 'Verified', color: 'text-green-400' };
            case 'rejected': return { text: 'Rejected', color: 'text-red-400' };
            default: return { text: 'Not Verified', color: 'text-slate-400' };
        }
    };
    const verificationStatus = getVerificationStatus();

    return (
        <>
        {isTwoFactorSetupOpen && (
             <TwoFactorSetupModal
                isOpen={isTwoFactorSetupOpen}
                onClose={() => setIsTwoFactorSetupOpen(false)}
             />
        )}
        {isVerificationModalOpen && (
            <VerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
            />
        )}
        {isAvatarGeneratorOpen && (
            <AvatarGeneratorModal 
                isOpen={isAvatarGeneratorOpen} 
                onClose={() => setIsAvatarGeneratorOpen(false)} 
            />
        )}
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-700 relative max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

                <div className="space-y-4">
                    {/* Profile Section */}
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <Avatar avatar={user?.avatar || ''} name={user?.name || 'A'} size="lg" />
                             <button 
                                onClick={() => setIsAvatarGeneratorOpen(true)}
                                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Change Avatar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.5 3.5z" /></svg>
                            </button>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">{user?.name}</h3>
                            <p className="text-sm text-slate-400">{user?.isAnonymous ? "Anonymous Account" : "Registered User"}</p>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <span className="font-medium text-white">Theme</span>
                        <Toggle enabled={theme === 'dark'} onChange={handleThemeChange} />
                    </div>

                    {/* Whistleblower Mode */}
                     <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                            <span className="font-medium text-white">Whistleblower Mode</span>
                            <p className="text-xs text-slate-400 mt-1">Disguise app as a calculator.</p>
                        </div>
                        <Toggle enabled={isWhistleblowerEnabled} onChange={handleWhistleblowerChange} />
                    </div>
                    
                     {/* Security Section */}
                    {!user?.isAnonymous && (
                        <>
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                            <h3 className="font-medium text-white mb-2">Security</h3>
                            <div className="flex items-center justify-between">
                                 <div>
                                    <span className="font-medium text-white">Two-Factor Authentication</span>
                                    <p className={`text-xs mt-1 ${user?.isTwoFactorEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                                        {user?.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                                    </p>
                                </div>
                                {user?.isTwoFactorEnabled ? (
                                    <button onClick={handleDisable2FA} className="text-sm bg-red-500/20 text-red-300 hover:bg-red-500/40 px-3 py-1 rounded-md">Disable</button>
                                ) : (
                                    <button onClick={() => setIsTwoFactorSetupOpen(true)} className="text-sm bg-indigo-500/80 text-white hover:bg-indigo-500 px-3 py-1 rounded-md">Enable</button>
                                )}
                            </div>
                        </div>
                        {/* Identity Verification */}
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                            <h3 className="font-medium text-white mb-2">Identity Verification</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-medium text-white">Status</span>
                                    <p className={`text-xs mt-1 ${verificationStatus.color}`}>
                                        {verificationStatus.text}
                                    </p>
                                </div>
                                {user?.verificationStatus === 'none' || user?.verificationStatus === 'rejected' ? (
                                    <button onClick={() => setIsVerificationModalOpen(true)} className="text-sm bg-indigo-500/80 text-white hover:bg-indigo-500 px-3 py-1 rounded-md">
                                        {user?.verificationStatus === 'rejected' ? 'Re-submit' : 'Get Verified'}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                        </>
                    )}

                    {/* Academic Profile Section */}
                    {!user?.isAnonymous && (
                         <div className="p-3 bg-slate-700/50 rounded-lg space-y-3">
                             <h3 className="font-medium text-white">Academic Profile</h3>
                             <input type="text" placeholder="Institution (e.g., University of Pluto)" value={institution} onChange={e => setInstitution(e.target.value)} className="w-full bg-slate-700 p-2 rounded-md text-sm" />
                             <select value={academicStatus} onChange={e => setAcademicStatus(e.target.value as 'Student' | 'Faculty' | 'Alumni' | 'Staff')} className="w-full bg-slate-700 p-2 rounded-md text-sm">
                                 <option>Student</option>
                                 <option>Faculty</option>
                                 <option>Alumni</option>
                                 <option>Staff</option>
                             </select>
                             <input type="text" placeholder="Subjects (comma-separated)" value={subjects} onChange={e => setSubjects(e.target.value)} className="w-full bg-slate-700 p-2 rounded-md text-sm" />
                             <button onClick={handleSaveAcademicProfile} className="w-full text-sm bg-indigo-500/80 text-white hover:bg-indigo-500 px-3 py-2 rounded-md">Save Academic Info</button>
                        </div>
                    )}

                    {/* AI Twin Section */}
                    {!user?.isAnonymous && (
                         <div className="p-3 bg-slate-700/50 rounded-lg">
                            <div>
                                <span className="font-medium text-white">AI Twin</span>
                                <p className="text-xs text-slate-400 mt-1">Train an AI on your writing style to get personalized reply suggestions.</p>
                                {user.aiTwinLastTrained && (
                                     <p className="text-xs text-indigo-300 mt-2">Last trained: {new Date(user.aiTwinLastTrained).toLocaleString()}</p>
                                )}
                            </div>
                            <button 
                                onClick={handleTrainAiTwin}
                                disabled={isTraining}
                                className="w-full mt-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {isTraining ? 'Training...' : (user.aiTwinLastTrained ? 'Re-train AI Twin' : 'Train AI Twin')}
                            </button>
                        </div>
                    )}
                    
                    {/* Logout Button */}
                    <button 
                        onClick={logout}
                        className="w-full text-left p-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default SettingsModal;