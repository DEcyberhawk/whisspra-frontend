

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api'; // In a real app, use an env variable

const mapUser = (backendUser: any): User => {
    if (!backendUser) return {} as User;
    const user = { ...backendUser, id: backendUser._id };
    delete user._id;
    return user;
}
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        const userData = await response.json();
        setUser(mapUser(userData));
    } catch (error) {
        console.error('Session expired or invalid', error);
        localStorage.removeItem('whisspra_token');
        setUser(null);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('whisspra_token');
      if (token) {
        await fetchUser(token);
      }
      setLoading(false);
    };
    checkUser();
  }, [fetchUser]);
  
  const handleAuthSuccess = (data: any): boolean => {
    if (!data.token || !data.user) {
      setLoading(false);
      return false;
    }
    localStorage.setItem('whisspra_token', data.token);
    const frontendUser = mapUser(data.user);
    setUser(frontendUser);
    setLoading(false);
    return true;
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; twoFactorRequired?: boolean; tempToken?: string; }> => {
    setLoading(true);
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
        setLoading(false);
        throw new Error(data.message || 'Login failed');
    }
    
    if (data.twoFactorRequired) {
        setLoading(false);
        return { success: false, twoFactorRequired: true, tempToken: data.tempToken };
    }
    
    const success = handleAuthSuccess(data);
    return { success };
  };

  const loginWithTwoFactor = async (token: string, tempToken: string): Promise<boolean> => {
    setLoading(true);
    const response = await fetch(`${API_URL}/auth/2fa/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tempToken}` },
        body: JSON.stringify({ token })
    });
    const data = await response.json();
    if (!response.ok) {
        setLoading(false);
        throw new Error(data.message || '2FA verification failed');
    }
    return handleAuthSuccess(data);
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const name = email.split('@')[0]; // Simple name generation
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (!response.ok) {
        setLoading(false);
        throw new Error(data.message || 'Registration failed');
    }
    return handleAuthSuccess(data);
  };

  const anonymousLogin = async (): Promise<boolean> => {
    setLoading(true);
    const response = await fetch(`${API_URL}/auth/anonymous`, { method: 'POST' });
    const data = await response.json();
    if (!response.ok) {
        setLoading(false);
        throw new Error(data.message || 'Anonymous login failed');
    }
    return handleAuthSuccess(data);
  };

  const logout = () => {
    localStorage.removeItem('whisspra_token');
    setUser(null);
  };

  const updateUserProfile = async (data: Partial<User>) => {
      if (!user) return;
      const token = localStorage.getItem('whisspra_token');
      try {
          setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
          const response = await fetch(`${API_URL}/users/profile`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error('Failed to update profile');
          const updatedUser = await response.json();
          setUser(mapUser(updatedUser));
      } catch (error) {
          console.error("Error updating profile", error);
          if(token) await fetchUser(token);
      }
  };
  
  const updateUserPresence = async (presence: { status: string; message?: string }) => {
    if (!user) return;
    const token = localStorage.getItem('whisspra_token');
    try {
        setUser(prevUser => prevUser ? { ...prevUser, presence: presence as User['presence'] } : null);
        const response = await fetch(`${API_URL}/users/presence`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(presence)
        });
        if (!response.ok) throw new Error('Failed to update presence');
        const updatedPresence = await response.json();
        setUser(prevUser => prevUser ? { ...prevUser, presence: updatedPresence } : null);
    } catch (error) {
        console.error("Error updating presence", error);
         if(token) await fetchUser(token);
    }
  };

  const disableTwoFactor = async (password: string): Promise<boolean> => {
    const token = localStorage.getItem('whisspra_token');
    const response = await fetch(`${API_URL}/auth/2fa/disable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ password })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to disable 2FA');
    }
    if (token) await fetchUser(token);
    return true;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    anonymousLogin,
    updateUserProfile,
    updateUserPresence: updateUserPresence as AuthContextType['updateUserPresence'],
    fetchUser,
    loginWithTwoFactor,
    disableTwoFactor
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};