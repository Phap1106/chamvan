
// src/components/providers/CartProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthProvider';

export type CartLine = {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
};

type AddPayload = {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
};

type CartCtx = {
  items: CartLine[];
  add: (payload: AddPayload) => void;
  updateQty: (id: string, color: string | undefined, next: number) => void;
  remove: (id: string, color?: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartCtx | null>(null);
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}

const STORAGE_KEY = 'cv_cart_v1';

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartLine[]>([]);

  // hydrate từ localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: CartLine[] = JSON.parse(raw);
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // ❗️Không đăng nhập → xoá sạch giỏ + localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      setItems([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, [isLoggedIn]);

  const add: CartCtx['add'] = (payload) => {
    if (!isLoggedIn) {
      // chặn thêm giỏ khi chưa đăng nhập
      throw new Error('NOT_LOGGED_IN');
    }
    const { id, qty, color } = payload;
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id && x.color === color);
      if (i >= 0) {
        const cloned = [...prev];
        cloned[i] = { ...cloned[i], qty: cloned[i].qty + qty };
        return cloned;
      }
      const line: CartLine = { ...payload };
      return [...prev, line];
    });
  };

  const updateQty = (id: string, color: string | undefined, next: number) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id && it.color === color ? { ...it, qty: Math.max(1, next) } : it)),
    );
  };

  const remove = (id: string, color?: string) => {
    setItems((prev) => prev.filter((x) => !(x.id === id && x.color === color)));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  const value: CartCtx = { items, add, updateQty, remove, clear, count, subtotal };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
