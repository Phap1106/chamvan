'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type UserRole = 'USER' | 'ADMIN' | 'SUPPORT_ADMIN';
type AuthCtx = {
  isLoggedIn: boolean;
  role: UserRole | null;
  login: (role?: UserRole) => void; // demo: cho login dưới vai trò bất kỳ
  logout: () => void;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const r = localStorage.getItem('role') as UserRole | null;
    setIsLoggedIn(!!t);
    setRole(r);
  }, []);

  const login = (r: UserRole = 'USER') => {
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('role', r);
    setIsLoggedIn(true);
    setRole(r);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
  };

  const value = useMemo(() => ({ isLoggedIn, role, login, logout }), [isLoggedIn, role]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
};
