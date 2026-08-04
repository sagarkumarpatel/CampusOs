'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, setAccessToken, getAccessToken } from '../lib/api';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'CLUB_MANAGER' | 'EVENT_ORGANIZER';
  profile?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    bio?: string | null;
    skills: string[];
    college?: string | null;
    graduationYear?: number | null;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, passwordHash: string) => Promise<void>;
  register: (email: string, passwordHash: string, firstName: string, lastName: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  updateProfileState: (profileData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshSession = async (): Promise<boolean> => {
    try {
      const data = await apiFetch('/auth/refresh', { method: 'POST', skipAuth: true });
      setAccessToken(data.accessToken);
      
      const profile = await apiFetch('/users/profile');
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        profile,
      });
      return true;
    } catch (err) {
      setAccessToken(null);
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshSession();
      setLoading(false);
    };

    initializeAuth();

    const handleLogoutEvent = () => {
      setUser(null);
      router.push('/auth/login');
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, []);

  const login = async (email: string, passwordHash: string) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: passwordHash }),
      skipAuth: true,
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
    router.push('/dashboard');
  };

  const register = async (email: string, passwordHash: string, firstName: string, lastName: string, role: string) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password: passwordHash, firstName, lastName, role }),
      skipAuth: true,
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      // Ignore logout errors
    } finally {
      setAccessToken(null);
      setUser(null);
      router.push('/auth/login');
    }
  };

  const updateProfileState = (profileData: any) => {
    if (user) {
      setUser({
        ...user,
        profile: profileData,
      });
    }
  };

  // Redirect if not logged in and trying to access protected paths
  useEffect(() => {
    if (!loading) {
      const isAuthPath = pathname.startsWith('/auth');
      const isRootPath = pathname === '/';
      
      if (!user && !isAuthPath && !isRootPath) {
        router.push('/auth/login');
      } else if (user && isAuthPath) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshSession, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
