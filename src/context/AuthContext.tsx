import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

type User = {
  id: string;
  email?: string;
  anonymous?: boolean;
  [k: string]: any;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  anonymousLogin: () => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  register: async () => false,
  login: async () => false,
  anonymousLogin: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");
    if (token && rawUser) {
      setUser(JSON.parse(rawUser));
    }
  }, []);

  const persistSession = (token: string, userObj: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Your backend should respond: { token, user }
      const res = await api.post("/api/auth/register", { email, password });
      persistSession(res.data.token, res.data.user);
      return true;
    } catch (e: any) {
      console.error("Register error:", e?.response?.data || e?.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      persistSession(res.data.token, res.data.user);
      return true;
    } catch (e: any) {
      console.error("Login error:", e?.response?.data || e?.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const anonymousLogin = async () => {
    setLoading(true);
    try {
      // Adjust to your actual guest endpoint:
      // Try common paths; change if your backend differs.
      let res;
      try {
        res = await api.post("/api/auth/anonymous-login");
      } catch {
        res = await api.post("/api/auth/guest");
      }
      persistSession(res.data.token, res.data.user ?? { id: "guest", anonymous: true });
      return true;
    } catch (e: any) {
      console.error("Anonymous login error:", e?.response?.data || e?.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, anonymousLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
