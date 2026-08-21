import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../constants/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER_PROFILE);
  const [role, setRole] = useState<UserRole>('customer');

  useEffect(() => {
    const savedRole = localStorage.getItem('qb_role') as UserRole;
    if (savedRole) {
      setRole(savedRole);
      if (user) {
        setUser({ ...user, role: savedRole });
      }
    }
  }, []);

  const login = async (email: string, targetRole: UserRole = 'customer'): Promise<boolean> => {
    const updatedUser: UserProfile = {
      ...INITIAL_USER_PROFILE,
      email,
      role: targetRole,
      name: targetRole === 'admin' ? 'District Ops Admin' : targetRole === 'partner' ? 'Chef & Partner Manager' : 'Alex Thomas'
    };
    setUser(updatedUser);
    setRole(targetRole);
    localStorage.setItem('qb_role', targetRole);
    return true;
  };

  const logout = () => {
    setUser(null);
    setRole('customer');
    localStorage.removeItem('qb_role');
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('qb_role', newRole);
    if (user) {
      setUser({
        ...user,
        role: newRole,
        name: newRole === 'admin' ? 'District Ops Admin' : newRole === 'partner' ? 'Chef & Partner Manager' : newRole === 'delivery' ? 'Rajesh K. (Rider)' : 'Alex Thomas'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole
      }}
    >
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
