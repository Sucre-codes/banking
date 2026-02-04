import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setSession: (token: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const readSession = () => {
  const stored = localStorage.getItem('banking-session');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as { token: string; user: AuthUser };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initial = readSession();
  const [token, setToken] = useState<string | null>(initial?.token ?? null);
  const [user, setUser] = useState<AuthUser | null>(initial?.user ?? null);

  const setSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem('banking-session', JSON.stringify({ token: nextToken, user: nextUser }));
  }, []);

  const updateUser = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    if (token) {
      localStorage.setItem('banking-session', JSON.stringify({ token, user: nextUser }));
    }
  }, [token]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('banking-session');
  }, []);

  const value = useMemo(() => ({ user, token, setSession, updateUser, logout }), [user, token, setSession, updateUser, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};
