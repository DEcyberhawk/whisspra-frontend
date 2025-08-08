import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

const API_URL = 'http://localhost:5000/api';

export interface AppSettings {
    logoUrl: string | null;
    primaryColor: string;
    accentColor: string;
    companyName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    aboutUs: string;
    founderName: string;
    founderInfo: string;
    founderContact: string;
}

interface SettingsContextType {
    settings: AppSettings | null;
    loading: boolean;
    refetchSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/settings`);
            if (!response.ok) throw new Error('Failed to fetch settings');
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error(error);
            // Set default settings on error
            setSettings({
                logoUrl: null,
                primaryColor: '#6366f1',
                accentColor: '#818cf8',
                companyName: 'Whisspra Inc.',
                contactEmail: '',
                contactPhone: '',
                address: '',
                aboutUs: 'Whisspra is a secure, next-generation chat platform supporting anonymous messaging, whistleblower mode, and creator monetization.',
                founderName: 'Max Collins Botchway',
                founderInfo: 'Founder of Whisspra, dedicated to privacy and secure communication for all.',
                founderContact: '+49017635228757',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    useEffect(() => {
        if (settings) {
            const root = document.documentElement;
            root.style.setProperty('--color-primary', settings.primaryColor);
            root.style.setProperty('--color-accent', settings.accentColor);
        }
    }, [settings]);

    const value = { settings, loading, refetchSettings: fetchSettings };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};