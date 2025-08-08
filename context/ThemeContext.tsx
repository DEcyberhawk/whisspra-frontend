

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Theme, ThemeContextType } from '../types';
import { useAuth } from './AuthContext';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [theme, setThemeState] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('whisspra_theme') as Theme;
        return storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });

    useEffect(() => {
        if (user?.theme) {
            setThemeState(user.theme);
        }
    }, [user?.theme]);
    
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        // We don't save to localStorage here, as persistence is handled via user profile
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('whisspra_theme', theme); // Still save for non-logged-in users
    }, [theme]);
    
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};