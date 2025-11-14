'use client';

import { create } from 'zustand';

type User = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (u: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (u) =>
    set({
      user: u,
      isAuthenticated: !!u,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
