import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type User = {
  name: string;
  email: string;
  role: 'buyer' | 'vendor';
  phone?: string;
  location?: string;
  profileImageUrl?: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('market_mirror_auth');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse auth from localStorage");
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('market_mirror_auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('market_mirror_auth');
    }
  }, [user]);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
