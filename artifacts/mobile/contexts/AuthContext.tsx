import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEMO_USER, type AppUser } from '@/constants/data';

interface AuthContextType {
  isLoggedIn: boolean;
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const authUrl = (path: string) => {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  return `${domain ? `https://${domain}` : ''}/api/auth${path}`;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem('@afriq_auth');
      if (stored) {
        const { token } = JSON.parse(stored) as { token?: string };
        if (!token) throw new Error('Missing session token');
        const response = await fetch(authUrl('/get-session'), { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error('Session expired');
        const session = await response.json();
        if (!session?.user) throw new Error('Session expired');
        setUser({ ...DEMO_USER, id: session.user.id, name: session.user.name, email: session.user.email });
        setIsLoggedIn(true);
      }
    } catch {
      await AsyncStorage.removeItem('@afriq_auth');
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async (path: string, body: Record<string, string>) => {
    const response = await fetch(authUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.message ?? 'Unable to authenticate.');
    const token = payload?.token ?? payload?.session?.token;
    if (!token) throw new Error('Authentication succeeded without a session token.');
    await AsyncStorage.setItem('@afriq_auth', JSON.stringify({ token }));
    const sessionUser = payload?.user ?? payload?.session?.user ?? {};
    setUser({ ...DEMO_USER, id: sessionUser.id ?? DEMO_USER.id, name: sessionUser.name ?? DEMO_USER.name, email: sessionUser.email ?? body.email });
    setIsLoggedIn(true);
  };

  const login = async (email: string, password: string) => authenticate('/sign-in/email', { email, password });
  const signUp = async (email: string, password: string, name: string) => authenticate('/sign-up/email', { email, password, name });

  const logout = async () => {
    await AsyncStorage.removeItem('@afriq_auth');
    setUser(null);
    setIsLoggedIn(false);
  };

  const getToken = useCallback(async () => {
    const stored = await AsyncStorage.getItem('@afriq_auth');
    return stored ? (JSON.parse(stored) as { token?: string }).token ?? null : null;
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, signUp, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
