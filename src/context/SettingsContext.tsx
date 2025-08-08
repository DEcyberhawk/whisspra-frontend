
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { API_URL } from '../config';

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
    featureFlags: Record<string, boolean>;
}

interface SettingsContextType {
    settings: AppSettings | null;
    loading: boolean;
    refetchSettings: () => void;
    isFeatureEnabled: (featureName: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const settingsPromise = fetch(`${API_URL}/settings`);
            const featuresPromise = fetch(`${API_URL}/settings/features`);

            const [settingsResponse, featuresResponse] = await Promise.all([settingsPromise, featuresPromise]);
            
            if (!settingsResponse.ok) throw new Error('Failed to fetch settings');
            const settingsData = await settingsResponse.json();
            
            if (!featuresResponse.ok) throw new Error('Failed to fetch features');
            const featuresData = await featuresResponse.json();

            const featureFlags = featuresData.reduce((acc: any, flag: any) => {
                acc[flag.name] = flag.isEnabled;
                return acc;
            }, {});

            setSettings({ ...settingsData, featureFlags });
            
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
                featureFlags: {},
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

    const isFeatureEnabled = (featureName: string) => {
        return settings?.featureFlags[featureName] ?? false;
    };

    const value = { settings, loading, refetchSettings: fetchSettings, isFeatureEnabled };

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
