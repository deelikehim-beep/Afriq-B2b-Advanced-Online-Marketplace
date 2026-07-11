import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_USER, type AppUser } from '@/constants/data';

interface AuthContextType {
  isLoggedIn: boolean;
  user: AppUser | null;
  isLoading: boolean;
  login: (method: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
        setIsLoggedIn(true);
        setUser(DEMO_USER);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (method: string) => {
    await AsyncStorage.setItem('@afriq_auth', JSON.stringify({ method, userId: DEMO_USER.id, ts: Date.now() }));
    setUser(DEMO_USER);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@afriq_auth');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
