//src/components/providers/AuthProvider.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Role = 'admin' | 'support_admin' | 'user';
type User = { id: string; email: string; fullName: string; role: Role } | null;

type AuthCtx = {
  user: User;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const isLoggedIn = !!user;

  async function refreshMe() {
    const res = await fetch('/api/auth/me', { cache: 'no-store' });
    if (res.ok) {
      const u = await res.json();
      setUser(u);
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    // Lấy user từ cookie (server → /api/auth/me)
    refreshMe();
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const j = await res.json().catch(()=>({}));
      throw new Error(j.message || 'Đăng nhập thất bại');
    }
    await refreshMe();
  }

  // async function logout() {
  //   await fetch('/api/auth/logout', { method: 'POST' });
  //   setUser(null);
  // }


// src/components/providers/AuthProvider.tsx
async function logout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  setUser(null);
  if (typeof window !== 'undefined') window.location.reload();
}





  return (
    <Ctx.Provider value={{ user, isLoggedIn, login, logout, refreshMe }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
