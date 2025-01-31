"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/app/services/api';

interface User {
  username: string;
  email: string;
  id: string;
  avatarUrl?: string;
  library?: {
    tracks_count: number;
    albums_count: number;
    playlists_count: number;
  }
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthed = await authApi.checkAuth();
        if (isAuthed) {
          const userData = localStorage.getItem('userData');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};